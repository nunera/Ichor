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

export const Waveform = z.enum(['sine', 'square', 'sawtooth', 'triangle']);
export type Waveform = z.infer<typeof Waveform>;

export const OscPatchSchema = z.object({
	type: Waveform,
	level: z.number().min(-60).max(12),
	octave: z.number().int().min(-3).max(3),
	semi: z.number().int().min(-12).max(12),
	fine: z.number().min(-50).max(50),
	enabled: z.boolean()
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
	resonance: z.number().min(0.1).max(20)
});
export type Filter = z.infer<typeof FilterSchema>;

export const LFOSchema = z.object({
	rate: z.number().min(0.01).max(40),
	depth: z.number().min(0).max(10000),
	enabled: z.boolean()
});
export type LFO = z.infer<typeof LFOSchema>;

export const PatchSchema = z.object({
	osc1: OscPatchSchema,
	osc2: OscPatchSchema,
	env: EnvelopeSchema,
	filter: FilterSchema,
	lfo: LFOSchema
});
export type Patch = z.infer<typeof PatchSchema>;

export const defaultPatch: Patch = {
	osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
	osc2: { type: 'square', level: -6, octave: 0, semi: 0, fine: 7, enabled: true },
	env: { attack: 0.01, hold: 0, decay: 0.15, sustain: 0.7, release: 0.4 },
	filter: { cutoff: 4000, resonance: 2 },
	lfo: { rate: 4, depth: 1500, enabled: false }
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
	lfo: LFOSchema.partial()
} as const;

export type Section = keyof typeof SectionPartials;

/**
 * Validate a partial update for a given section. Returns the parsed value on
 * success, or throws ZodError on failure. Callers may catch and surface to UI.
 */
export function validateSection<S extends Section>(
	section: S,
	value: unknown
): z.infer<(typeof SectionPartials)[S]> {
	return SectionPartials[section].parse(value) as z.infer<(typeof SectionPartials)[S]>;
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
