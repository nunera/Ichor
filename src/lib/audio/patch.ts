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

export const OscPatchSchema = z.object({
	type: Waveform,
	level: z.number().min(-60).max(12),
	octave: z.number().int().min(-3).max(3),
	semi: z.number().int().min(-12).max(12),
	fine: z.number().min(-50).max(50),
	enabled: z.boolean(),
	/** Unison voice count (1 = off). fat* oscillator when >1. */
	unison: z.number().int().min(1).max(8).default(1),
	/** Unison detune spread in cents (active when unison > 1). */
	spread: z.number().min(0).max(200).default(0),
	/** Pulse width 0–1 (only affects pulse waveform). */
	width: z.number().min(0).max(1).default(0.5)
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

export const LFOSchema = z.object({
	rate: z.number().min(0.01).max(40),
	depth: z.number().min(0).max(10000),
	enabled: z.boolean(),
	shape: z.enum(['sine', 'square', 'triangle', 'sawtooth']).default('sine')
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

export const PatchSchema = z.object({
	osc1: OscPatchSchema,
	osc2: OscPatchSchema,
	env: EnvelopeSchema,
	filter: FilterSchema,
	lfo: LFOSchema,
	sub: SubOscSchema.default({ level: -6, octave: -1, enabled: false, type: 'sine', pan: 0 }),
	noise: NoiseSchema.default({ enabled: false, type: 'white', level: -12, pan: 0 }),
	voicing: VoicingSchema.default({ mode: 'poly', glide: 0.08 })
});
export type Patch = z.infer<typeof PatchSchema>;

/** Input type — new fields with defaults are optional. Use for presets / inbound JSON. */
export type PatchInput = z.input<typeof PatchSchema>;

export const defaultPatch: Patch = {
	osc1: {
		type: 'sawtooth',
		level: 0,
		octave: 0,
		semi: 0,
		fine: 0,
		enabled: true,
		unison: 1,
		spread: 0,
		width: 0.5
	},
	osc2: {
		type: 'square',
		level: -6,
		octave: 0,
		semi: 0,
		fine: 7,
		enabled: true,
		unison: 1,
		spread: 0,
		width: 0.5
	},
	env: { attack: 0.01, hold: 0, decay: 0.15, sustain: 0.7, release: 0.4 },
	filter: { cutoff: 4000, resonance: 2, type: 'lowpass' },
	lfo: { rate: 4, depth: 1500, enabled: false, shape: 'sine' },
	sub: { level: -6, octave: -1, enabled: false, type: 'sine', pan: 0 },
	noise: { enabled: false, type: 'white', level: -12, pan: 0 },
	voicing: { mode: 'poly', glide: 0.08 }
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
	lfo: LFOSchema.partial(),
	sub: SubOscSchema.partial(),
	noise: NoiseSchema.partial(),
	voicing: VoicingSchema.partial()
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
