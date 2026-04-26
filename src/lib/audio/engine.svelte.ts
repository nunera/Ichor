import * as Tone from 'tone';
import {
	defaultPatch,
	validateSection,
	validatePatch,
	type Patch,
	type OscPatch,
	type Envelope,
	type Filter,
	type LFO
} from './patch';

export type { Patch, OscPatch, Waveform } from './patch';
export { defaultPatch } from './patch';

/**
 * Where a patch write came from. The bidirectional sync layer (JSON editor,
 * network, persistence) will subscribe to writes and ignore ones with its
 * own source tag, preventing echo loops.
 */
export type WriteSource = 'ui' | 'remote' | 'editor' | 'midi' | 'init';

export type WriteEvent =
	| { source: WriteSource; section: 'osc1' | 'osc2'; value: Partial<OscPatch> }
	| { source: WriteSource; section: 'env'; value: Partial<Envelope> }
	| { source: WriteSource; section: 'filter'; value: Partial<Filter> }
	| { source: WriteSource; section: 'lfo'; value: Partial<LFO> }
	| { source: WriteSource; section: 'all'; value: Patch };

class AudioEngine {
	started = $state(false);
	patch = $state<Patch>(structuredClone(defaultPatch));

	#osc1: Tone.PolySynth | null = null;
	#osc2: Tone.PolySynth | null = null;
	#osc1Gain: Tone.Gain | null = null;
	#osc2Gain: Tone.Gain | null = null;
	#filter: Tone.Filter | null = null;
	#cutoffSignal: Tone.Signal<'frequency'> | null = null;
	#lfo: Tone.LFO | null = null;
	#analyser: Tone.Analyser | null = null;
	#fft: Tone.Analyser | null = null;
	#held = new Set<string>();

	#listeners = new Set<(e: WriteEvent) => void>();

	/** Subscribe to patch writes. Returns an unsubscribe fn. */
	subscribe(fn: (e: WriteEvent) => void): () => void {
		this.#listeners.add(fn);
		return () => this.#listeners.delete(fn);
	}

	#emit(e: WriteEvent) {
		for (const fn of this.#listeners) fn(e);
	}

