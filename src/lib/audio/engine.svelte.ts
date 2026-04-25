import * as Tone from 'tone';

export type Waveform = 'sine' | 'square' | 'sawtooth' | 'triangle';

let synth: Tone.PolySynth | null = null;
let started = $state(false);

export const audio = {
	get started() {
		return started;
	},

	async start() {
		if (started) return;
		await Tone.start();
		synth = new Tone.PolySynth(Tone.Synth).toDestination();
		synth.set({ oscillator: { type: 'sine' } });
		started = true;
	},

	setWaveform(type: Waveform) {
		synth?.set({ oscillator: { type } });
	},

	setVolume(db: number) {
		Tone.getDestination().volume.value = db;
	},

	attack(note: string) {
		synth?.triggerAttack(note);
	},

	release(note: string) {
		synth?.triggerRelease(note);
	}
};
