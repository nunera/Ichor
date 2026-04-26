import * as Tone from 'tone';
import {
	defaultPatch,
	validateSection,
	validatePatch,
	type Patch,
	type OscPatch,
	type Envelope,
	type Filter,
	type LFO,
	type SubOsc,
	type NoisePatch,
	type Voicing,
	type ReverbPatch,
	type DelayPatch,
	type DistortionPatch,
	type ChorusPatch,
	type BitcrusherPatch
} from './patch';

export type {
	Patch,
	OscPatch,
	Waveform,
	SubOsc,
	NoisePatch,
	Voicing,
	ReverbPatch,
	DelayPatch,
	DistortionPatch,
	ChorusPatch,
	BitcrusherPatch
} from './patch';
export { defaultPatch } from './patch';

/**
 * Where a patch write came from. The bidirectional sync layer (JSON editor,
 * network, persistence) will subscribe to writes and ignore ones with its
 * own source tag, preventing echo loops.
 */
export type WriteSource = 'ui' | 'remote' | 'editor' | 'midi' | 'init' | 'preview';

export type WriteEvent =
	| { source: WriteSource; section: 'osc1' | 'osc2'; value: Partial<OscPatch> }
	| { source: WriteSource; section: 'env'; value: Partial<Envelope> }
	| { source: WriteSource; section: 'filter'; value: Partial<Filter> }
	| { source: WriteSource; section: 'lfo'; value: Partial<LFO> }
	| { source: WriteSource; section: 'sub'; value: Partial<SubOsc> }
	| { source: WriteSource; section: 'noise'; value: Partial<NoisePatch> }
	| { source: WriteSource; section: 'voicing'; value: Partial<Voicing> }
	| { source: WriteSource; section: 'reverb'; value: Partial<ReverbPatch> }
	| { source: WriteSource; section: 'delay'; value: Partial<DelayPatch> }
	| { source: WriteSource; section: 'distortion'; value: Partial<DistortionPatch> }
	| { source: WriteSource; section: 'chorus'; value: Partial<ChorusPatch> }
	| { source: WriteSource; section: 'bitcrusher'; value: Partial<BitcrusherPatch> }
	| { source: WriteSource; section: 'all'; value: Patch };

class AudioEngine {
	started = $state(false);
	patch = $state<Patch>(structuredClone(defaultPatch));

