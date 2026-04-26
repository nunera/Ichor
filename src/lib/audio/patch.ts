import { z } from 'zod';

/**
 * Canonical schema for an ichor patch.
 *
 * This is the single source of truth: every input that produces a patch
 * (UI knob, JSON editor, network message, MIDI mapping) MUST validate
 * through this schema before reaching the audio engine. The Patch TS type
 * is inferred from the schema so they can never drift apart.
 *
 * Conventions:
 * - All ranges enforce engine-safe bounds. Out-of-range = rejected.
 * - Times in seconds, frequencies in Hz, levels in dB, cents in cents.
 */

export const Waveform = z.enum(['sine', 'square', 'sawtooth', 'triangle', 'pulse']);
export type Waveform = z.infer<typeof Waveform>;

/** Synthesis engine for an oscillator slot. Each engine uses a different
 *  Tone.js synth class under the hood and exposes different params. */
export const SynthType = z.enum(['basic', 'fm', 'am', 'pluck']);
export type SynthType = z.infer<typeof SynthType>;

export const OscPatchSchema = z.object({
	/** Which synthesis engine this oscillator slot uses. */
	synthType: SynthType.default('basic'),
	type: Waveform,
	level: z.number().min(-60).max(12),
	octave: z.number().int().min(-3).max(3),
	semi: z.number().int().min(-12).max(12),
	fine: z.number().min(-50).max(50),
	enabled: z.boolean(),
	/** Unison voice count (1 = off). fat* oscillator when >1. (basic only) */
	unison: z.number().int().min(1).max(8).default(1),
	/** Unison detune spread in cents (active when unison > 1). (basic only) */
	spread: z.number().min(0).max(200).default(0),
	/** Pulse width 0–1 (only affects pulse waveform). (basic only) */
	width: z.number().min(0).max(1).default(0.5),
	/** FM/AM: modulator-to-carrier frequency ratio. */
	harmonicity: z.number().min(0.1).max(20).default(1),
	/** FM only: amount of modulator-to-carrier frequency modulation. */
	modIndex: z.number().min(0).max(50).default(10),
	/** Pluck: sharpness of the initial pluck attack noise (0=soft, 1=hard). */
	pluckAttack: z.number().min(0).max(1).default(0.7),
	/** Pluck: high-frequency dampening of the simulated string (0=bright, 1=mellow). */
	pluckDamp: z.number().min(0).max(7000).default(4000),
	/** Pluck: feedback / sustain of the simulated string (0=thunk, ~0.99=long ringing). */
	pluckResonance: z.number().min(0).max(0.99).default(0.7)
});
export type OscPatch = z.infer<typeof OscPatchSchema>;

export const EnvelopeSchema = z.object({
	attack: z.number().min(0.001).max(10),
	hold: z.number().min(0).max(10),
	decay: z.number().min(0.001).max(10),
	sustain: z.number().min(0).max(1),
	release: z.number().min(0.001).max(10)
});
export type Envelope = z.infer<typeof EnvelopeSchema>;

export const FilterSchema = z.object({
	cutoff: z.number().min(20).max(20000),
	resonance: z.number().min(0.1).max(20),
	type: z.enum(['lowpass', 'highpass', 'bandpass', 'notch']).default('lowpass')
});
export type Filter = z.infer<typeof FilterSchema>;

/**
 * A single mod-matrix routing: this LFO modulates `target` (a stable param
 * id like 'filter.cutoff' or 'osc1.fine'). `amount` is the swing applied to
 * the modulated parameter in its own units (e.g. ±Hz for cutoff, ±dB for
 * level, ±cents for fine).
 */
export const ModRouteSchema = z.object({
	target: z.string().min(1),
	amount: z.number().default(0)
});
export type ModRoute = z.infer<typeof ModRouteSchema>;

export const LFOSchema = z.object({
	rate: z.number().min(0.01).max(40),
	/**
	 * Legacy depth field. Preserved for round-tripping older patches via the
	 * preprocessor that builds a default `filter.cutoff` route from it. The
	 * engine itself does not read this — routes are the source of truth.
	 */
	depth: z.number().min(0).max(10000).default(0),
	enabled: z.boolean(),
	shape: z.enum(['sine', 'square', 'triangle', 'sawtooth']).default('sine'),
	routes: z.array(ModRouteSchema).default([])
});
export type LFO = z.infer<typeof LFOSchema>;

