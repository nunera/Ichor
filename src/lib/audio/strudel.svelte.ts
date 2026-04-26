import { audio } from './engine.svelte';

type StrudelHandle = {
	evaluate: (code: string) => Promise<void>;
	stop: () => void;
	pause: () => void;
};

class StrudelBridge {
	loaded = $state(false);
	playing = $state(false);
	error = $state<string | null>(null);
	code = $state(`note("c3 eb3 g3 bb3").s("ichor").slow(2)`);

	#handle: StrudelHandle | null = null;

	async ensureLoaded() {
		if (this.loaded) return;
		try {
			const [core, mini, transpiler] = await Promise.all([
				import('@strudel/core'),
				import('@strudel/mini'),
				import('@strudel/transpiler')
			]);

			await audio.start();
			await core.evalScope(core, mini);

			// Register our custom controls with Strudel so they exist in the global scope
			core.registerControl('cutoff');
			core.registerControl('res');
			core.registerControl('attack');
			core.registerControl('hold');
			core.registerControl('decay');
			core.registerControl('sustain');
			core.registerControl('release');
			core.registerControl('lfoRate');
			core.registerControl('lfoAmount');
			core.registerControl('osc1Type');
			core.registerControl('osc1Level');
			core.registerControl('osc1Octave');
			core.registerControl('osc1Semi');
			core.registerControl('osc1Fine');
			core.registerControl('osc2Type');
			core.registerControl('osc2Level');
			core.registerControl('osc2Octave');
			core.registerControl('osc2Semi');
			core.registerControl('osc2Fine');
			// Pulse / unison
			core.registerControl('osc1Width');
			core.registerControl('osc1Unison');
			core.registerControl('osc1Spread');
			core.registerControl('osc2Width');
			core.registerControl('osc2Unison');
			core.registerControl('osc2Spread');
			// Filter / LFO shapes
			core.registerControl('filterType');
			core.registerControl('lfoShape');
			// Sub osc
			core.registerControl('subEnabled');
			core.registerControl('subType');
			core.registerControl('subOctave');
			core.registerControl('subLevel');
			core.registerControl('subPan');
			// Noise
			core.registerControl('noiseEnabled');
			core.registerControl('noiseType');
			core.registerControl('noiseLevel');
			core.registerControl('noisePan');
			// Voicing
			core.registerControl('voiceMode');
			core.registerControl('glide');

			let activePattern: any = null;
			let isPlaying = false;
			let timerId: ReturnType<typeof setTimeout> | null = null;

			// A simple lookahead scheduler. We query the pattern for events
			// occurring in [now, now + lookahead), schedule them via Tone/AudioEngine,
			// and then wait until the next tick.
			const LOOKAHEAD = 0.1; // seconds
			const TICK = 25; // ms
			let nextWindowStart = 0;

			const tick = () => {
				if (!isPlaying || !activePattern) return;

				const now = audio.now();

				// Initialize time on first tick
				if (nextWindowStart === 0) {
					nextWindowStart = now;
				}

				// If we've fallen behind, snap to now
				if (nextWindowStart < now) {
					nextWindowStart = now;
				}

				const windowEnd = now + LOOKAHEAD;

				// Query the pattern for events in [nextWindowStart, windowEnd)
				// Strudel arcs are just start and end times in cycles (we assume 1 cycle = 1 second for simplicity,
				// or we can just use seconds directly if CPS isn't set, default is 1 cps).
				if (nextWindowStart < windowEnd) {
					const haps = activePattern.queryArc(nextWindowStart, windowEnd);

					for (const hap of haps) {
						const v = hap.value;

						// 1. Note Triggering (only at the exact start of the whole event)
						if (v?.s === 'ichor') {
							const eventStart = hap.whole ? hap.whole.begin.valueOf() : hap.time;

							// If the event actually STARTS in this window, trigger the envelope
							if (eventStart >= nextWindowStart && eventStart < windowEnd) {
								const note = typeof v.note === 'number' ? midiToName(v.note) : v.note || 'C4';
								const startTime = eventStart;
								const duration = hap.whole
									? hap.whole.end.valueOf() - hap.whole.begin.valueOf()
									: hap.duration;

								audio.attack(note, startTime);
								audio.release(note, startTime + duration * 0.95);
							}
						}

						// 2. Continuous Parameter Updates (apply for every hap segment in the window)
						if (v?.cutoff !== undefined) {
							// Map Strudel's 0-1 range to the 20-20000 Hz our Zod schema expects
							const hz = 20 + v.cutoff * 19980;
							audio.setFilter({ cutoff: hz }, 'remote');
						}

						if (v?.res !== undefined) {
							// Map Strudel's 0-1 range to the 0.1-20 resonance our Zod schema expects
							const res = 0.1 + v.res * 19.9;
							audio.setFilter({ resonance: res }, 'remote');
						}

						if (
							v?.attack !== undefined ||
							v?.hold !== undefined ||
							v?.decay !== undefined ||
							v?.sustain !== undefined ||
							v?.release !== undefined
						) {
							audio.setEnvelope(
								{
									...(v.attack !== undefined && { attack: v.attack }),
									...(v.hold !== undefined && { hold: v.hold }),
									...(v.decay !== undefined && { decay: v.decay }),
									...(v.sustain !== undefined && { sustain: v.sustain }),
									...(v.release !== undefined && { release: v.release })
								},
								'remote'
							);
						}

						if (v?.lfoRate !== undefined || v?.lfoAmount !== undefined) {
							audio.setLFO(
								{
									...(v.lfoRate !== undefined && { rate: v.lfoRate }),
									...(v.lfoAmount !== undefined && { amount: v.lfoAmount })
								},
								'remote'
							);
						}

						if (
							v?.osc1Type !== undefined ||
							v?.osc1Level !== undefined ||
							v?.osc1Octave !== undefined ||
							v?.osc1Semi !== undefined ||
							v?.osc1Fine !== undefined ||
							v?.osc1Width !== undefined ||
							v?.osc1Unison !== undefined ||
							v?.osc1Spread !== undefined
						) {
							const type = v.osc1Type === 'saw' ? 'sawtooth' : v.osc1Type;
							audio.setOsc1(
								{
									...(type !== undefined && { type }),
									...(v.osc1Level !== undefined && { level: v.osc1Level }),
									...(v.osc1Octave !== undefined && { octave: v.osc1Octave }),
									...(v.osc1Semi !== undefined && { semi: v.osc1Semi }),
									...(v.osc1Fine !== undefined && { fine: v.osc1Fine }),
									...(v.osc1Width !== undefined && { width: v.osc1Width }),
									...(v.osc1Unison !== undefined && { unison: v.osc1Unison }),
									...(v.osc1Spread !== undefined && { spread: v.osc1Spread })
								},
								'remote'
							);
						}

						if (
							v?.osc2Type !== undefined ||
							v?.osc2Level !== undefined ||
							v?.osc2Octave !== undefined ||
							v?.osc2Semi !== undefined ||
							v?.osc2Fine !== undefined ||
							v?.osc2Width !== undefined ||
							v?.osc2Unison !== undefined ||
							v?.osc2Spread !== undefined
						) {
							const type = v.osc2Type === 'saw' ? 'sawtooth' : v.osc2Type;
							audio.setOsc2(
								{
									...(type !== undefined && { type }),
									...(v.osc2Level !== undefined && { level: v.osc2Level }),
									...(v.osc2Octave !== undefined && { octave: v.osc2Octave }),
									...(v.osc2Semi !== undefined && { semi: v.osc2Semi }),
									...(v.osc2Fine !== undefined && { fine: v.osc2Fine }),
									...(v.osc2Width !== undefined && { width: v.osc2Width }),
									...(v.osc2Unison !== undefined && { unison: v.osc2Unison }),
									...(v.osc2Spread !== undefined && { spread: v.osc2Spread })
								},
								'remote'
							);
						}

						// Filter type ('lp', 'hp', 'bp', 'nt' shorthand also accepted)
						if (v?.filterType !== undefined) {
							const ft = v.filterType;
							const map: Record<string, 'lowpass' | 'highpass' | 'bandpass' | 'notch'> = {
								lp: 'lowpass',
								lowpass: 'lowpass',
								hp: 'highpass',
								highpass: 'highpass',
								bp: 'bandpass',
								bandpass: 'bandpass',
								nt: 'notch',
								notch: 'notch'
							};
							const t = map[ft];
							if (t) audio.setFilter({ type: t }, 'remote');
						}

						// LFO shape
						if (v?.lfoShape !== undefined) {
							const shape = v.lfoShape === 'saw' ? 'sawtooth' : v.lfoShape;
							if (['sine', 'square', 'triangle', 'sawtooth'].includes(shape)) {
								audio.setLFO({ shape }, 'remote');
							}
						}

						// Sub osc
						if (
							v?.subEnabled !== undefined ||
							v?.subType !== undefined ||
							v?.subOctave !== undefined ||
							v?.subLevel !== undefined ||
							v?.subPan !== undefined
						) {
							const subType = v.subType === 'saw' ? 'sawtooth' : v.subType;
							audio.setSub(
								{
									...(v.subEnabled !== undefined && { enabled: !!v.subEnabled }),
									...(subType !== undefined && { type: subType }),
									...(v.subOctave !== undefined && { octave: v.subOctave }),
									...(v.subLevel !== undefined && { level: v.subLevel }),
									...(v.subPan !== undefined && { pan: v.subPan })
								},
								'remote'
							);
						}

						// Noise
						if (
							v?.noiseEnabled !== undefined ||
							v?.noiseType !== undefined ||
							v?.noiseLevel !== undefined ||
							v?.noisePan !== undefined
						) {
							audio.setNoise(
								{
									...(v.noiseEnabled !== undefined && { enabled: !!v.noiseEnabled }),
									...(v.noiseType !== undefined && { type: v.noiseType }),
									...(v.noiseLevel !== undefined && { level: v.noiseLevel }),
									...(v.noisePan !== undefined && { pan: v.noisePan })
								},
								'remote'
							);
						}

						// Voicing
						if (v?.voiceMode !== undefined || v?.glide !== undefined) {
							audio.setVoicing(
								{
									...(v.voiceMode !== undefined && { mode: v.voiceMode }),
									...(v.glide !== undefined && { glide: v.glide })
								},
								'remote'
							);
						}
					}
					nextWindowStart = windowEnd;
				}

				timerId = setTimeout(tick, TICK);
			};

			this.#handle = {
				evaluate: async (code: string) => {
					const res = await transpiler.evaluate(code, { transpiler: transpiler.transpiler });
					activePattern = res.pattern || res;

					if (!isPlaying) {
						isPlaying = true;
						nextWindowStart = audio.now();
						tick();
					}
				},
				stop: () => {
					isPlaying = false;
					if (timerId) clearTimeout(timerId);
					nextWindowStart = 0;
					audio.releaseAll();
				},
				pause: () => {
					isPlaying = false;
					if (timerId) clearTimeout(timerId);
					audio.releaseAll();
				}
			};

			this.loaded = true;
			this.error = null;
		} catch (e) {
			this.error = e instanceof Error ? e.message : String(e);
			throw e;
		}
	}

	async play() {
		try {
			await this.ensureLoaded();
			if (!this.#handle) return;
			await this.#handle.evaluate(this.code);
			this.playing = true;
			this.error = null;
		} catch (e) {
			this.error = e instanceof Error ? e.message : String(e);
		}
	}

	pause() {
		if (!this.#handle) return;
		this.#handle.pause();
		this.playing = false;
	}

	stop() {
		if (!this.#handle) return;
		this.#handle.stop();
		this.playing = false;
	}

	setCode(code: string) {
		this.code = code;
	}
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
function midiToName(n: number): string {
	const o = Math.floor(n / 12) - 1;
	return `${NOTE_NAMES[((n % 12) + 12) % 12]}${o}`;
}

export const strudel = new StrudelBridge();
