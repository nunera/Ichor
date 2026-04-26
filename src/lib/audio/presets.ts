import type { Patch } from './patch';

/**
 * Built-in starter presets, grouped by category. Categories drive node
 * colors in the floating preset picker, and same-category presets are
 * connected by springs in the physics simulation.
 */

export type Category = 'bass' | 'lead' | 'pluck' | 'pad' | 'perc' | 'keys';

export type PresetMeta = {
	category: Category;
	patch: Patch;
};

export const categoryColor: Record<Category, string> = {
	bass: 'var(--ctp-mauve)',
	lead: 'var(--ctp-pink)',
	pluck: 'var(--ctp-lavender)',
	pad: 'var(--ctp-blue)',
	perc: 'var(--ctp-sapphire)',
	keys: 'var(--ctp-sky)'
};

export const presets: Record<string, PresetMeta> = {
	init: {
		category: 'keys',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -6, octave: 0, semi: 0, fine: 7, enabled: true },
			env: { attack: 0.01, hold: 0, decay: 0.15, sustain: 0.7, release: 0.4 },
			filter: { cutoff: 4000, resonance: 2 },
			lfo: { rate: 4, depth: 1500, enabled: false }
		}
	},

	'fat bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: -1, semi: 0, fine: -8, enabled: true },
			env: { attack: 0.005, hold: 0, decay: 0.4, sustain: 0.6, release: 0.2 },
			filter: { cutoff: 800, resonance: 6 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	sub: {
		category: 'bass',
		patch: {
			osc1: { type: 'sine', level: 0, octave: -2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -12, octave: -1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.005, hold: 0, decay: 0.5, sustain: 0.9, release: 0.3 },
			filter: { cutoff: 600, resonance: 1 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	reese: {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: 12, enabled: true },
			osc2: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: -12, enabled: true },
			env: { attack: 0.01, hold: 0, decay: 0.4, sustain: 0.85, release: 0.4 },
			filter: { cutoff: 1200, resonance: 4 },
			lfo: { rate: 0.6, depth: 800, enabled: true }
		}
	},

	pluck: {
		category: 'pluck',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -10, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.002, hold: 0, decay: 0.25, sustain: 0, release: 0.3 },
			filter: { cutoff: 5000, resonance: 1 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	glass: {
		category: 'pluck',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -3, octave: 2, semi: 7, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.18, sustain: 0, release: 0.4 },
			filter: { cutoff: 8000, resonance: 0.5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	wobble: {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -4, octave: 0, semi: 0, fine: 12, enabled: true },
			env: { attack: 0.01, hold: 0, decay: 0.3, sustain: 0.8, release: 0.5 },
			filter: { cutoff: 1800, resonance: 8 },
			lfo: { rate: 5.5, depth: 2400, enabled: true }
		}
	},

	screamer: {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -10, enabled: true },
			osc2: { type: 'sawtooth', level: -2, octave: 0, semi: 0, fine: 10, enabled: true },
			env: { attack: 0.005, hold: 0, decay: 0.2, sustain: 0.9, release: 0.3 },
			filter: { cutoff: 3500, resonance: 12 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'soft pad': {
		category: 'pad',
		patch: {
			osc1: { type: 'triangle', level: -3, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -3, octave: 1, semi: 7, fine: -5, enabled: true },
			env: { attack: 0.6, hold: 0, decay: 0.4, sustain: 0.85, release: 1.5 },
			filter: { cutoff: 2400, resonance: 1.5 },
			lfo: { rate: 0.4, depth: 600, enabled: true }
		}
	},

	swell: {
		category: 'pad',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -4, octave: 0, semi: 7, fine: 0, enabled: true },
			env: { attack: 1.4, hold: 0, decay: 0.3, sustain: 1, release: 2.0 },
			filter: { cutoff: 3000, resonance: 0.8 },
			lfo: { rate: 0.25, depth: 1200, enabled: true }
		}
	},

	blip: {
		category: 'perc',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -8, octave: 0, semi: 0, fine: 0, enabled: false },
			env: { attack: 0.001, hold: 0.05, decay: 0.08, sustain: 0, release: 0.05 },
			filter: { cutoff: 6000, resonance: 4 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	/* ----------------------------- BASS ----------------------------- */

	'acid bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -10, octave: -1, semi: 0, fine: 0, enabled: false },
			env: { attack: 0.002, hold: 0, decay: 0.18, sustain: 0.1, release: 0.15 },
			filter: { cutoff: 700, resonance: 14 },
			lfo: { rate: 0.5, depth: 1800, enabled: true }
		}
	},

	'808': {
		category: 'bass',
		patch: {
			osc1: { type: 'sine', level: 0, octave: -2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -18, octave: -1, semi: 0, fine: 0, enabled: false },
			env: { attack: 0.002, hold: 0, decay: 1.6, sustain: 0, release: 0.4 },
			filter: { cutoff: 250, resonance: 1 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'pluck bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -8, octave: -1, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.003, hold: 0, decay: 0.22, sustain: 0.05, release: 0.2 },
			filter: { cutoff: 1500, resonance: 5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	growl: {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: 8, enabled: true },
			osc2: { type: 'square', level: -3, octave: -1, semi: 7, fine: -8, enabled: true },
			env: { attack: 0.005, hold: 0, decay: 0.5, sustain: 0.7, release: 0.3 },
			filter: { cutoff: 900, resonance: 9 },
			lfo: { rate: 7, depth: 1200, enabled: true }
		}
	},

	/* ----------------------------- LEAD ----------------------------- */

	supersaw: {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -16, enabled: true },
			osc2: { type: 'sawtooth', level: -1, octave: 0, semi: 0, fine: 16, enabled: true },
			env: { attack: 0.01, hold: 0, decay: 0.4, sustain: 0.9, release: 0.6 },
			filter: { cutoff: 6000, resonance: 1 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'square lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -10, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.005, hold: 0, decay: 0.2, sustain: 0.85, release: 0.25 },
			filter: { cutoff: 4500, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	chiptune: {
		category: 'lead',
		patch: {
			osc1: { type: 'square', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -8, octave: 2, semi: 7, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0.02, decay: 0.05, sustain: 0.8, release: 0.05 },
			filter: { cutoff: 9000, resonance: 0.5 },
			lfo: { rate: 6, depth: 800, enabled: true }
		}
	},

	siren: {
		category: 'lead',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -3, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.05, hold: 0, decay: 0.2, sustain: 1, release: 0.4 },
			filter: { cutoff: 5000, resonance: 6 },
			lfo: { rate: 0.8, depth: 4000, enabled: true }
		}
	},

	/* ---------------------------- PLUCK ----------------------------- */

	harp: {
		category: 'pluck',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -6, octave: 2, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.002, hold: 0, decay: 0.5, sustain: 0, release: 0.6 },
			filter: { cutoff: 7000, resonance: 0.8 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	mallet: {
		category: 'pluck',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -8, octave: 1, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.35, sustain: 0, release: 0.25 },
			filter: { cutoff: 3500, resonance: 1.5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	koto: {
		category: 'pluck',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -14, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.4, sustain: 0, release: 0.5 },
			filter: { cutoff: 2200, resonance: 4 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	/* ----------------------------- PAD ------------------------------ */

	choir: {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: -7, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: 0, semi: 7, fine: 7, enabled: true },
			env: { attack: 0.8, hold: 0, decay: 0.5, sustain: 0.9, release: 1.2 },
			filter: { cutoff: 1800, resonance: 2 },
			lfo: { rate: 0.5, depth: 400, enabled: true }
		}
	},

	'warm pad': {
		category: 'pad',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: -3, enabled: true },
			osc2: { type: 'triangle', level: -2, octave: 0, semi: 0, fine: 3, enabled: true },
			env: { attack: 1.0, hold: 0, decay: 0.6, sustain: 0.8, release: 1.8 },
			filter: { cutoff: 1600, resonance: 1 },
			lfo: { rate: 0.3, depth: 200, enabled: true }
		}
	},

	'glass pad': {
		category: 'pad',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -4, octave: 2, semi: 7, fine: 0, enabled: true },
			env: { attack: 0.5, hold: 0, decay: 0.4, sustain: 0.85, release: 1.4 },
			filter: { cutoff: 6500, resonance: 0.8 },
			lfo: { rate: 0.6, depth: 300, enabled: true }
		}
	},

	dystopia: {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: -1, semi: 0, fine: 12, enabled: true },
			osc2: { type: 'square', level: -5, octave: 0, semi: 1, fine: -12, enabled: true },
			env: { attack: 1.5, hold: 0, decay: 0.5, sustain: 0.7, release: 2.5 },
			filter: { cutoff: 1200, resonance: 5 },
			lfo: { rate: 0.15, depth: 1500, enabled: true }
		}
	},

	/* ----------------------------- PERC ----------------------------- */

	zap: {
		category: 'perc',
		patch: {
			osc1: { type: 'square', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: 2, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.1, sustain: 0, release: 0.05 },
			filter: { cutoff: 8000, resonance: 6 },
			lfo: { rate: 12, depth: 3000, enabled: true }
		}
	},

	tick: {
		category: 'perc',
		patch: {
			osc1: { type: 'square', level: 0, octave: 2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -10, octave: 2, semi: 0, fine: 0, enabled: false },
			env: { attack: 0.0005, hold: 0.005, decay: 0.02, sustain: 0, release: 0.02 },
			filter: { cutoff: 9000, resonance: 1 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	thud: {
		category: 'perc',
		patch: {
			osc1: { type: 'sine', level: 0, octave: -2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -14, octave: -1, semi: 0, fine: 0, enabled: false },
			env: { attack: 0.001, hold: 0, decay: 0.18, sustain: 0, release: 0.05 },
			filter: { cutoff: 400, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	clave: {
		category: 'perc',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -8, octave: 2, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.06, sustain: 0, release: 0.04 },
			filter: { cutoff: 5000, resonance: 3 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	/* ----------------------------- KEYS ----------------------------- */

	'rhodes-ish': {
		category: 'keys',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -6, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.005, hold: 0, decay: 0.6, sustain: 0.4, release: 0.5 },
			filter: { cutoff: 2200, resonance: 1 },
			lfo: { rate: 5, depth: 200, enabled: true }
		}
	},

	'organ-ish': {
		category: 'keys',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -3, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.005, hold: 0, decay: 0.05, sustain: 1, release: 0.05 },
			filter: { cutoff: 5000, resonance: 0.5 },
			lfo: { rate: 6, depth: 250, enabled: true }
		}
	},

	'piano-ish': {
		category: 'keys',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -8, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.002, hold: 0, decay: 0.7, sustain: 0.25, release: 0.5 },
			filter: { cutoff: 4000, resonance: 0.7 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'wurli-ish': {
		category: 'keys',
		patch: {
			osc1: { type: 'square', level: -3, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -3, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.003, hold: 0, decay: 0.5, sustain: 0.35, release: 0.4 },
			filter: { cutoff: 2800, resonance: 1.5 },
			lfo: { rate: 4.5, depth: 250, enabled: true }
		}
	}
};

export const presetNames = Object.keys(presets);
