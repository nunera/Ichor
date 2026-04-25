import * as Tone from 'tone';

export type Waveform = 'sine' | 'square' | 'sawtooth' | 'triangle';

export type OscPatch = {
	type: Waveform;
	level: number;
	octave: number; // -3..+3
	semi: number; // -12..+12
	fine: number; // -50..+50 cents
	enabled: boolean;
};

export type Patch = {
	osc1: OscPatch;
	osc2: OscPatch;
	env: { attack: number; hold: number; decay: number; sustain: number; release: number };
	filter: { cutoff: number; resonance: number };
	lfo: { rate: number; depth: number; enabled: boolean };
};

export const defaultPatch: Patch = {
	osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
	osc2: { type: 'square', level: -6, octave: 0, semi: 0, fine: 7, enabled: true },
	env: { attack: 0.01, hold: 0, decay: 0.15, sustain: 0.7, release: 0.4 },
	filter: { cutoff: 4000, resonance: 2 },
	lfo: { rate: 4, depth: 1500, enabled: false }
};

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

	async start() {
		if (this.started) return;
		await Tone.start();

		this.#filter = new Tone.Filter({
			type: 'lowpass',
			frequency: this.patch.filter.cutoff,
			Q: this.patch.filter.resonance,
			rolloff: -24
		}).toDestination();

		// Tap analyser AFTER the filter so visualizers reflect the actual output.
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

	#setOsc(which: 'osc1' | 'osc2', p: Partial<OscPatch>) {
		const target = this.patch[which];
		Object.assign(target, p);
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

	setOsc1(p: Partial<OscPatch>) {
		this.#setOsc('osc1', p);
	}
	setOsc2(p: Partial<OscPatch>) {
		this.#setOsc('osc2', p);
	}

	setEnvelope(p: Partial<Patch['env']>) {
		Object.assign(this.patch.env, p);
		this.#applyEnvelope();
	}

	setFilter(p: Partial<Patch['filter']>) {
		Object.assign(this.patch.filter, p);
		if (p.cutoff !== undefined) this.#cutoffSignal?.rampTo(p.cutoff, 0.02);
		if (p.resonance !== undefined) this.#filter?.Q.rampTo(p.resonance, 0.02);
	}

	setLFO(p: Partial<Patch['lfo']>) {
		Object.assign(this.patch.lfo, p);
		if (!this.#lfo) return;
		if (p.rate !== undefined) this.#lfo.frequency.rampTo(p.rate, 0.02);
		if (p.depth !== undefined || p.enabled !== undefined) {
			const d = this.patch.lfo.enabled ? this.patch.lfo.depth : 0;
			this.#lfo.min = -d;
			this.#lfo.max = d;
		}
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