export const SubOscSchema = z.object({
	level: z.number().min(-60).max(0),
	octave: z.number().int().min(-3).max(0),
	enabled: z.boolean(),
	type: z.enum(['sine', 'triangle', 'square', 'sawtooth']).default('sine'),
	pan: z.number().min(-1).max(1).default(0)
});
export type SubOsc = z.infer<typeof SubOscSchema>;

export const VoicingSchema = z.object({
	/**
	 * poly  – standard polyphony, no glide
	 * mono  – last-note priority, envelope retriggers, no glide
	 * legato – monophonic + portamento (pitch slides, envelope retriggers)
	 * porta  – polyphonic + portamento (each voice glides)
	 * scale  – monophonic + proportional portamento (glide scales with interval)
	 */
	mode: z.enum(['poly', 'mono', 'legato', 'porta', 'scale']).default('poly'),
	glide: z.number().min(0).max(2).default(0.08)
});
export type Voicing = z.infer<typeof VoicingSchema>;

export const NoiseSchema = z.object({
	enabled: z.boolean(),
	type: z.enum(['white', 'pink', 'brown']).default('white'),
	level: z.number().min(-60).max(0).default(-12),
	pan: z.number().min(-1).max(1).default(0)
});
export type NoisePatch = z.infer<typeof NoiseSchema>;

/* ----- Effects ----------------------------------------------------------- */

export const ReverbSchema = z.object({
	enabled: z.boolean().default(false),
	decay: z.number().min(0.1).max(20).default(2.5),
	preDelay: z.number().min(0).max(0.5).default(0.01),
	mix: z.number().min(0).max(1).default(0.3)
});
export type ReverbPatch = z.infer<typeof ReverbSchema>;

export const DelaySchema = z.object({
	enabled: z.boolean().default(false),
	time: z.number().min(0.001).max(2).default(0.25),
	feedback: z.number().min(0).max(0.95).default(0.4),
	pingPong: z.boolean().default(true),
	mix: z.number().min(0).max(1).default(0.25)
});
export type DelayPatch = z.infer<typeof DelaySchema>;

export const DistortionSchema = z.object({
	enabled: z.boolean().default(false),
	drive: z.number().min(0).max(1).default(0.4),
	mix: z.number().min(0).max(1).default(1)
});
export type DistortionPatch = z.infer<typeof DistortionSchema>;

export const ChorusSchema = z.object({
	enabled: z.boolean().default(false),
	rate: z.number().min(0.01).max(10).default(1.5),
	depth: z.number().min(0).max(1).default(0.5),
	spread: z.number().min(0).max(180).default(90),
	mix: z.number().min(0).max(1).default(0.5)
});
export type ChorusPatch = z.infer<typeof ChorusSchema>;

export const BitcrusherSchema = z.object({
	enabled: z.boolean().default(false),
	/** Bit depth, 1-16. Lower = crunchier. */
	bits: z.number().int().min(1).max(16).default(8),
	/** Pre-gain into crusher to push it harder (0-2x). */
	drive: z.number().min(0).max(2).default(1),
	/** Post-crusher low-pass cutoff (Hz) to tame harshness/aliasing. */
	tone: z.number().min(200).max(20000).default(20000),
	mix: z.number().min(0).max(1).default(1)
});
export type BitcrusherPatch = z.infer<typeof BitcrusherSchema>;

export const EffectsSchema = z.object({
	distortion: DistortionSchema.default({ enabled: false, drive: 0.4, mix: 1 }),
	bitcrusher: BitcrusherSchema.default({
		enabled: false,
		bits: 8,
		drive: 1,
		tone: 20000,
		mix: 1
	}),
	chorus: ChorusSchema.default({
		enabled: false,
		rate: 1.5,
		depth: 0.5,
		spread: 90,
		mix: 0.5
	}),
	delay: DelaySchema.default({
		enabled: false,
		time: 0.25,
		feedback: 0.4,
		pingPong: true,
		mix: 0.25
	}),
	reverb: ReverbSchema.default({
		enabled: false,
		decay: 2.5,
		preDelay: 0.01,
		mix: 0.3
	})
});
export type EffectsPatch = z.infer<typeof EffectsSchema>;