	// PolySynth wraps a voice class (Tone.Synth, Tone.FMSynth, Tone.AMSynth, Tone.PluckSynth).
	// We use `any` because the voice class type changes when synthType is swapped.
	#osc1: Tone.PolySynth<any> | null = null;
	#osc2: Tone.PolySynth<any> | null = null;
	#sub: Tone.PolySynth | null = null;
	// Parallel mono synths used by legato/porta/scale modes — needed because
	// PolySynth allocates a fresh voice per triggerAttack, leaving portamento
	// nothing to glide from. A single Tone.Synth voice glides between
	// consecutive triggerAttacks.
	// Mono companions for glide modes — also shape-shift when synthType changes.
	#osc1Mono: any | null = null;
	#osc2Mono: any | null = null;
	#subMono: Tone.Synth | null = null;
	#osc1Gain: Tone.Gain | null = null;
	#osc2Gain: Tone.Gain | null = null;
	#subGain: Tone.Gain | null = null;
	#subPan: Tone.Panner | null = null;
	#noise: Tone.Noise | null = null;
	#noiseGain: Tone.Gain | null = null;
	#noisePan: Tone.Panner | null = null;
	#noiseEnv: Tone.AmplitudeEnvelope | null = null;
	#filter: Tone.Filter | null = null;
	#cutoffSignal: Tone.Signal<'frequency'> | null = null;
	#lfo: Tone.LFO | null = null;
	#analyser: Tone.Analyser | null = null;
	#fft: Tone.Analyser | null = null;
	// Effects chain order: filter → distortion → bit-drive → bit-crusher → bit-tone → chorus → delay → reverb → out.
	// Bitcrusher gets pre-drive (push it harder) and post tone (LP filter to tame harshness).
	#fxDistortion: Tone.Distortion | null = null;
	#fxBitDrive: Tone.Gain | null = null;
	#fxBitCrusher: Tone.BitCrusher | null = null;
	#fxBitTone: Tone.Filter | null = null;
	#fxChorus: Tone.Chorus | null = null;
	#fxDelay: Tone.PingPongDelay | null = null;
	#fxReverb: Tone.Reverb | null = null;
	#held = new Set<string>();
	#lastNote: string | null = null;
	/** Pitch bend in cents. Range: ±200 cents (= ±2 semitones). */
	#bendCents = 0;
	/** Mod wheel 0..1. Scales LFO depth. */
	#modulation = 0;

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
			type: this.patch.filter.type as BiquadFilterType,
			frequency: this.patch.filter.cutoff,
			Q: this.patch.filter.resonance,
			rolloff: -24
		});

		// Build effects chain: distortion → bit-drive → bitcrusher → bit-tone → chorus → delay → reverb → out.
		// Each effect uses its `wet` param as the active mix; `enabled=false` means wet→0 (bypass).
		const fx = this.patch.effects;

		this.#fxDistortion = new Tone.Distortion({
			distortion: fx.distortion.drive,
			oversample: '2x',
			wet: fx.distortion.enabled ? fx.distortion.mix : 0
		});
		this.#fxBitDrive = new Tone.Gain(fx.bitcrusher.enabled ? fx.bitcrusher.drive : 1);
		this.#fxBitCrusher = new Tone.BitCrusher({
			bits: fx.bitcrusher.bits,
			wet: fx.bitcrusher.enabled ? fx.bitcrusher.mix : 0
		});
		this.#fxBitTone = new Tone.Filter({
			type: 'lowpass',
			frequency: fx.bitcrusher.tone,
			rolloff: -12
		});
		this.#fxChorus = new Tone.Chorus({
			frequency: fx.chorus.rate,
			depth: fx.chorus.depth,
			spread: fx.chorus.spread,
			wet: fx.chorus.enabled ? fx.chorus.mix : 0
		}).start();
		this.#fxDelay = new Tone.PingPongDelay({
			delayTime: fx.delay.time,
			feedback: fx.delay.feedback,
			wet: fx.delay.enabled ? fx.delay.mix : 0
		});
		this.#fxReverb = new Tone.Reverb({
			decay: fx.reverb.decay,
			preDelay: fx.reverb.preDelay,
			wet: fx.reverb.enabled ? fx.reverb.mix : 0
		});
		this.#fxReverb.generate(); // build IR

		this.#filter.chain(
			this.#fxDistortion,
			this.#fxBitDrive,
			this.#fxBitCrusher,
			this.#fxBitTone,
			this.#fxChorus,
			this.#fxDelay,
			this.#fxReverb,
			Tone.getDestination()
		);

		this.#analyser = new Tone.Analyser('waveform', 1024);
		this.#fft = new Tone.Analyser('fft', 1024);
		// Tap analyser at end of chain so the visualizer reflects effects.
		this.#fxReverb.fan(this.#analyser, this.#fft);

		this.#cutoffSignal = new Tone.Signal(this.patch.filter.cutoff, 'frequency');
		this.#cutoffSignal.connect(this.#filter.frequency);

		this.#osc1Gain = new Tone.Gain(
			this.patch.osc1.enabled ? Tone.dbToGain(this.patch.osc1.level) : 0
		).connect(this.#filter);
		this.#osc2Gain = new Tone.Gain(
			this.patch.osc2.enabled ? Tone.dbToGain(this.patch.osc2.level) : 0
		).connect(this.#filter);
		this.#subPan = new Tone.Panner(this.patch.sub.pan).connect(this.#filter);
		this.#subGain = new Tone.Gain(
			this.patch.sub.enabled ? Tone.dbToGain(this.patch.sub.level) : 0
		).connect(this.#subPan);

		// Noise routes through the filter and gates via an AmplitudeEnvelope so
		// it only sounds when notes are held. Without this, the noise generator
		// would drone constantly the moment it's enabled.
		this.#noisePan = new Tone.Panner(this.patch.noise.pan).connect(this.#filter);
		this.#noiseGain = new Tone.Gain(
			this.patch.noise.enabled ? Tone.dbToGain(this.patch.noise.level) : 0
		).connect(this.#noisePan);
		this.#noiseEnv = new Tone.AmplitudeEnvelope({
			attack: this.patch.env.attack,
			decay: this.patch.env.decay,
			sustain: this.patch.env.sustain,
			release: this.patch.env.release
		}).connect(this.#noiseGain);
		this.#noise = new Tone.Noise(this.patch.noise.type).connect(this.#noiseEnv);
		this.#noise.start();

		this.#osc1 = this.#createPolySynth(this.patch.osc1.synthType).connect(this.#osc1Gain);
		this.#osc2 = this.#createPolySynth(this.patch.osc2.synthType).connect(this.#osc2Gain);
		this.#sub = new Tone.PolySynth(Tone.Synth).connect(this.#subGain);
		this.#sub.set({
			oscillator: { type: this.patch.sub.type } as any,
			detune: this.patch.sub.octave * 1200
		});
		// Mono companions for glide modes — synth class mirrors the poly engine.
		this.#osc1Mono = this.#createMonoSynth(this.patch.osc1.synthType).connect(this.#osc1Gain);
		this.#osc2Mono = this.#createMonoSynth(this.patch.osc2.synthType).connect(this.#osc2Gain);
		this.#subMono = new Tone.Synth().connect(this.#subGain);

		const d = this.patch.lfo.enabled ? this.patch.lfo.depth : 0;
		this.#lfo = new Tone.LFO({
			type: this.patch.lfo.shape as Tone.ToneOscillatorType,
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
		this.#sub.triggerAttackRelease('C4', 0.001, undefined, 0);

		this.started = true;
	}

	getWaveform(): Float32Array | null {
		return (this.#analyser?.getValue() as Float32Array | undefined) ?? null;
	}

	getFFT(): Float32Array | null {
		return (this.#fft?.getValue() as Float32Array | undefined) ?? null;
	}

	#detuneCents(o: OscPatch) {
		return o.octave * 1200 + o.semi * 100 + o.fine + this.#bendCents;
	}

	/**
	 * Set pitch bend in semitones (typically -2..+2). Updates the live detune
	 * on all running oscillators in real time.
	 */
	setPitchBend(semitones: number) {
		this.#bendCents = semitones * 100;
		const subDetune = this.patch.sub.octave * 1200 + this.#bendCents;
		this.#osc1?.set({ detune: this.#detuneCents(this.patch.osc1) });
		this.#osc2?.set({ detune: this.#detuneCents(this.patch.osc2) });
		this.#sub?.set({ detune: subDetune });
		if (this.#osc1Mono) this.#osc1Mono.detune.value = this.#detuneCents(this.patch.osc1);
		if (this.#osc2Mono) this.#osc2Mono.detune.value = this.#detuneCents(this.patch.osc2);
		if (this.#subMono) this.#subMono.detune.value = subDetune;
	}

	/**
	 * Set modulation wheel position (0..1). Scales LFO depth on top of the
	 * patch's depth setting, so even a disabled-depth LFO becomes audible
	 * when the wheel is up.
	 */
	setModulation(amount: number) {
		this.#modulation = Math.max(0, Math.min(1, amount));
		if (!this.#lfo) return;
		// Effective depth = patch depth (when LFO enabled) + mod wheel * extra
		const base = this.patch.lfo.enabled ? this.patch.lfo.depth : 0;
		const wheel = this.#modulation * 4000; // up to 4kHz of cutoff sweep at full mod
		const d = base + wheel;
		this.#lfo.min = -d;
		this.#lfo.max = d;
	}

	/**
	 * Build the Tone.js oscillator options for an OscPatch.
	 * - pulse type uses OmniOscillator 'pulse' with width
	 * - unison > 1 uses fat* prefix with count + spread
	 */
	#buildOscOptions(osc: OscPatch): Record<string, unknown> {
		if (osc.type === 'pulse') {
			return { type: 'pulse', width: osc.width };
		}
		if (osc.unison > 1) {
			return { type: `fat${osc.type}`, count: osc.unison, spread: osc.spread };
		}
		return { type: osc.type };
	}

	/** Voice class for a given synth engine. */
	#voiceClass(synthType: OscPatch['synthType']): any {
		switch (synthType) {
			case 'fm':
				return Tone.FMSynth;
			case 'am':
				return Tone.AMSynth;
			case 'pluck':
				return Tone.PluckSynth;
			default:
				return Tone.Synth;
		}
	}

	/**
	 * Build a fresh poly synth for the given engine type. PluckSynth doesn't
	 * support polyphony as smoothly but PolySynth still wraps it.
	 */
	#createPolySynth(synthType: OscPatch['synthType']): Tone.PolySynth<any> {
		return new Tone.PolySynth(this.#voiceClass(synthType));
	}

	/**
	 * Build a fresh mono voice for glide modes. PluckSynth glides oddly so we
	 * still create one; envelope/portamento behaviour will reflect Tone defaults.
	 */
	#createMonoSynth(synthType: OscPatch['synthType']): any {
		const Cls = this.#voiceClass(synthType);
		return new Cls();
	}

	/**
	 * Apply per-engine settings (oscillator shape, FM/AM ratio + index, Pluck
	 * dampening, etc.) to a poly synth.
	 */
	#applyOscEngineSettings(synth: Tone.PolySynth<any> | null, osc: OscPatch) {
		if (!synth) return;
		const detune = this.#detuneCents(osc);
		switch (osc.synthType) {
			case 'fm':
				synth.set({
					harmonicity: osc.harmonicity,
					modulationIndex: osc.modIndex,
					oscillator: { type: osc.type } as any,
					modulation: { type: osc.type } as any,
					detune
				} as any);
				break;
			case 'am':
				synth.set({
					harmonicity: osc.harmonicity,
					oscillator: { type: osc.type } as any,
					modulation: { type: osc.type } as any,
					detune
				} as any);
				break;
			case 'pluck':
				// PluckSynth params: attackNoise (0..1+), dampening (Hz), resonance.
				synth.set({
					attackNoise: 0.5 + osc.pluckAttack * 5,
					dampening: osc.pluckDamp,
					resonance: 0.7
				} as any);
				// Pluck doesn't use detune at the synth level, but we set it
				// anyway in case future versions support it; harmless if ignored.
				break;
			default: {
				const o = this.#buildOscOptions(osc) as any;
				synth.set({ oscillator: o, detune });
			}
		}
	}

	/** Same as above but for the mono companion (single voice, no PolySynth). */
	#applyMonoEngineSettings(mono: any, osc: OscPatch) {
		if (!mono) return;
		const detune = this.#detuneCents(osc);
		switch (osc.synthType) {
			case 'fm':
				mono.set?.({
					harmonicity: osc.harmonicity,
					modulationIndex: osc.modIndex,
					oscillator: { type: osc.type },
					modulation: { type: osc.type },
					detune
				});
				break;
			case 'am':
				mono.set?.({
					harmonicity: osc.harmonicity,
					oscillator: { type: osc.type },
					modulation: { type: osc.type },
					detune
				});
				break;
			case 'pluck':
				mono.set?.({
					attackNoise: 0.5 + osc.pluckAttack * 5,
					dampening: osc.pluckDamp,
					resonance: 0.7
				});
				break;
			default: {
				// Tone.Synth doesn't accept fat*/pulse; fall back to base waveform.
				const monoType = osc.type === 'pulse' ? 'square' : osc.type;
				mono.set?.({ oscillator: { type: monoType }, detune });
			}
		}
	}

	#applyOscSettings() {
		this.#applyOscEngineSettings(this.#osc1, this.patch.osc1);
		this.#applyOscEngineSettings(this.#osc2, this.patch.osc2);
		this.#applyMonoEngineSettings(this.#osc1Mono, this.patch.osc1);
		this.#applyMonoEngineSettings(this.#osc2Mono, this.patch.osc2);
		this.#subMono?.set({
			oscillator: { type: this.patch.sub.type } as any,
			detune: this.patch.sub.octave * 1200
		});
	}

	/**
	 * Swap the synth class for an oscillator slot when synthType changes.
	 * Disposes the old synths, builds new ones, reapplies envelope + settings,
	 * reconnects to the gain node. Brief audio gap is unavoidable but minimal.
	 */
	#rebuildOscSynth(which: 'osc1' | 'osc2') {
		const osc = this.patch[which];
		const gain = which === 'osc1' ? this.#osc1Gain : this.#osc2Gain;
		if (!gain) return;

		const oldPoly = which === 'osc1' ? this.#osc1 : this.#osc2;
		const oldMono = which === 'osc1' ? this.#osc1Mono : this.#osc2Mono;
		oldPoly?.releaseAll();
		oldPoly?.dispose();
		oldMono?.triggerRelease?.();
		oldMono?.dispose?.();

		const poly = this.#createPolySynth(osc.synthType).connect(gain);
		const mono = this.#createMonoSynth(osc.synthType).connect(gain);

		if (which === 'osc1') {
			this.#osc1 = poly;
			this.#osc1Mono = mono;
		} else {
			this.#osc2 = poly;
			this.#osc2Mono = mono;
		}

		// Re-apply envelope and engine settings to the freshly built synths.
		this.#applyEnvelope();
		this.#applyOscEngineSettings(poly, osc);
		this.#applyMonoEngineSettings(mono, osc);
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
		// PluckSynth has no AHDSR envelope (it's percussive/physical). Skip
		// applying envelope to slots running pluck so we don't throw.
		if (this.patch.osc1.synthType !== 'pluck') {
			this.#osc1?.set({ envelope: env } as any);
			this.#osc1Mono?.set?.({ envelope: env });
		}
		if (this.patch.osc2.synthType !== 'pluck') {
			this.#osc2?.set({ envelope: env } as any);
			this.#osc2Mono?.set?.({ envelope: env });
		}
		this.#sub?.set({ envelope: env });
		this.#subMono?.set({ envelope: env });
		// Noise uses a separate envelope; mirror the same AHDSR.
		if (this.#noiseEnv) {
			this.#noiseEnv.attack = total;
			this.#noiseEnv.attackCurve = curve as unknown as Tone.EnvelopeCurve;
			this.#noiseEnv.decay = e.decay;
			this.#noiseEnv.sustain = e.sustain;
			this.#noiseEnv.release = e.release;
		}
	}

	#applySub(p: Partial<SubOsc>) {
		const s = this.patch.sub;
		if (p.type !== undefined) {
			this.#sub?.set({ oscillator: { type: s.type } as any });
		}
		if (p.octave !== undefined) {
			this.#sub?.set({ detune: s.octave * 1200 });
		}
		if (p.level !== undefined || p.enabled !== undefined) {
			const t = s.enabled ? Tone.dbToGain(s.level) : 0;
			this.#subGain?.gain.rampTo(t, 0.02);
		}
		if (p.pan !== undefined) {
			this.#subPan?.pan.rampTo(s.pan, 0.02);
		}
	}

	#applyNoise(p: Partial<NoisePatch>) {
		const n = this.patch.noise;
		if (p.type !== undefined && this.#noise) {
			this.#noise.type = n.type;
		}
		if (p.level !== undefined || p.enabled !== undefined) {
			const g = n.enabled ? Tone.dbToGain(n.level) : 0;
			this.#noiseGain?.gain.rampTo(g, 0.02);
		}
		if (p.pan !== undefined) {
			this.#noisePan?.pan.rampTo(n.pan, 0.02);
		}
	}

	#applyOsc(which: 'osc1' | 'osc2', p: Partial<OscPatch>) {
		const target = this.patch[which];
		const gain = which === 'osc1' ? this.#osc1Gain : this.#osc2Gain;

		// Synth engine swap: dispose+rebuild both poly and mono, reapply
		// envelope/settings, then return — no other knobs need handling here
		// because the rebuilder calls applyOscEngineSettings.
		if (p.synthType !== undefined) {
			this.#rebuildOscSynth(which);
			return;
		}

		const synth = which === 'osc1' ? this.#osc1 : this.#osc2;
		const mono = which === 'osc1' ? this.#osc1Mono : this.#osc2Mono;

		// Engine-aware oscillator/parameter changes. We delegate to the
		// per-engine appliers so FM/AM/Pluck-specific fields update correctly.
		const engineParamChanged =
			p.type !== undefined ||
			p.unison !== undefined ||
			p.spread !== undefined ||
			p.width !== undefined ||
			p.harmonicity !== undefined ||
			p.modIndex !== undefined ||
			p.pluckAttack !== undefined ||
			p.pluckDamp !== undefined;
		if (engineParamChanged) {
			this.#applyOscEngineSettings(synth, target);
			this.#applyMonoEngineSettings(mono, target);
		}

		if (p.octave !== undefined || p.semi !== undefined || p.fine !== undefined) {
			const detune = this.#detuneCents(target);
			synth?.set({ detune });
			if (mono?.detune) mono.detune.value = detune;
		}
		if (p.level !== undefined || p.enabled !== undefined) {
			const t = target.enabled ? Tone.dbToGain(target.level) : 0;
			gain?.gain.rampTo(t, 0.02);
		}
	}

	#applyFilter(p: Partial<Filter>) {
		if (p.type !== undefined) this.#filter!.type = p.type as BiquadFilterType;
		if (p.cutoff !== undefined) this.#cutoffSignal?.rampTo(p.cutoff, 0.02);
		if (p.resonance !== undefined) this.#filter?.Q.rampTo(p.resonance, 0.02);
	}

	#applyLFO(p: Partial<LFO>) {
		if (!this.#lfo) return;
		if (p.shape !== undefined) this.#lfo.type = p.shape as Tone.ToneOscillatorType;
		if (p.rate !== undefined) this.#lfo.frequency.rampTo(p.rate, 0.02);
		if (p.depth !== undefined || p.enabled !== undefined) {
			const base = this.patch.lfo.enabled ? this.patch.lfo.depth : 0;
			const d = base + this.#modulation * 4000;
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

	setSub(p: Partial<SubOsc>, source: WriteSource = 'ui') {
		const v = validateSection('sub', p);
		Object.assign(this.patch.sub, v);
		this.#applySub(v);
		this.#emit({ source, section: 'sub', value: v });
	}

	#applyPortamento(time: number) {
		this.#osc1?.set({ portamento: time });
		this.#osc2?.set({ portamento: time });
		this.#sub?.set({ portamento: time });
		if (this.#osc1Mono) this.#osc1Mono.portamento = time;
		if (this.#osc2Mono) this.#osc2Mono.portamento = time;
		if (this.#subMono) this.#subMono.portamento = time;
	}

	#applyVoicing(p: Partial<Voicing>) {
		const v = this.patch.voicing;
		const needsGlide = v.mode === 'legato' || v.mode === 'porta' || v.mode === 'scale';
		if (p.mode !== undefined || p.glide !== undefined) {
			this.#applyPortamento(needsGlide ? v.glide : 0);
		}
	}

	setNoise(p: Partial<NoisePatch>, source: WriteSource = 'ui') {
		const v = validateSection('noise', p);
		Object.assign(this.patch.noise, v);
		this.#applyNoise(v);
		this.#emit({ source, section: 'noise', value: v });
	}

	setVoicing(p: Partial<Voicing>, source: WriteSource = 'ui') {
		const v = validateSection('voicing', p);
		Object.assign(this.patch.voicing, v);
		this.#applyVoicing(v);
		this.#emit({ source, section: 'voicing', value: v });
	}

	/* ---- Effects ----------------------------------------------------------- */

	#applyDistortion(p: Partial<DistortionPatch>) {
		const d = this.patch.effects.distortion;
		if (p.drive !== undefined && this.#fxDistortion) this.#fxDistortion.distortion = d.drive;
		if (p.mix !== undefined || p.enabled !== undefined) {
			this.#fxDistortion?.wet.rampTo(d.enabled ? d.mix : 0, 0.05);
		}
	}

	#applyBitcrusher(p: Partial<BitcrusherPatch>) {
		const b = this.patch.effects.bitcrusher;
		if (p.bits !== undefined && this.#fxBitCrusher) this.#fxBitCrusher.bits.value = b.bits;
		if (p.drive !== undefined) {
			// drive only takes effect when enabled; otherwise gain stays at 1
			this.#fxBitDrive?.gain.rampTo(b.enabled ? b.drive : 1, 0.05);
		}
		if (p.tone !== undefined) this.#fxBitTone?.frequency.rampTo(b.tone, 0.05);
		if (p.mix !== undefined || p.enabled !== undefined) {
			this.#fxBitCrusher?.wet.rampTo(b.enabled ? b.mix : 0, 0.05);
			this.#fxBitDrive?.gain.rampTo(b.enabled ? b.drive : 1, 0.05);
		}
	}

	#applyChorus(p: Partial<ChorusPatch>) {
		const c = this.patch.effects.chorus;
		if (p.rate !== undefined) this.#fxChorus?.frequency.rampTo(c.rate, 0.05);
		if (p.depth !== undefined && this.#fxChorus) this.#fxChorus.depth = c.depth;
		if (p.spread !== undefined && this.#fxChorus) this.#fxChorus.spread = c.spread;
		if (p.mix !== undefined || p.enabled !== undefined) {
			this.#fxChorus?.wet.rampTo(c.enabled ? c.mix : 0, 0.05);
		}
	}

	#applyDelay(p: Partial<DelayPatch>) {
		const d = this.patch.effects.delay;
		if (p.time !== undefined) this.#fxDelay?.delayTime.rampTo(d.time, 0.05);
		if (p.feedback !== undefined) this.#fxDelay?.feedback.rampTo(d.feedback, 0.05);
		if (p.mix !== undefined || p.enabled !== undefined) {
			this.#fxDelay?.wet.rampTo(d.enabled ? d.mix : 0, 0.05);
		}
	}

	#applyReverb(p: Partial<ReverbPatch>) {
		const r = this.patch.effects.reverb;
		if (p.decay !== undefined && this.#fxReverb) {
			this.#fxReverb.decay = r.decay;
			this.#fxReverb.generate(); // re-render impulse
		}
		if (p.preDelay !== undefined && this.#fxReverb) this.#fxReverb.preDelay = r.preDelay;
		if (p.mix !== undefined || p.enabled !== undefined) {
			this.#fxReverb?.wet.rampTo(r.enabled ? r.mix : 0, 0.05);
		}
	}

	setDistortion(p: Partial<DistortionPatch>, source: WriteSource = 'ui') {
		const v = validateSection('distortion', p);
		Object.assign(this.patch.effects.distortion, v);
		this.#applyDistortion(v);
		this.#emit({ source, section: 'distortion', value: v });
	}
	setBitcrusher(p: Partial<BitcrusherPatch>, source: WriteSource = 'ui') {
		const v = validateSection('bitcrusher', p);
		Object.assign(this.patch.effects.bitcrusher, v);
		this.#applyBitcrusher(v);
		this.#emit({ source, section: 'bitcrusher', value: v });
	}
	setChorus(p: Partial<ChorusPatch>, source: WriteSource = 'ui') {
		const v = validateSection('chorus', p);
		Object.assign(this.patch.effects.chorus, v);
		this.#applyChorus(v);
		this.#emit({ source, section: 'chorus', value: v });
	}
	setDelay(p: Partial<DelayPatch>, source: WriteSource = 'ui') {
		const v = validateSection('delay', p);
		Object.assign(this.patch.effects.delay, v);
		this.#applyDelay(v);
		this.#emit({ source, section: 'delay', value: v });
	}
	setReverb(p: Partial<ReverbPatch>, source: WriteSource = 'ui') {
		const v = validateSection('reverb', p);
		Object.assign(this.patch.effects.reverb, v);
		this.#applyReverb(v);
		this.#emit({ source, section: 'reverb', value: v });
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
		this.patch.sub = { ...next.sub };
		this.patch.noise = { ...next.noise };
		this.patch.voicing = { ...next.voicing };
		this.patch.effects = {
			distortion: { ...next.effects.distortion },
			bitcrusher: { ...next.effects.bitcrusher },
			chorus: { ...next.effects.chorus },
			delay: { ...next.effects.delay },
			reverb: { ...next.effects.reverb }
		};
		this.#applyOscSettings();
		this.#applyEnvelope();
		this.#applyFilter(this.patch.filter);
		this.#applyLFO(this.patch.lfo);
		this.#applySub(this.patch.sub);
		this.#applyNoise(this.patch.noise);
		this.#applyVoicing(this.patch.voicing);
		this.#applyDistortion(this.patch.effects.distortion);
		this.#applyBitcrusher(this.patch.effects.bitcrusher);
		this.#applyChorus(this.patch.effects.chorus);
		this.#applyDelay(this.patch.effects.delay);
		this.#applyReverb(this.patch.effects.reverb);
		this.#emit({ source, section: 'all', value: next });
	}

	setVolume(db: number) {
		Tone.getDestination().volume.rampTo(db, 0.05);
	}

	now() {
		return Tone.now();
	}

	#isGlideMode(mode: string): boolean {
		return mode === 'legato' || mode === 'porta' || mode === 'scale';
	}

	#isMonoMode(mode: string): boolean {
		return mode === 'mono' || mode === 'legato' || mode === 'scale';
	}

	attack(note: string, time?: number) {
		if (this.#held.has(note)) return;
		const mode = this.patch.voicing.mode;
		const isMono = this.#isMonoMode(mode);
		const useGlide = this.#isGlideMode(mode);

		// Mono/legato/scale: release any held notes before attacking new one
		if (isMono && this.#held.size > 0) {
			for (const n of this.#held) {
				this.#osc1?.triggerRelease(n, time);
				this.#osc2?.triggerRelease(n, time);
				this.#sub?.triggerRelease(n, time);
			}
			this.#held.clear();
		}

		// Proportional portamento: scale glide time by semitone distance.
		// For all glide modes we route through the mono synths so the single
		// voice can actually glide between consecutive triggers.
		if (mode === 'scale' && this.#lastNote) {
			const f1 = Tone.Frequency(this.#lastNote as Tone.Unit.Frequency).toFrequency();
			const f2 = Tone.Frequency(note as Tone.Unit.Frequency).toFrequency();
			const semitones = Math.abs(Math.log2(f2 / f1) * 12);
			const glide = (semitones / 12) * this.patch.voicing.glide * 2;
			this.#applyPortamento(glide);
		} else if (mode === 'legato' || mode === 'porta') {
			this.#applyPortamento(this.patch.voicing.glide);
		} else {
			this.#applyPortamento(0);
		}

		const wasEmpty = this.#held.size === 0;
		this.#held.add(note);
		this.#lastNote = note;

		if (useGlide) {
			// Glide modes: drive the mono synths. PolySynth voices won't glide
			// because each triggerAttack allocates a fresh voice with no source pitch.
			if (this.patch.osc1.enabled) this.#osc1Mono?.triggerAttack(note, time);
			if (this.patch.osc2.enabled) this.#osc2Mono?.triggerAttack(note, time);
			if (this.patch.sub.enabled) this.#subMono?.triggerAttack(note, time);
		} else {
			if (this.patch.osc1.enabled) this.#osc1?.triggerAttack(note, time);
			if (this.patch.osc2.enabled) this.#osc2?.triggerAttack(note, time);
			if (this.patch.sub.enabled) this.#sub?.triggerAttack(note, time);
		}

		if (this.patch.noise.enabled && wasEmpty) {
			this.#noiseEnv?.triggerAttack(time);
		}
	}

	release(note: string, time?: number) {
		if (!this.#held.delete(note)) return;
		const useGlide = this.#isGlideMode(this.patch.voicing.mode);

		if (useGlide) {
			// In mono glide modes only release when the LAST held note is gone.
			// Earlier note-offs just transfer voice to the still-held key.
			if (this.#held.size === 0) {
				this.#osc1Mono?.triggerRelease(time);
				this.#osc2Mono?.triggerRelease(time);
				this.#subMono?.triggerRelease(time);
			}
		} else {
			this.#osc1?.triggerRelease(note, time);
			this.#osc2?.triggerRelease(note, time);
			this.#sub?.triggerRelease(note, time);
		}

		if (this.#held.size === 0) {
			this.#noiseEnv?.triggerRelease(time);
		}
	}

	releaseAll() {
		for (const n of this.#held) {
			this.#osc1?.triggerRelease(n);
			this.#osc2?.triggerRelease(n);
			this.#sub?.triggerRelease(n);
		}
		this.#osc1Mono?.triggerRelease();
		this.#osc2Mono?.triggerRelease();
		this.#subMono?.triggerRelease();
		this.#held.clear();
		this.#noiseEnv?.triggerRelease();
	}
}

export const audio = new AudioEngine();
