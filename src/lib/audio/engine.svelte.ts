import * as Tone from 'tone';

export type Waveform = 'sine' | 'square' | 'sawtooth' | 'triangle';

class AudioEngine {
	started = $state(false);
	#synth: Tone.PolySynth | null = null;
	#held = new Set<string>();

	async start() {
		if (this.started) return;
		await Tone.start();
		this.#synth = new Tone.PolySynth(Tone.Synth).toDestination();
		this.#synth.set({ oscillator: { type: 'sine' } });
		// Warm up voices so the first user-triggered note has no allocation latency.
		this.#synth.triggerAttackRelease('C4', 0.001, undefined, 0);
		this.started = true;
	}

	setWaveform(type: Waveform) {
		this.#synth?.set({ oscillator: { type } });
	}

	setVolume(db: number) {
		Tone.getDestination().volume.rampTo(db, 0.05);
	}

	attack(note: string) {
		if (this.#held.has(note)) return;
		this.#held.add(note);
		this.#synth?.triggerAttack(note);
	}

	release(note: string) {
		if (!this.#held.delete(note)) return;
		this.#synth?.triggerRelease(note);
	}

	releaseAll() {
		if (!this.#synth) return;
		for (const note of this.#held) this.#synth.triggerRelease(note);
		this.#held.clear();
	}
}

export const audio = new AudioEngine();
