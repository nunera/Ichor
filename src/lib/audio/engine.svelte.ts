import * as Tone from 'tone';

export type Waveform = 'sine' | 'square' | 'sawtooth' | 'triangle';

export type Patch = {
	osc1: { type: Waveform; level: number };
	osc2: { type: Waveform; detune: number; level: number; enabled: boolean };
	env: { attack: number; hold: number; decay: number; sustain: number; release: number };
	filter: { cutoff: number; resonance: number };
	lfo: { rate: number; depth: number; enabled: boolean };
};

export const defaultPatch: Patch = {
	osc1: { type: 'sawtooth', level: 0 },
	osc2: { type: 'square', detune: 7, level: -6, enabled: true },
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

		// Drive filter cutoff through a Signal so the LFO can be summed in via
		// Web Audio's param-summing rules. As soon as ANY signal connects to
		// filter.frequency, Tone zeroes the param's intrinsic value — so we own
		// the value through this signal from here on.
		this.#cutoffSignal = new Tone.Signal(this.patch.filter.cutoff, 'frequency');
		this.#cutoffSignal.connect(this.#filter.frequency);

		this.#osc1Gain = new Tone.Gain(Tone.dbToGain(this.patch.osc1.level)).connect(this.#filter);
		this.#osc2Gain = new Tone.Gain(
			this.patch.osc2.enabled ? Tone.dbToGain(this.patch.osc2.level) : 0
		).connect(this.#filter);

		this.#osc1 = new Tone.PolySynth(Tone.Synth).connect(this.#osc1Gain);
		this.#osc2 = new Tone.PolySynth(Tone.Synth).connect(this.#osc2Gain);

		// Bipolar LFO summed into filter.frequency. min/max are in the units of
		// the destination param (Hz here). When disabled, depth collapses to 0.
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

		// Warm voices so first user note has no allocation latency.
		this.#osc1.triggerAttackRelease('C4', 0.001, undefined, 0);
		this.#osc2.triggerAttackRelease('C4', 0.001, undefined, 0);

		this.started = true;
	}

	#applyOscSettings() {
		this.#osc1?.set({
			oscillator: { type: this.patch.osc1.type },
			detune: 0
		});
		this.#osc2?.set({
			oscillator: { type: this.patch.osc2.type },
			detune: this.patch.osc2.detune
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

	setOsc1(p: Partial<Patch['osc1']>) {
		Object.assign(this.patch.osc1, p);
		if (p.type !== undefined) this.#osc1?.set({ oscillator: { type: p.type } });
		if (p.level !== undefined) this.#osc1Gain?.gain.rampTo(Tone.dbToGain(p.level), 0.02);
	}

	setOsc2(p: Partial<Patch['osc2']>) {
		Object.assign(this.patch.osc2, p);
		if (p.type !== undefined) this.#osc2?.set({ oscillator: { type: p.type } });
		if (p.detune !== undefined) this.#osc2?.set({ detune: p.detune });
		if (p.level !== undefined || p.enabled !== undefined) {
			const target = this.patch.osc2.enabled ? Tone.dbToGain(this.patch.osc2.level) : 0;
			this.#osc2Gain?.gain.rampTo(target, 0.02);
		}
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
		this.#osc1?.triggerAttack(note);
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