	async start() {
		if (this.started) return;
		await Tone.start();

		this.#filter = new Tone.Filter({
			type: 'lowpass',
			frequency: this.patch.filter.cutoff,
			Q: this.patch.filter.resonance,
			rolloff: -24
		}).toDestination();

		this.#analyser = new Tone.Analyser('waveform', 1024);
		this.#fft = new Tone.Analyser('fft', 1024);
		this.#filter.fan(this.#analyser, this.#fft);

		this.#cutoffSignal = new Tone.Signal(this.patch.filter.cutoff, 'frequency');
		this.#cutoffSignal.connect(this.#filter.frequency);

		this.#osc1Gain = new Tone.Gain(
			this.patch.osc1.enabled ? Tone.dbToGain(this.patch.osc1.level) : 0
		).connect(this.#filter);
		this.#osc2Gain = new Tone.Gain(
			this.patch.osc2.enabled ? Tone.dbToGain(this.patch.osc2.level) : 0
		).connect(this.#filter);

		this.#osc1 = new Tone.PolySynth(Tone.Synth).connect(this.#osc1Gain);
		this.#osc2 = new Tone.PolySynth(Tone.Synth).connect(this.#osc2Gain);

		const d = this.patch.lfo.enabled ? this.patch.lfo.depth : 0;
		this.#lfo = new Tone.LFO({
			frequency: this.patch.lfo.rate,
			min: -d,
			max: d
		});
		this.#lfo.connect(this.#filter.frequency);
		this.#lfo.start();

		this.#applyOscSettings();
		this.#applyEnvelope();

		this.#osc1.triggerAttackRelease('C4', 0.001, undefined, 0);
		this.#osc2.triggerAttackRelease('C4', 0.001, undefined, 0);

		this.started = true;
	}

	getWaveform(): Float32Array | null {
		return (this.#analyser?.getValue() as Float32Array | undefined) ?? null;
	}

	getFFT(): Float32Array | null {
		return (this.#fft?.getValue() as Float32Array | undefined) ?? null;
	}

	#detuneCents(o: OscPatch) {
		return o.octave * 1200 + o.semi * 100 + o.fine;
	}

	#applyOscSettings() {
		this.#osc1?.set({
			oscillator: { type: this.patch.osc1.type },
			detune: this.#detuneCents(this.patch.osc1)
		});
		this.#osc2?.set({
			oscillator: { type: this.patch.osc2.type },
			detune: this.#detuneCents(this.patch.osc2)
		});
	}

	#applyEnvelope() {
		const e = this.patch.env;
		const a = Math.max(0.001, e.attack);
		const h = Math.max(0, e.hold);
		const total = a + h;
		const N = 64;
		const split = a / total;
		const curve: number[] = new Array(N);
		for (let i = 0; i < N; i++) {
			const t = i / (N - 1);
			curve[i] = t <= split ? t / split : 1;
		}
		const env = {
			attack: total,
			attackCurve: curve,
			decay: e.decay,
			sustain: e.sustain,
			release: e.release
		};
		this.#osc1?.set({ envelope: env });
		this.#osc2?.set({ envelope: env });
	}

	#applyOsc(which: 'osc1' | 'osc2', p: Partial<OscPatch>) {
		const target = this.patch[which];
		const synth = which === 'osc1' ? this.#osc1 : this.#osc2;
		const gain = which === 'osc1' ? this.#osc1Gain : this.#osc2Gain;

		if (p.type !== undefined) synth?.set({ oscillator: { type: p.type } });
		if (p.octave !== undefined || p.semi !== undefined || p.fine !== undefined) {
			synth?.set({ detune: this.#detuneCents(target) });
		}
		if (p.level !== undefined || p.enabled !== undefined) {
			const t = target.enabled ? Tone.dbToGain(target.level) : 0;
			gain?.gain.rampTo(t, 0.02);
		}
	}

	#applyFilter(p: Partial<Filter>) {
		if (p.cutoff !== undefined) this.#cutoffSignal?.rampTo(p.cutoff, 0.02);
		if (p.resonance !== undefined) this.#filter?.Q.rampTo(p.resonance, 0.02);
	}

	#applyLFO(p: Partial<LFO>) {
		if (!this.#lfo) return;
		if (p.rate !== undefined) this.#lfo.frequency.rampTo(p.rate, 0.02);
		if (p.depth !== undefined || p.enabled !== undefined) {
			const d = this.patch.lfo.enabled ? this.patch.lfo.depth : 0;
			this.#lfo.min = -d;
			this.#lfo.max = d;
		}
	}

	/* ----------------------- Public, validated setters ---------------------- */

	setOsc1(p: Partial<OscPatch>, source: WriteSource = 'ui') {
		const v = validateSection('osc1', p);
		Object.assign(this.patch.osc1, v);
		this.#applyOsc('osc1', v);
		this.#emit({ source, section: 'osc1', value: v });
	}

	setOsc2(p: Partial<OscPatch>, source: WriteSource = 'ui') {
		const v = validateSection('osc2', p);
		Object.assign(this.patch.osc2, v);
		this.#applyOsc('osc2', v);
		this.#emit({ source, section: 'osc2', value: v });
	}

	setEnvelope(p: Partial<Envelope>, source: WriteSource = 'ui') {
		const v = validateSection('env', p);
		Object.assign(this.patch.env, v);
		this.#applyEnvelope();
		this.#emit({ source, section: 'env', value: v });
	}

	setFilter(p: Partial<Filter>, source: WriteSource = 'ui') {
		const v = validateSection('filter', p);
		Object.assign(this.patch.filter, v);
		this.#applyFilter(v);
		this.#emit({ source, section: 'filter', value: v });
	}

	setLFO(p: Partial<LFO>, source: WriteSource = 'ui') {
		const v = validateSection('lfo', p);
		Object.assign(this.patch.lfo, v);
		this.#applyLFO(v);
		this.#emit({ source, section: 'lfo', value: v });
	}

	/**
	 * Replace the entire patch atomically. Validates the full schema first;
	 * applies every section to the audio graph; emits a single 'all' event.
	 */
	loadPatch(value: unknown, source: WriteSource = 'editor') {
		const next = validatePatch(value);
		this.patch.osc1 = { ...next.osc1 };
		this.patch.osc2 = { ...next.osc2 };
		this.patch.env = { ...next.env };
		this.patch.filter = { ...next.filter };
		this.patch.lfo = { ...next.lfo };
		this.#applyOsc('osc1', this.patch.osc1);
		this.#applyOsc('osc2', this.patch.osc2);
		this.#applyEnvelope();
		this.#applyFilter(this.patch.filter);
		this.#applyLFO(this.patch.lfo);
		this.#emit({ source, section: 'all', value: next });
	}

	setVolume(db: number) {
		Tone.getDestination().volume.rampTo(db, 0.05);
	}

	attack(note: string) {
		if (this.#held.has(note)) return;
		this.#held.add(note);
		if (this.patch.osc1.enabled) this.#osc1?.triggerAttack(note);
		if (this.patch.osc2.enabled) this.#osc2?.triggerAttack(note);
	}

	release(note: string) {
		if (!this.#held.delete(note)) return;
		this.#osc1?.triggerRelease(note);
		this.#osc2?.triggerRelease(note);
	}

	releaseAll() {
		for (const n of this.#held) {
			this.#osc1?.triggerRelease(n);
			this.#osc2?.triggerRelease(n);
		}
		this.#held.clear();
	}
}

export const audio = new AudioEngine();