/**
 * Legacy migration: older patches stored a single `lfo` with hardcoded
 * cutoff routing via `depth`. Promote `lfo` → `lfo1` with a route to
 * `filter.cutoff` derived from old depth; stub a disabled `lfo2`. New
 * patches that already have `lfo1`/`lfo2` pass through.
 */
function migrateLegacyLfo(raw: unknown): unknown {
	if (!raw || typeof raw !== 'object') return raw;
	const r = raw as Record<string, unknown>;
	if (!('lfo' in r) || 'lfo1' in r) return r;
	const old = (r.lfo ?? {}) as Record<string, unknown>;
	const depth = typeof old.depth === 'number' ? old.depth : 0;
	const existingRoutes = Array.isArray(old.routes) ? (old.routes as unknown[]) : [];
	const routes =
		existingRoutes.length > 0 ? existingRoutes : [{ target: 'filter.cutoff', amount: depth }];
	const lfo1 = { ...old, routes };
	const lfo2 = { rate: 4, depth: 0, enabled: false, shape: 'sine', routes: [] };
	const { lfo: _drop, ...rest } = r;
	void _drop;
	return { ...rest, lfo1, lfo2 };
}

const PatchObject = z.object({
	osc1: OscPatchSchema,
	osc2: OscPatchSchema,
	env: EnvelopeSchema,
	filter: FilterSchema,
	lfo1: LFOSchema,
	lfo2: LFOSchema,
	sub: SubOscSchema.default({ level: -6, octave: -1, enabled: false, type: 'sine', pan: 0 }),
	noise: NoiseSchema.default({ enabled: false, type: 'white', level: -12, pan: 0 }),
	voicing: VoicingSchema.default({ mode: 'poly', glide: 0.08 }),
	effects: EffectsSchema.default({
		distortion: { enabled: false, drive: 0.4, mix: 1 },
		bitcrusher: { enabled: false, bits: 8, drive: 1, tone: 20000, mix: 1 },
		chorus: { enabled: false, rate: 1.5, depth: 0.5, spread: 90, mix: 0.5 },
		delay: { enabled: false, time: 0.25, feedback: 0.4, pingPong: true, mix: 0.25 },
		reverb: { enabled: false, decay: 2.5, preDelay: 0.01, mix: 0.3 }
	})
});

export const PatchSchema = z.preprocess(migrateLegacyLfo, PatchObject);
export type Patch = z.infer<typeof PatchObject>;

/**
 * Input type — new fields with defaults are optional. Use for presets /
 * inbound JSON. Includes the legacy `lfo` field as an optional alternative
 * to `lfo1`/`lfo2` so 300+ existing presets typecheck unchanged; the
 * preprocessor migrates them at parse time.
 */
type PatchObjectInput = z.input<typeof PatchObject>;
export type PatchInput =
	| PatchObjectInput
	| (Omit<PatchObjectInput, 'lfo1' | 'lfo2'> & {
			lfo?: {
				rate?: number;
				depth?: number;
				enabled?: boolean;
				shape?: string;
				routes?: unknown[];
			};
			lfo1?: undefined;
			lfo2?: undefined;
	  });

export const defaultPatch: Patch = {
	osc1: {
		synthType: 'basic',
		type: 'sawtooth',
		level: 0,
		octave: 0,
		semi: 0,
		fine: 0,
		enabled: true,
		unison: 1,
		spread: 0,
		width: 0.5,
		harmonicity: 1,
		modIndex: 10,
		pluckAttack: 0.7,
		pluckDamp: 4000,
		pluckResonance: 0.7
	},
	osc2: {
		synthType: 'basic',
		type: 'square',
		level: -6,
		octave: 0,
		semi: 0,
		fine: 7,
		enabled: true,
		unison: 1,
		spread: 0,
		width: 0.5,
		harmonicity: 1,
		modIndex: 10,
		pluckAttack: 0.7,
		pluckDamp: 4000,
		pluckResonance: 0.7
	},
	env: { attack: 0.01, hold: 0, decay: 0.15, sustain: 0.7, release: 0.4 },
	filter: { cutoff: 4000, resonance: 2, type: 'lowpass' },
	lfo1: {
		rate: 4,
		depth: 1500,
		enabled: false,
		shape: 'sine',
		routes: [{ target: 'filter.cutoff', amount: 1500 }]
	},
	lfo2: { rate: 2, depth: 0, enabled: false, shape: 'triangle', routes: [] },
	sub: { level: -6, octave: -1, enabled: false, type: 'sine', pan: 0 },
	noise: { enabled: false, type: 'white', level: -12, pan: 0 },
	voicing: { mode: 'poly', glide: 0.08 },
	effects: {
		distortion: { enabled: false, drive: 0.4, mix: 1 },
		bitcrusher: { enabled: false, bits: 8, drive: 1, tone: 20000, mix: 1 },
		chorus: { enabled: false, rate: 1.5, depth: 0.5, spread: 90, mix: 0.5 },
		delay: { enabled: false, time: 0.25, feedback: 0.4, pingPong: true, mix: 0.25 },
		reverb: { enabled: false, decay: 2.5, preDelay: 0.01, mix: 0.3 }
	}
};

/* ------------------------------------------------------------------------ */
/* Partial-update validation                                                 */
/* ------------------------------------------------------------------------ */

/**
 * Map of section names to their partial-shape schemas. Used by setters that
 * accept a Partial<SectionPatch> and need to validate just that subset.
 */
export const SectionPartials = {
	osc1: OscPatchSchema.partial(),
	osc2: OscPatchSchema.partial(),
	env: EnvelopeSchema.partial(),
	filter: FilterSchema.partial(),
	lfo1: LFOSchema.partial(),
	lfo2: LFOSchema.partial(),
	sub: SubOscSchema.partial(),
	noise: NoiseSchema.partial(),
	voicing: VoicingSchema.partial(),
	reverb: ReverbSchema.partial(),
	delay: DelaySchema.partial(),
	distortion: DistortionSchema.partial(),
	chorus: ChorusSchema.partial(),
	bitcrusher: BitcrusherSchema.partial()
} as const;

export type Section = keyof typeof SectionPartials;

/**
 * Validate a partial update for a given section. Returns the parsed value on
 * success, or throws ZodError on failure. Callers may catch and surface to UI.
 *
 * CRITICAL: Zod's `.default()` triggers on missing keys, so calling
 * `partial().parse({ spread: 50 })` would inject `unison: 1, width: 0.5,
 * type: <default>` into the result — silently clobbering sibling fields when
 * we then `Object.assign` over the patch. We solve this by tracking which
 * keys the caller actually provided and only returning those keys after
 * validation. Validation still runs against the full schema so out-of-range
 * values are properly rejected.
 */
export function validateSection<S extends Section>(
	section: S,
	value: unknown
): z.infer<(typeof SectionPartials)[S]> {
	const providedKeys = new Set<string>();
	if (value && typeof value === 'object') {
		for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
			if (v !== undefined) providedKeys.add(k);
		}
	}
	const parsed = SectionPartials[section].parse(value) as Record<string, unknown>;
	const filtered: Record<string, unknown> = {};
	for (const k of providedKeys) {
		if (k in parsed) filtered[k] = parsed[k];
	}
	return filtered as z.infer<(typeof SectionPartials)[S]>;
}

/**
 * Validate (and clone) a complete patch. Use for inbound JSON, presets,
 * network messages, etc.
 */
export function validatePatch(value: unknown): Patch {
	return PatchSchema.parse(value);
}

/**
 * Safe variant — returns a discriminated result instead of throwing. Handy
 * when the source is user-typed JSON and we want to render an error.
 */
export function safeValidatePatch(
	value: unknown
): { ok: true; patch: Patch } | { ok: false; error: z.ZodError } {
	const r = PatchSchema.safeParse(value);
	return r.success ? { ok: true, patch: r.data } : { ok: false, error: r.error };
}
