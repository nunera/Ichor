import type { PatchInput } from './patch';

/**
 * Built-in starter presets, grouped by category. Categories drive node
 * colors in the floating preset picker, and same-category presets are
 * connected by springs in the physics simulation.
 */

export type Category =
	| 'bass'
	| 'lead'
	| 'pad'
	| 'atmo'
	| 'pluck'
	| 'world'
	| 'bells'
	| 'vox'
	| 'keys'
	| 'perc'
	| 'organ'
	| 'fx';

export type PresetMeta = {
	category: Category;
	patch: PatchInput;
};

export const categoryColor: Record<Category, string> = {
	bass: '#4c1d95', // very dark violet
	organ: '#7c3aed', // medium purple
	vox: '#a855f7', // bright purple
	world: '#818cf8', // periwinkle
	keys: '#1e3a8a', // deep navy
	lead: '#2563eb', // strong blue
	pluck: '#3b82f6', // medium blue
	bells: '#60a5fa', // light blue
	fx: '#0e7490', // dark teal
	atmo: '#06b6d4', // cyan
	pad: '#22d3ee', // light cyan
	perc: '#2dd4bf' // turquoise
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
		category: 'bells',
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
		category: 'world',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -6, octave: 2, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.002, hold: 0, decay: 0.5, sustain: 0, release: 0.6 },
			filter: { cutoff: 7000, resonance: 0.8 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	mallet: {
		category: 'bells',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -8, octave: 1, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.35, sustain: 0, release: 0.25 },
			filter: { cutoff: 3500, resonance: 1.5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	koto: {
		category: 'world',
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
		category: 'vox',
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
		category: 'atmo',
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
		category: 'fx',
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
		category: 'organ',
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
	},

	/* ===================== BASS (expanded) ===================== */

	'midnight sub': {
		category: 'bass',
		patch: {
			osc1: { type: 'sine', level: 0, octave: -2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -8, octave: -1, semi: 7, fine: 0, enabled: true },
			env: { attack: 0.008, hold: 0, decay: 1.8, sustain: 0.5, release: 0.6 },
			filter: { cutoff: 180, resonance: 1.5 },
			lfo: { rate: 0.2, depth: 80, enabled: true }
		}
	},

	'dubstep snarl': {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: 18, enabled: true },
			osc2: { type: 'square', level: -2, octave: -1, semi: 0, fine: -18, enabled: true },
			env: { attack: 0.003, hold: 0, decay: 0.3, sustain: 0.7, release: 0.3 },
			filter: { cutoff: 600, resonance: 16 },
			lfo: { rate: 0.25, depth: 3500, enabled: true }
		}
	},

	'liquid bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -6, octave: -1, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.01, hold: 0, decay: 0.6, sustain: 0.75, release: 0.4 },
			filter: { cutoff: 1000, resonance: 5 },
			lfo: { rate: 0.35, depth: 1500, enabled: true }
		}
	},

	'moog-ish': {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: -4, enabled: true },
			osc2: { type: 'sawtooth', level: -2, octave: -1, semi: 0, fine: 4, enabled: true },
			env: { attack: 0.008, hold: 0, decay: 0.35, sustain: 0.65, release: 0.25 },
			filter: { cutoff: 1400, resonance: 7 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'hollow bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'square', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -10, octave: -2, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.005, hold: 0, decay: 0.25, sustain: 0.5, release: 0.2 },
			filter: { cutoff: 900, resonance: 3 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	throb: {
		category: 'bass',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -5, octave: -1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.02, hold: 0, decay: 0.5, sustain: 0.8, release: 0.4 },
			filter: { cutoff: 750, resonance: 4 },
			lfo: { rate: 1.2, depth: 800, enabled: true }
		}
	},

	phobos: {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -2, semi: 0, fine: 24, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: -2, semi: 0, fine: -24, enabled: true },
			env: { attack: 0.01, hold: 0, decay: 0.4, sustain: 0.8, release: 0.5 },
			filter: { cutoff: 500, resonance: 8 },
			lfo: { rate: 0.15, depth: 1200, enabled: true }
		}
	},

	piston: {
		category: 'bass',
		patch: {
			osc1: { type: 'square', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -14, octave: -2, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.002, hold: 0, decay: 0.2, sustain: 0.4, release: 0.15 },
			filter: { cutoff: 1100, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	mud: {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -2, semi: 0, fine: 10, enabled: true },
			osc2: { type: 'sawtooth', level: -1, octave: -2, semi: 0, fine: -10, enabled: true },
			env: { attack: 0.015, hold: 0, decay: 0.7, sustain: 0.85, release: 0.5 },
			filter: { cutoff: 400, resonance: 3 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'acid trip': {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -12, octave: -1, semi: 0, fine: 0, enabled: false },
			env: { attack: 0.001, hold: 0, decay: 0.12, sustain: 0.05, release: 0.1 },
			filter: { cutoff: 500, resonance: 18 },
			lfo: { rate: 3.5, depth: 2200, enabled: true }
		}
	},

	'deep tech': {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: -6, enabled: true },
			osc2: { type: 'triangle', level: -4, octave: -1, semi: 0, fine: 6, enabled: true },
			env: { attack: 0.008, hold: 0, decay: 0.3, sustain: 0.7, release: 0.25 },
			filter: { cutoff: 1600, resonance: 3.5 },
			lfo: { rate: 0.5, depth: 600, enabled: true }
		}
	},

	carbon: {
		category: 'bass',
		patch: {
			osc1: { type: 'sine', level: 0, octave: -3, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -18, octave: -2, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.005, hold: 0, decay: 1.2, sustain: 0.6, release: 0.8 },
			filter: { cutoff: 150, resonance: 1 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	rubber: {
		category: 'bass',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -6, octave: -2, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.8, sustain: 0.1, release: 0.4 },
			filter: { cutoff: 600, resonance: 10 },
			lfo: { rate: 1.5, depth: 400, enabled: true }
		}
	},

	voltage: {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: 6, enabled: true },
			env: { attack: 0.002, hold: 0, decay: 0.4, sustain: 0.8, release: 0.3 },
			filter: { cutoff: 2000, resonance: 10 },
			lfo: { rate: 2.5, depth: 2800, enabled: true }
		}
	},

	crater: {
		category: 'bass',
		patch: {
			osc1: { type: 'square', level: 0, octave: -2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -5, octave: -1, semi: 7, fine: 0, enabled: true },
			env: { attack: 0.01, hold: 0, decay: 0.45, sustain: 0.5, release: 0.35 },
			filter: { cutoff: 700, resonance: 7 },
			lfo: { rate: 0.8, depth: 900, enabled: true }
		}
	},

	/* ===================== LEAD (expanded) ===================== */

	razor: {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -22, enabled: true },
			osc2: { type: 'sawtooth', level: -1, octave: 0, semi: 0, fine: 22, enabled: true },
			env: { attack: 0.008, hold: 0, decay: 0.3, sustain: 0.9, release: 0.4 },
			filter: { cutoff: 7000, resonance: 1.5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	whistle: {
		category: 'lead',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -14, octave: 3, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.03, hold: 0, decay: 0.1, sustain: 0.9, release: 0.25 },
			filter: { cutoff: 10000, resonance: 0.3 },
			lfo: { rate: 5, depth: 180, enabled: true }
		}
	},

	digital: {
		category: 'lead',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -5, octave: 0, semi: 1, fine: 0, enabled: true },
			env: { attack: 0.002, hold: 0, decay: 0.15, sustain: 0.85, release: 0.2 },
			filter: { cutoff: 5500, resonance: 10 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'flute-ish': {
		category: 'lead',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -8, octave: 1, semi: 0, fine: 3, enabled: true },
			env: { attack: 0.04, hold: 0, decay: 0.2, sustain: 0.75, release: 0.3 },
			filter: { cutoff: 4000, resonance: 1 },
			lfo: { rate: 5.5, depth: 300, enabled: true }
		}
	},

	'arp blade': {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -6, octave: 1, semi: 0, fine: 8, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.12, sustain: 0, release: 0.15 },
			filter: { cutoff: 5500, resonance: 8 },
			lfo: { rate: 8, depth: 1200, enabled: true }
		}
	},

	portamento: {
		category: 'lead',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -6, octave: 0, semi: 0, fine: -3, enabled: true },
			env: { attack: 0.08, hold: 0, decay: 0.3, sustain: 0.8, release: 0.5 },
			filter: { cutoff: 3500, resonance: 3 },
			lfo: { rate: 4.5, depth: 150, enabled: true }
		}
	},

	glitch: {
		category: 'lead',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: 15, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: -15, enabled: true },
			env: { attack: 0.001, hold: 0.01, decay: 0.08, sustain: 0.5, release: 0.1 },
			filter: { cutoff: 4000, resonance: 14 },
			lfo: { rate: 14, depth: 2500, enabled: true }
		}
	},

	frozen: {
		category: 'lead',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 2, semi: 0, fine: -8, enabled: true },
			osc2: { type: 'sine', level: -4, octave: 2, semi: 0, fine: 8, enabled: true },
			env: { attack: 0.3, hold: 0, decay: 0.4, sustain: 0.7, release: 0.8 },
			filter: { cutoff: 8000, resonance: 3 },
			lfo: { rate: 3, depth: 400, enabled: true }
		}
	},

	'hollow wind': {
		category: 'lead',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -12, octave: 1, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.06, hold: 0, decay: 0.3, sustain: 0.65, release: 0.4 },
			filter: { cutoff: 3200, resonance: 4 },
			lfo: { rate: 0.9, depth: 700, enabled: true }
		}
	},

	solar: {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.005, hold: 0, decay: 0.3, sustain: 0.9, release: 0.35 },
			filter: { cutoff: 8500, resonance: 1 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	hex: {
		category: 'lead',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -5, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.003, hold: 0, decay: 0.25, sustain: 0.7, release: 0.25 },
			filter: { cutoff: 3800, resonance: 9 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	neon: {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -14, enabled: true },
			osc2: { type: 'sawtooth', level: -2, octave: 0, semi: 0, fine: 14, enabled: true },
			env: { attack: 0.006, hold: 0, decay: 0.2, sustain: 1, release: 0.4 },
			filter: { cutoff: 6500, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	vapor: {
		category: 'lead',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: -5, enabled: true },
			osc2: { type: 'sine', level: -3, octave: 1, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.04, hold: 0, decay: 0.3, sustain: 0.75, release: 0.6 },
			filter: { cutoff: 4200, resonance: 2 },
			lfo: { rate: 1.5, depth: 600, enabled: true }
		}
	},

	velvet: {
		category: 'lead',
		patch: {
			osc1: { type: 'square', level: -3, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -4, octave: 0, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.02, hold: 0, decay: 0.4, sustain: 0.8, release: 0.5 },
			filter: { cutoff: 2000, resonance: 3 },
			lfo: { rate: 5, depth: 200, enabled: true }
		}
	},

	flux: {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -4, octave: 0, semi: 7, fine: -8, enabled: true },
			env: { attack: 0.015, hold: 0, decay: 0.35, sustain: 0.85, release: 0.45 },
			filter: { cutoff: 3000, resonance: 6 },
			lfo: { rate: 0.4, depth: 2000, enabled: true }
		}
	},

	spike: {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -8, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.1, sustain: 0.7, release: 0.15 },
			filter: { cutoff: 9000, resonance: 5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	silk: {
		category: 'lead',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -5, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.05, hold: 0, decay: 0.4, sustain: 0.8, release: 0.7 },
			filter: { cutoff: 5000, resonance: 1 },
			lfo: { rate: 5, depth: 250, enabled: true }
		}
	},

	phantom: {
		category: 'lead',
		patch: {
			osc1: { type: 'square', level: -2, octave: 0, semi: 0, fine: 20, enabled: true },
			osc2: { type: 'sawtooth', level: -2, octave: 0, semi: 0, fine: -20, enabled: true },
			env: { attack: 0.03, hold: 0, decay: 0.25, sustain: 0.8, release: 0.4 },
			filter: { cutoff: 4500, resonance: 7 },
			lfo: { rate: 3, depth: 600, enabled: true }
		}
	},

	stab: {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -2, octave: 0, semi: 0, fine: -6, enabled: true },
			env: { attack: 0.001, hold: 0.02, decay: 0.35, sustain: 0, release: 0.2 },
			filter: { cutoff: 5000, resonance: 6 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	/* ===================== PLUCK (expanded) ===================== */

	dulcimer: {
		category: 'world',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -6, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.45, sustain: 0, release: 0.35 },
			filter: { cutoff: 4500, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	sitar: {
		category: 'world',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -10, octave: 1, semi: 0, fine: 3, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.55, sustain: 0, release: 0.45 },
			filter: { cutoff: 3000, resonance: 8 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	lute: {
		category: 'world',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -8, octave: 0, semi: 12, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.6, sustain: 0, release: 0.4 },
			filter: { cutoff: 3200, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	zither: {
		category: 'world',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -5, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.3, sustain: 0, release: 0.25 },
			filter: { cutoff: 6000, resonance: 1 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	balalaika: {
		category: 'world',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: 5, enabled: true },
			osc2: { type: 'square', level: -10, octave: 0, semi: 0, fine: -5, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.2, sustain: 0, release: 0.2 },
			filter: { cutoff: 4000, resonance: 3 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	marimba: {
		category: 'bells',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -12, octave: 2, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.28, sustain: 0, release: 0.18 },
			filter: { cutoff: 5000, resonance: 0.5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	vibraphone: {
		category: 'bells',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -6, octave: 2, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.003, hold: 0, decay: 0.8, sustain: 0.15, release: 0.6 },
			filter: { cutoff: 8000, resonance: 0.5 },
			lfo: { rate: 4.8, depth: 200, enabled: true }
		}
	},

	xylo: {
		category: 'pluck',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -14, octave: 3, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.12, sustain: 0, release: 0.08 },
			filter: { cutoff: 6000, resonance: 1 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'thumb piano': {
		category: 'pluck',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -12, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.4, sustain: 0, release: 0.3 },
			filter: { cutoff: 3000, resonance: 1 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	ice: {
		category: 'pluck',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -6, octave: 3, semi: 7, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.15, sustain: 0, release: 0.2 },
			filter: { cutoff: 10000, resonance: 0.3 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'crystal bell': {
		category: 'pluck',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -3, octave: 2, semi: 5, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 1.0, sustain: 0.05, release: 0.8 },
			filter: { cutoff: 9000, resonance: 0.5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	drop: {
		category: 'pluck',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -8, octave: 2, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.25, sustain: 0, release: 0.3 },
			filter: { cutoff: 4500, resonance: 6 },
			lfo: { rate: 2, depth: 1500, enabled: true }
		}
	},

	twang: {
		category: 'pluck',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -6, octave: 0, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.18, sustain: 0, release: 0.15 },
			filter: { cutoff: 3500, resonance: 5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	coral: {
		category: 'pluck',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -5, octave: 1, semi: 7, fine: 3, enabled: true },
			env: { attack: 0.004, hold: 0, decay: 0.5, sustain: 0.05, release: 0.4 },
			filter: { cutoff: 2000, resonance: 7 },
			lfo: { rate: 0.5, depth: 400, enabled: true }
		}
	},

	wire: {
		category: 'pluck',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -14, octave: 1, semi: 0, fine: 8, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.22, sustain: 0, release: 0.2 },
			filter: { cutoff: 5500, resonance: 4 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	bamboo: {
		category: 'pluck',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -10, octave: 2, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.16, sustain: 0, release: 0.12 },
			filter: { cutoff: 5000, resonance: 5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	ember: {
		category: 'pluck',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: -3, enabled: true },
			osc2: { type: 'sine', level: -5, octave: 0, semi: 0, fine: 3, enabled: true },
			env: { attack: 0.003, hold: 0, decay: 0.7, sustain: 0.05, release: 0.5 },
			filter: { cutoff: 2500, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	gamelan: {
		category: 'pluck',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -5, octave: 1, semi: 2, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 1.2, sustain: 0.05, release: 1.0 },
			filter: { cutoff: 6000, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'cello pizz': {
		category: 'pluck',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -8, octave: -1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.4, sustain: 0, release: 0.3 },
			filter: { cutoff: 2500, resonance: 1.5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'struck metal': {
		category: 'pluck',
		patch: {
			osc1: { type: 'square', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -5, octave: 1, semi: 3, fine: 25, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.9, sustain: 0.02, release: 0.7 },
			filter: { cutoff: 7000, resonance: 3 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	/* ===================== PAD (expanded) ===================== */

	nebula: {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -4, octave: 0, semi: 0, fine: -8, enabled: true },
			osc2: { type: 'sawtooth', level: -4, octave: 0, semi: 7, fine: 8, enabled: true },
			env: { attack: 1.8, hold: 0, decay: 0.6, sustain: 0.9, release: 2.5 },
			filter: { cutoff: 2200, resonance: 2 },
			lfo: { rate: 0.08, depth: 1800, enabled: true }
		}
	},

	aurora: {
		category: 'pad',
		patch: {
			osc1: { type: 'triangle', level: -2, octave: 1, semi: 0, fine: -5, enabled: true },
			osc2: { type: 'triangle', level: -2, octave: 1, semi: 0, fine: 5, enabled: true },
			env: { attack: 1.2, hold: 0, decay: 0.4, sustain: 0.9, release: 2.0 },
			filter: { cutoff: 4000, resonance: 1 },
			lfo: { rate: 0.12, depth: 1200, enabled: true }
		}
	},

	astral: {
		category: 'pad',
		patch: {
			osc1: { type: 'sine', level: -2, octave: 1, semi: 0, fine: -10, enabled: true },
			osc2: { type: 'sine', level: -2, octave: 1, semi: 0, fine: 10, enabled: true },
			env: { attack: 1.5, hold: 0, decay: 0.5, sustain: 0.85, release: 2.2 },
			filter: { cutoff: 6000, resonance: 0.8 },
			lfo: { rate: 0.18, depth: 800, enabled: true }
		}
	},

	void: {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: -1, semi: 0, fine: 6, enabled: true },
			osc2: { type: 'square', level: -6, octave: -1, semi: 0, fine: -6, enabled: true },
			env: { attack: 1.6, hold: 0, decay: 0.4, sustain: 0.75, release: 2.8 },
			filter: { cutoff: 600, resonance: 4 },
			lfo: { rate: 0.1, depth: 400, enabled: true }
		}
	},

	ether: {
		category: 'pad',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 0, semi: 0, fine: -3, enabled: true },
			osc2: { type: 'sine', level: -2, octave: 0, semi: 0, fine: 3, enabled: true },
			env: { attack: 1.0, hold: 0, decay: 0.3, sustain: 0.95, release: 2.0 },
			filter: { cutoff: 3500, resonance: 0.5 },
			lfo: { rate: 0.2, depth: 300, enabled: true }
		}
	},

	oracle: {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -3, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.9, hold: 0, decay: 0.5, sustain: 0.8, release: 1.8 },
			filter: { cutoff: 1800, resonance: 6 },
			lfo: { rate: 0.22, depth: 900, enabled: true }
		}
	},

	shimmer: {
		category: 'pad',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 2, semi: 0, fine: -4, enabled: true },
			osc2: { type: 'sine', level: -2, octave: 2, semi: 0, fine: 4, enabled: true },
			env: { attack: 0.7, hold: 0, decay: 0.4, sustain: 0.9, release: 1.6 },
			filter: { cutoff: 7000, resonance: 1.5 },
			lfo: { rate: 0.3, depth: 500, enabled: true }
		}
	},

	dusk: {
		category: 'pad',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -5, octave: -1, semi: 7, fine: 0, enabled: true },
			env: { attack: 1.4, hold: 0, decay: 0.6, sustain: 0.7, release: 2.2 },
			filter: { cutoff: 1400, resonance: 3 },
			lfo: { rate: 0.14, depth: 700, enabled: true }
		}
	},

	cathedral: {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -2, octave: 0, semi: 0, fine: -12, enabled: true },
			osc2: { type: 'sawtooth', level: -2, octave: 0, semi: 12, fine: 12, enabled: true },
			env: { attack: 1.2, hold: 0, decay: 0.5, sustain: 0.9, release: 2.5 },
			filter: { cutoff: 2000, resonance: 1.5 },
			lfo: { rate: 0.16, depth: 500, enabled: true }
		}
	},

	cosmos: {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: -20, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: 20, enabled: true },
			env: { attack: 1.6, hold: 0, decay: 0.5, sustain: 0.85, release: 2.8 },
			filter: { cutoff: 2800, resonance: 2 },
			lfo: { rate: 0.06, depth: 1500, enabled: true }
		}
	},

	morpheus: {
		category: 'pad',
		patch: {
			osc1: { type: 'square', level: -4, octave: 0, semi: 0, fine: -7, enabled: true },
			osc2: { type: 'sawtooth', level: -4, octave: 0, semi: 0, fine: 7, enabled: true },
			env: { attack: 1.0, hold: 0, decay: 0.6, sustain: 0.8, release: 2.0 },
			filter: { cutoff: 1600, resonance: 7 },
			lfo: { rate: 0.05, depth: 2500, enabled: true }
		}
	},

	spectre: {
		category: 'pad',
		patch: {
			osc1: { type: 'square', level: -5, octave: 0, semi: 0, fine: 10, enabled: true },
			osc2: { type: 'triangle', level: -4, octave: 0, semi: 0, fine: -10, enabled: true },
			env: { attack: 1.3, hold: 0, decay: 0.4, sustain: 0.7, release: 2.0 },
			filter: { cutoff: 1200, resonance: 5 },
			lfo: { rate: 0.18, depth: 800, enabled: true }
		}
	},

	lament: {
		category: 'pad',
		patch: {
			osc1: { type: 'triangle', level: -2, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -4, octave: 0, semi: -2, fine: -5, enabled: true },
			env: { attack: 1.0, hold: 0, decay: 0.5, sustain: 0.8, release: 2.0 },
			filter: { cutoff: 1800, resonance: 3 },
			lfo: { rate: 0.2, depth: 600, enabled: true }
		}
	},

	arctic: {
		category: 'pad',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 2, semi: 0, fine: -6, enabled: true },
			osc2: { type: 'sine', level: -4, octave: 2, semi: 0, fine: 6, enabled: true },
			env: { attack: 0.8, hold: 0, decay: 0.3, sustain: 0.85, release: 1.5 },
			filter: { cutoff: 5500, resonance: 2 },
			lfo: { rate: 0.25, depth: 400, enabled: true }
		}
	},

	thermal: {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -3, octave: 0, semi: 0, fine: -5, enabled: true },
			env: { attack: 1.4, hold: 0, decay: 0.7, sustain: 0.8, release: 2.2 },
			filter: { cutoff: 1000, resonance: 2 },
			lfo: { rate: 0.1, depth: 600, enabled: true }
		}
	},

	tide: {
		category: 'pad',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 0, semi: 0, fine: -4, enabled: true },
			osc2: { type: 'triangle', level: -3, octave: 0, semi: 0, fine: 4, enabled: true },
			env: { attack: 1.8, hold: 0, decay: 0.5, sustain: 0.75, release: 2.5 },
			filter: { cutoff: 2500, resonance: 1.5 },
			lfo: { rate: 0.07, depth: 2000, enabled: true }
		}
	},

	drone: {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -6, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -6, octave: 0, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.5, hold: 0, decay: 0.5, sustain: 1, release: 3.0 },
			filter: { cutoff: 800, resonance: 1 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	stardust: {
		category: 'pad',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -6, octave: 3, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.6, hold: 0, decay: 0.4, sustain: 0.7, release: 1.4 },
			filter: { cutoff: 8000, resonance: 3 },
			lfo: { rate: 0.5, depth: 600, enabled: true }
		}
	},

	memory: {
		category: 'pad',
		patch: {
			osc1: { type: 'triangle', level: -2, octave: 0, semi: 0, fine: -3, enabled: true },
			osc2: { type: 'triangle', level: -2, octave: 0, semi: 7, fine: 3, enabled: true },
			env: { attack: 0.8, hold: 0, decay: 0.5, sustain: 0.85, release: 1.8 },
			filter: { cutoff: 2200, resonance: 2 },
			lfo: { rate: 0.3, depth: 350, enabled: true }
		}
	},

	'pulse pad': {
		category: 'pad',
		patch: {
			osc1: { type: 'square', level: -3, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -5, octave: 0, semi: 0, fine: -8, enabled: true },
			env: { attack: 0.4, hold: 0, decay: 0.4, sustain: 0.9, release: 1.5 },
			filter: { cutoff: 2000, resonance: 4 },
			lfo: { rate: 2.5, depth: 1500, enabled: true }
		}
	},

	abyss: {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: 15, enabled: true },
			osc2: { type: 'sawtooth', level: -2, octave: -1, semi: 0, fine: -15, enabled: true },
			env: { attack: 1.8, hold: 0, decay: 0.5, sustain: 0.7, release: 3.5 },
			filter: { cutoff: 450, resonance: 6 },
			lfo: { rate: 0.05, depth: 300, enabled: true }
		}
	},

	reverie: {
		category: 'pad',
		patch: {
			osc1: { type: 'sine', level: -2, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -3, octave: 1, semi: 7, fine: -4, enabled: true },
			env: { attack: 0.9, hold: 0, decay: 0.5, sustain: 0.8, release: 1.8 },
			filter: { cutoff: 3000, resonance: 1.5 },
			lfo: { rate: 0.18, depth: 400, enabled: true }
		}
	},

	solstice: {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: -10, enabled: true },
			osc2: { type: 'sine', level: -3, octave: 1, semi: 0, fine: 10, enabled: true },
			env: { attack: 1.5, hold: 0, decay: 0.6, sustain: 0.85, release: 2.5 },
			filter: { cutoff: 2600, resonance: 3 },
			lfo: { rate: 0.12, depth: 1100, enabled: true }
		}
	},

	tenebris: {
		category: 'pad',
		patch: {
			osc1: { type: 'square', level: -4, octave: -1, semi: 0, fine: 5, enabled: true },
			osc2: { type: 'sawtooth', level: -5, octave: -1, semi: 0, fine: -5, enabled: true },
			env: { attack: 1.7, hold: 0, decay: 0.5, sustain: 0.6, release: 3.0 },
			filter: { cutoff: 500, resonance: 8 },
			lfo: { rate: 0.07, depth: 300, enabled: true }
		}
	},

	vortex: {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -2, octave: 0, semi: 0, fine: 30, enabled: true },
			osc2: { type: 'square', level: -4, octave: 0, semi: 0, fine: -30, enabled: true },
			env: { attack: 1.2, hold: 0, decay: 0.6, sustain: 0.8, release: 2.2 },
			filter: { cutoff: 1500, resonance: 10 },
			lfo: { rate: 0.3, depth: 1800, enabled: true }
		}
	},

	/* ===================== PERC (expanded) ===================== */

	'kick analog': {
		category: 'perc',
		patch: {
			osc1: { type: 'sine', level: 0, octave: -2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -18, octave: -1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0.01, decay: 0.22, sustain: 0, release: 0.08 },
			filter: { cutoff: 300, resonance: 1 },
			lfo: { rate: 14, depth: 2000, enabled: true }
		}
	},

	crack: {
		category: 'perc',
		patch: {
			osc1: { type: 'square', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -3, octave: 2, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0.002, decay: 0.04, sustain: 0, release: 0.03 },
			filter: { cutoff: 7000, resonance: 3 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	pop: {
		category: 'perc',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -12, octave: -1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.06, sustain: 0, release: 0.04 },
			filter: { cutoff: 3000, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	tom: {
		category: 'perc',
		patch: {
			osc1: { type: 'sine', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -10, octave: -1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0.005, decay: 0.3, sustain: 0, release: 0.15 },
			filter: { cutoff: 600, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'cowbell-ish': {
		category: 'perc',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -3, octave: 1, semi: 4, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0.05, decay: 0.5, sustain: 0.05, release: 0.3 },
			filter: { cutoff: 7000, resonance: 5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	woodblock: {
		category: 'perc',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -14, octave: 3, semi: 0, fine: 0, enabled: false },
			env: { attack: 0.001, hold: 0, decay: 0.04, sustain: 0, release: 0.03 },
			filter: { cutoff: 8000, resonance: 1 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'conga-ish': {
		category: 'perc',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -8, octave: 0, semi: 7, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0.01, decay: 0.2, sustain: 0, release: 0.12 },
			filter: { cutoff: 2000, resonance: 4 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	laser: {
		category: 'perc',
		patch: {
			osc1: { type: 'square', level: 0, octave: 2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -6, octave: 3, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.12, sustain: 0, release: 0.06 },
			filter: { cutoff: 9000, resonance: 3 },
			lfo: { rate: 18, depth: 5000, enabled: true }
		}
	},

	impact: {
		category: 'perc',
		patch: {
			osc1: { type: 'sine', level: 0, octave: -2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -6, octave: -1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.35, sustain: 0, release: 0.2 },
			filter: { cutoff: 500, resonance: 5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	beep: {
		category: 'perc',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -20, octave: 2, semi: 0, fine: 0, enabled: false },
			env: { attack: 0.001, hold: 0.03, decay: 0.08, sustain: 0, release: 0.05 },
			filter: { cutoff: 8000, resonance: 0.5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	rivet: {
		category: 'perc',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -4, octave: 1, semi: 0, fine: 15, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.07, sustain: 0, release: 0.05 },
			filter: { cutoff: 6000, resonance: 7 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'glitch hit': {
		category: 'perc',
		patch: {
			osc1: { type: 'square', level: 0, octave: 1, semi: 0, fine: 25, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: -25, enabled: true },
			env: { attack: 0.001, hold: 0.005, decay: 0.05, sustain: 0, release: 0.03 },
			filter: { cutoff: 7500, resonance: 12 },
			lfo: { rate: 16, depth: 3500, enabled: true }
		}
	},

	boing: {
		category: 'perc',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -10, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.6, sustain: 0, release: 0.4 },
			filter: { cutoff: 2500, resonance: 14 },
			lfo: { rate: 3, depth: 2500, enabled: true }
		}
	},

	rim: {
		category: 'perc',
		patch: {
			osc1: { type: 'square', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -8, octave: 1, semi: 7, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.03, sustain: 0, release: 0.025 },
			filter: { cutoff: 8000, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	ping: {
		category: 'perc',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -8, octave: 3, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.4, sustain: 0.02, release: 0.3 },
			filter: { cutoff: 10000, resonance: 1 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	/* ===================== KEYS (expanded) ===================== */

	'clavinet-ish': {
		category: 'keys',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -3, octave: 0, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.25, sustain: 0.2, release: 0.2 },
			filter: { cutoff: 3000, resonance: 5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'celesta-ish': {
		category: 'keys',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -8, octave: 2, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.5, sustain: 0.1, release: 0.4 },
			filter: { cutoff: 7000, resonance: 0.5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'toy piano': {
		category: 'keys',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -10, octave: 2, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.3, sustain: 0, release: 0.25 },
			filter: { cutoff: 5000, resonance: 1 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'harpsichord-ish': {
		category: 'keys',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -6, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.35, sustain: 0, release: 0.25 },
			filter: { cutoff: 4500, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'bell tower': {
		category: 'keys',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -4, octave: 2, semi: 4, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 1.5, sustain: 0.05, release: 1.2 },
			filter: { cutoff: 8000, resonance: 1 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	kalimba: {
		category: 'keys',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -10, octave: 1, semi: 0, fine: 3, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.5, sustain: 0, release: 0.4 },
			filter: { cutoff: 3500, resonance: 1 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'music box': {
		category: 'keys',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -8, octave: 2, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.4, sustain: 0, release: 0.35 },
			filter: { cutoff: 6000, resonance: 0.5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	spinnet: {
		category: 'keys',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -5, enabled: true },
			osc2: { type: 'sawtooth', level: -4, octave: 0, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.45, sustain: 0.1, release: 0.3 },
			filter: { cutoff: 3500, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'clav analog': {
		category: 'keys',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -8, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.2, sustain: 0.15, release: 0.15 },
			filter: { cutoff: 4000, resonance: 3 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'detuned ep': {
		category: 'keys',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 0, semi: 0, fine: -8, enabled: true },
			osc2: { type: 'triangle', level: -3, octave: 0, semi: 0, fine: 8, enabled: true },
			env: { attack: 0.003, hold: 0, decay: 0.55, sustain: 0.3, release: 0.45 },
			filter: { cutoff: 3000, resonance: 1 },
			lfo: { rate: 4.2, depth: 180, enabled: true }
		}
	},

	/* ==================== GUITAR ==================== */

	'clean guitar': {
		category: 'pluck',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -8, octave: 0, semi: 0, fine: 3, enabled: true },
			env: { attack: 0.002, hold: 0, decay: 0.5, sustain: 0.1, release: 0.4 },
			filter: { cutoff: 3500, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -12, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'strat bite': {
		category: 'pluck',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 5, enabled: true },
			osc2: { type: 'square', level: -10, octave: 1, semi: 0, fine: -5, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.35, sustain: 0.05, release: 0.3 },
			filter: { cutoff: 5000, resonance: 4 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -14, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'les paul': {
		category: 'pluck',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -7, enabled: true },
			osc2: { type: 'sawtooth', level: -4, octave: 0, semi: 0, fine: 7, enabled: true },
			env: { attack: 0.003, hold: 0, decay: 0.7, sustain: 0.2, release: 0.5 },
			filter: { cutoff: 2800, resonance: 3 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -10, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'muted guitar': {
		category: 'pluck',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -12, octave: 0, semi: 0, fine: 4, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.1, sustain: 0, release: 0.08 },
			filter: { cutoff: 1800, resonance: 1.5 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -16, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'funk guitar': {
		category: 'pluck',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -8, octave: 0, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.08, sustain: 0, release: 0.06 },
			filter: { cutoff: 2500, resonance: 8 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -14, octave: -1, enabled: true, type: 'triangle' }
		}
	},

	'wah guitar': {
		category: 'pluck',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -8, octave: 0, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.005, hold: 0, decay: 0.3, sustain: 0.4, release: 0.3 },
			filter: { cutoff: 1200, resonance: 12 },
			lfo: { rate: 2.5, depth: 2800, enabled: true },
			sub: { level: -12, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'power chord': {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -10, enabled: true },
			osc2: { type: 'sawtooth', level: -1, octave: 0, semi: 7, fine: 10, enabled: true },
			env: { attack: 0.005, hold: 0, decay: 0.3, sustain: 0.9, release: 0.4 },
			filter: { cutoff: 3500, resonance: 5 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -8, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'slide guitar': {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -10, octave: 0, semi: 0, fine: -4, enabled: true },
			env: { attack: 0.05, hold: 0, decay: 0.5, sustain: 0.6, release: 0.6 },
			filter: { cutoff: 2200, resonance: 3 },
			lfo: { rate: 5, depth: 200, enabled: true },
			sub: { level: -14, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'twelve string': {
		category: 'pluck',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -12, enabled: true },
			osc2: { type: 'sawtooth', level: -2, octave: 1, semi: 0, fine: 12, enabled: true },
			env: { attack: 0.002, hold: 0, decay: 0.55, sustain: 0.08, release: 0.5 },
			filter: { cutoff: 4500, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -14, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'nylon string': {
		category: 'world',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -10, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.002, hold: 0, decay: 0.6, sustain: 0.05, release: 0.5 },
			filter: { cutoff: 3000, resonance: 1.5 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -16, octave: -1, enabled: true, type: 'sine' }
		}
	},

	/* ==================== CHOIR / VOX ==================== */

	'male choir': {
		category: 'vox',
		patch: {
			osc1: { type: 'sawtooth', level: -2, octave: -1, semi: 0, fine: -6, enabled: true },
			osc2: { type: 'sawtooth', level: -2, octave: -1, semi: 0, fine: 6, enabled: true },
			env: { attack: 0.6, hold: 0, decay: 0.4, sustain: 0.9, release: 1.0 },
			filter: { cutoff: 1200, resonance: 3 },
			lfo: { rate: 0.4, depth: 300, enabled: true },
			sub: { level: -8, octave: -2, enabled: true, type: 'sine' }
		}
	},

	'female choir': {
		category: 'vox',
		patch: {
			osc1: { type: 'sawtooth', level: -2, octave: 0, semi: 0, fine: -8, enabled: true },
			osc2: { type: 'sawtooth', level: -2, octave: 0, semi: 0, fine: 8, enabled: true },
			env: { attack: 0.7, hold: 0, decay: 0.4, sustain: 0.9, release: 1.2 },
			filter: { cutoff: 2000, resonance: 2.5 },
			lfo: { rate: 0.5, depth: 350, enabled: true }
		}
	},

	gregorian: {
		category: 'vox',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: -1, semi: 0, fine: -4, enabled: true },
			osc2: { type: 'triangle', level: -5, octave: -1, semi: 0, fine: 4, enabled: true },
			env: { attack: 1.2, hold: 0, decay: 0.5, sustain: 1.0, release: 1.8 },
			filter: { cutoff: 1000, resonance: 2 },
			lfo: { rate: 0.25, depth: 180, enabled: true },
			sub: { level: -10, octave: -2, enabled: true, type: 'sine' }
		}
	},

	'aah vowel': {
		category: 'vox',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -6, octave: 0, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.15, hold: 0, decay: 0.3, sustain: 0.85, release: 0.6 },
			filter: { cutoff: 900, resonance: 6 },
			lfo: { rate: 0.6, depth: 200, enabled: true }
		}
	},

	'ooh vowel': {
		category: 'vox',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -8, octave: 0, semi: 0, fine: 3, enabled: true },
			env: { attack: 0.2, hold: 0, decay: 0.3, sustain: 0.9, release: 0.8 },
			filter: { cutoff: 600, resonance: 4 },
			lfo: { rate: 0.5, depth: 150, enabled: true }
		}
	},

	'talk box': {
		category: 'vox',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -6, octave: 0, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.01, hold: 0, decay: 0.2, sustain: 0.8, release: 0.3 },
			filter: { cutoff: 800, resonance: 14 },
			lfo: { rate: 1.2, depth: 2200, enabled: true }
		}
	},

	falsetto: {
		category: 'vox',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -8, octave: 1, semi: 0, fine: 4, enabled: true },
			env: { attack: 0.08, hold: 0, decay: 0.2, sustain: 0.8, release: 0.5 },
			filter: { cutoff: 3500, resonance: 2 },
			lfo: { rate: 5.5, depth: 250, enabled: true }
		}
	},

	'vox stab': {
		category: 'vox',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -8, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: 8, enabled: true },
			env: { attack: 0.005, hold: 0.05, decay: 0.3, sustain: 0, release: 0.2 },
			filter: { cutoff: 1400, resonance: 7 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	/* ==================== BASS (sub-heavy) ==================== */

	'808 sub': {
		category: 'bass',
		patch: {
			osc1: { type: 'sine', level: 0, octave: -2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -20, octave: -1, semi: 0, fine: 0, enabled: false },
			env: { attack: 0.002, hold: 0, decay: 2.5, sustain: 0, release: 0.5 },
			filter: { cutoff: 200, resonance: 1 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -3, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'deep sub': {
		category: 'bass',
		patch: {
			osc1: { type: 'sine', level: -6, octave: -2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -18, octave: -3, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.005, hold: 0, decay: 1.0, sustain: 0.8, release: 0.6 },
			filter: { cutoff: 120, resonance: 0.5 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: 0, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'trap bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'sine', level: 0, octave: -2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -16, octave: -1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 1.8, sustain: 0.2, release: 0.4 },
			filter: { cutoff: 250, resonance: 1.5 },
			lfo: { rate: 0.3, depth: 60, enabled: true },
			sub: { level: -2, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'subbass layer': {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -8, octave: -1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.005, hold: 0, decay: 0.4, sustain: 0.75, release: 0.3 },
			filter: { cutoff: 900, resonance: 4 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -4, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'neuro sub': {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: 22, enabled: true },
			osc2: { type: 'square', level: -3, octave: -1, semi: 0, fine: -22, enabled: true },
			env: { attack: 0.003, hold: 0, decay: 0.5, sustain: 0.7, release: 0.35 },
			filter: { cutoff: 700, resonance: 14 },
			lfo: { rate: 0.18, depth: 4000, enabled: true },
			sub: { level: -5, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'dnb bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: 10, enabled: true },
			osc2: { type: 'sawtooth', level: -2, octave: -1, semi: 0, fine: -10, enabled: true },
			env: { attack: 0.002, hold: 0, decay: 0.3, sustain: 0.6, release: 0.2 },
			filter: { cutoff: 1200, resonance: 8 },
			lfo: { rate: 0.5, depth: 1400, enabled: true },
			sub: { level: -6, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'future bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: -18, enabled: true },
			osc2: { type: 'sawtooth', level: -2, octave: -1, semi: 0, fine: 18, enabled: true },
			env: { attack: 0.01, hold: 0, decay: 0.4, sustain: 0.8, release: 0.4 },
			filter: { cutoff: 2000, resonance: 6 },
			lfo: { rate: 0.35, depth: 2500, enabled: true },
			sub: { level: -5, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'techno kick bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'sine', level: 0, octave: -2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -18, octave: -1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.5, sustain: 0, release: 0.15 },
			filter: { cutoff: 300, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -3, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'reggae bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -8, octave: -1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.005, hold: 0, decay: 0.5, sustain: 0.6, release: 0.4 },
			filter: { cutoff: 700, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -5, octave: -1, enabled: true, type: 'triangle' }
		}
	},

	'jazz bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -10, octave: -1, semi: 0, fine: 3, enabled: true },
			env: { attack: 0.003, hold: 0, decay: 0.55, sustain: 0.15, release: 0.45 },
			filter: { cutoff: 1200, resonance: 1.5 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -8, octave: -1, enabled: true, type: 'triangle' }
		}
	},

	'fretless bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -6, octave: -1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.015, hold: 0, decay: 0.7, sustain: 0.45, release: 0.5 },
			filter: { cutoff: 1600, resonance: 2.5 },
			lfo: { rate: 4.5, depth: 180, enabled: true },
			sub: { level: -8, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'picked bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -10, octave: -1, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.35, sustain: 0.2, release: 0.3 },
			filter: { cutoff: 2200, resonance: 3 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -9, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'slap bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -12, octave: 0, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0.01, decay: 0.2, sustain: 0.05, release: 0.15 },
			filter: { cutoff: 3500, resonance: 6 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -7, octave: -1, enabled: true, type: 'triangle' }
		}
	},

	'pop bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -6, octave: -1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.003, hold: 0, decay: 0.4, sustain: 0.5, release: 0.3 },
			filter: { cutoff: 1800, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -7, octave: -1, enabled: true, type: 'sine' }
		}
	},

	/* ==================== STRINGS / ORCHESTRAL ==================== */

	'string section': {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -2, octave: 0, semi: 0, fine: -10, enabled: true },
			osc2: { type: 'sawtooth', level: -2, octave: 0, semi: 0, fine: 10, enabled: true },
			env: { attack: 0.4, hold: 0, decay: 0.3, sustain: 0.9, release: 0.8 },
			filter: { cutoff: 3000, resonance: 1.5 },
			lfo: { rate: 0.5, depth: 250, enabled: true }
		}
	},

	violin: {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 1, semi: 0, fine: -5, enabled: true },
			osc2: { type: 'sawtooth', level: -6, octave: 1, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.08, hold: 0, decay: 0.1, sustain: 0.85, release: 0.3 },
			filter: { cutoff: 4500, resonance: 2 },
			lfo: { rate: 5.5, depth: 300, enabled: true }
		}
	},

	cello: {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: -6, enabled: true },
			osc2: { type: 'sawtooth', level: -5, octave: -1, semi: 0, fine: 6, enabled: true },
			env: { attack: 0.12, hold: 0, decay: 0.1, sustain: 0.85, release: 0.5 },
			filter: { cutoff: 2500, resonance: 2 },
			lfo: { rate: 5, depth: 250, enabled: true },
			sub: { level: -12, octave: -1, enabled: true, type: 'sine' }
		}
	},

	viola: {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -7, enabled: true },
			osc2: { type: 'sawtooth', level: -5, octave: 0, semi: 0, fine: 7, enabled: true },
			env: { attack: 0.1, hold: 0, decay: 0.1, sustain: 0.85, release: 0.4 },
			filter: { cutoff: 3200, resonance: 1.8 },
			lfo: { rate: 5.2, depth: 270, enabled: true }
		}
	},

	'double bass arco': {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -2, semi: 0, fine: -8, enabled: true },
			osc2: { type: 'sawtooth', level: -6, octave: -2, semi: 0, fine: 8, enabled: true },
			env: { attack: 0.15, hold: 0, decay: 0.2, sustain: 0.8, release: 0.6 },
			filter: { cutoff: 1800, resonance: 2 },
			lfo: { rate: 4.8, depth: 200, enabled: true },
			sub: { level: -5, octave: -1, enabled: true, type: 'sine' }
		}
	},

	trumpet: {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -8, octave: 1, semi: 0, fine: 3, enabled: true },
			env: { attack: 0.02, hold: 0, decay: 0.15, sustain: 0.85, release: 0.25 },
			filter: { cutoff: 5000, resonance: 3 },
			lfo: { rate: 5, depth: 180, enabled: true }
		}
	},

	trombone: {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -10, octave: -1, semi: 0, fine: 4, enabled: true },
			env: { attack: 0.04, hold: 0, decay: 0.2, sustain: 0.8, release: 0.4 },
			filter: { cutoff: 2800, resonance: 2.5 },
			lfo: { rate: 4.8, depth: 200, enabled: true },
			sub: { level: -12, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'french horn': {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: -4, enabled: true },
			osc2: { type: 'triangle', level: -4, octave: 0, semi: 0, fine: 4, enabled: true },
			env: { attack: 0.1, hold: 0, decay: 0.3, sustain: 0.75, release: 0.5 },
			filter: { cutoff: 1800, resonance: 2 },
			lfo: { rate: 4.5, depth: 150, enabled: true }
		}
	},

	oboe: {
		category: 'lead',
		patch: {
			osc1: { type: 'square', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -8, octave: 1, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.03, hold: 0, decay: 0.1, sustain: 0.85, release: 0.2 },
			filter: { cutoff: 4000, resonance: 4 },
			lfo: { rate: 5, depth: 220, enabled: true }
		}
	},

	bassoon: {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -6, octave: -1, semi: 0, fine: 3, enabled: true },
			env: { attack: 0.05, hold: 0, decay: 0.2, sustain: 0.8, release: 0.4 },
			filter: { cutoff: 1500, resonance: 3 },
			lfo: { rate: 4.5, depth: 190, enabled: true },
			sub: { level: -10, octave: -1, enabled: true, type: 'sine' }
		}
	},

	clarinet: {
		category: 'lead',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -12, octave: 2, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.025, hold: 0, decay: 0.1, sustain: 0.9, release: 0.2 },
			filter: { cutoff: 3500, resonance: 2 },
			lfo: { rate: 5.2, depth: 200, enabled: true }
		}
	},

	flute: {
		category: 'lead',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -10, octave: 2, semi: 0, fine: 2, enabled: true },
			env: { attack: 0.04, hold: 0, decay: 0.1, sustain: 0.85, release: 0.25 },
			filter: { cutoff: 5000, resonance: 1.5 },
			lfo: { rate: 5.5, depth: 280, enabled: true }
		}
	},

	piccolo: {
		category: 'lead',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -14, octave: 3, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.02, hold: 0, decay: 0.08, sustain: 0.9, release: 0.15 },
			filter: { cutoff: 8000, resonance: 1 },
			lfo: { rate: 6, depth: 200, enabled: true }
		}
	},

	/* ==================== PERCUSSION ==================== */

	'kick drum': {
		category: 'perc',
		patch: {
			osc1: { type: 'sine', level: 0, octave: -2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -16, octave: -1, semi: 0, fine: 0, enabled: false },
			env: { attack: 0.001, hold: 0, decay: 0.35, sustain: 0, release: 0.1 },
			filter: { cutoff: 350, resonance: 2 },
			lfo: { rate: 30, depth: 800, enabled: true },
			sub: { level: -3, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'snare body': {
		category: 'perc',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -8, octave: 0, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0.01, decay: 0.15, sustain: 0, release: 0.08 },
			filter: { cutoff: 3000, resonance: 4 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'rim shot': {
		category: 'perc',
		patch: {
			osc1: { type: 'square', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -10, octave: 1, semi: 5, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0.002, decay: 0.06, sustain: 0, release: 0.04 },
			filter: { cutoff: 6000, resonance: 5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'tom low': {
		category: 'perc',
		patch: {
			osc1: { type: 'sine', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -12, octave: -1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.3, sustain: 0, release: 0.15 },
			filter: { cutoff: 1200, resonance: 3 },
			lfo: { rate: 25, depth: 600, enabled: true }
		}
	},

	'tom mid': {
		category: 'perc',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -14, octave: 0, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.22, sustain: 0, release: 0.12 },
			filter: { cutoff: 2000, resonance: 3 },
			lfo: { rate: 22, depth: 500, enabled: true }
		}
	},

	'tom high': {
		category: 'perc',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -14, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.16, sustain: 0, release: 0.1 },
			filter: { cutoff: 3000, resonance: 3 },
			lfo: { rate: 20, depth: 400, enabled: true }
		}
	},

	cowbell: {
		category: 'perc',
		patch: {
			osc1: { type: 'square', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -3, octave: 1, semi: 5, fine: 30, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.5, sustain: 0, release: 0.3 },
			filter: { cutoff: 5000, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	agogo: {
		category: 'perc',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -8, octave: 3, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.18, sustain: 0, release: 0.1 },
			filter: { cutoff: 7000, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	shaker: {
		category: 'perc',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 2, semi: 0, fine: 20, enabled: true },
			osc2: { type: 'triangle', level: -5, octave: 2, semi: 0, fine: -20, enabled: true },
			env: { attack: 0.005, hold: 0, decay: 0.06, sustain: 0, release: 0.04 },
			filter: { cutoff: 9000, resonance: 0.5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	tabla: {
		category: 'perc',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -10, octave: 0, semi: 7, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.25, sustain: 0, release: 0.2 },
			filter: { cutoff: 1500, resonance: 6 },
			lfo: { rate: 18, depth: 700, enabled: true }
		}
	},

	bongo: {
		category: 'perc',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -12, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.12, sustain: 0, release: 0.08 },
			filter: { cutoff: 2500, resonance: 4 },
			lfo: { rate: 15, depth: 300, enabled: true }
		}
	},

	conga: {
		category: 'perc',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -12, octave: 0, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.2, sustain: 0, release: 0.12 },
			filter: { cutoff: 2000, resonance: 4 },
			lfo: { rate: 18, depth: 400, enabled: true }
		}
	},

	woodblock: {
		category: 'perc',
		patch: {
			osc1: { type: 'square', level: 0, octave: 2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -12, octave: 2, semi: 3, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.05, sustain: 0, release: 0.03 },
			filter: { cutoff: 7000, resonance: 3 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	taiko: {
		category: 'perc',
		patch: {
			osc1: { type: 'sine', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -10, octave: -1, semi: 5, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.4, sustain: 0, release: 0.25 },
			filter: { cutoff: 1000, resonance: 3 },
			lfo: { rate: 12, depth: 500, enabled: true },
			sub: { level: -6, octave: -1, enabled: true, type: 'sine' }
		}
	},

	djembe: {
		category: 'perc',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -8, octave: -1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.2, sustain: 0, release: 0.15 },
			filter: { cutoff: 1800, resonance: 5 },
			lfo: { rate: 14, depth: 400, enabled: true }
		}
	},

	/* ==================== KEYS (expanded) ==================== */

	'electric piano': {
		category: 'keys',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -5, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.002, hold: 0, decay: 0.65, sustain: 0.35, release: 0.5 },
			filter: { cutoff: 2500, resonance: 1.2 },
			lfo: { rate: 4.8, depth: 220, enabled: true }
		}
	},

	'honky tonk': {
		category: 'keys',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: -25, enabled: true },
			osc2: { type: 'triangle', level: -2, octave: 0, semi: 0, fine: 25, enabled: true },
			env: { attack: 0.002, hold: 0, decay: 0.6, sustain: 0.3, release: 0.4 },
			filter: { cutoff: 3500, resonance: 1 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'tack piano': {
		category: 'keys',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: -15, enabled: true },
			osc2: { type: 'sawtooth', level: -10, octave: 0, semi: 0, fine: 15, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.45, sustain: 0.1, release: 0.35 },
			filter: { cutoff: 4000, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	harpsichord: {
		category: 'keys',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -6, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.4, sustain: 0, release: 0.25 },
			filter: { cutoff: 5000, resonance: 1 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'pipe organ': {
		category: 'organ',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -3, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.01, hold: 0, decay: 0.05, sustain: 1.0, release: 0.08 },
			filter: { cutoff: 6000, resonance: 0.5 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -8, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'hammond b3': {
		category: 'organ',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -3, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.005, hold: 0, decay: 0.05, sustain: 1.0, release: 0.04 },
			filter: { cutoff: 7000, resonance: 0.8 },
			lfo: { rate: 6.5, depth: 350, enabled: true },
			sub: { level: -6, octave: -1, enabled: true, type: 'square' }
		}
	},

	farfisa: {
		category: 'organ',
		patch: {
			osc1: { type: 'square', level: -2, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -6, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.003, hold: 0, decay: 0.05, sustain: 1.0, release: 0.03 },
			filter: { cutoff: 5000, resonance: 1.5 },
			lfo: { rate: 7, depth: 300, enabled: true }
		}
	},

	'drawbar 808': {
		category: 'organ',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -4, octave: 2, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.005, hold: 0, decay: 0.05, sustain: 1.0, release: 0.05 },
			filter: { cutoff: 8000, resonance: 0.5 },
			lfo: { rate: 7, depth: 280, enabled: true },
			sub: { level: -4, octave: -1, enabled: true, type: 'sine' }
		}
	},

	/* ==================== ATMO / FX ==================== */

	'dark atmo': {
		category: 'atmo',
		patch: {
			osc1: { type: 'sawtooth', level: -4, octave: -1, semi: 0, fine: 20, enabled: true },
			osc2: { type: 'square', level: -6, octave: -1, semi: 1, fine: -20, enabled: true },
			env: { attack: 2.0, hold: 0, decay: 0.5, sustain: 0.7, release: 3.0 },
			filter: { cutoff: 800, resonance: 6 },
			lfo: { rate: 0.08, depth: 1200, enabled: true }
		}
	},

	'space wind': {
		category: 'atmo',
		patch: {
			osc1: { type: 'sine', level: -3, octave: 0, semi: 0, fine: -18, enabled: true },
			osc2: { type: 'triangle', level: -5, octave: 1, semi: 0, fine: 18, enabled: true },
			env: { attack: 2.5, hold: 0, decay: 0.6, sustain: 0.8, release: 3.5 },
			filter: { cutoff: 2000, resonance: 3 },
			lfo: { rate: 0.05, depth: 1800, enabled: true }
		}
	},

	'radio noise': {
		category: 'atmo',
		patch: {
			osc1: { type: 'square', level: -6, octave: 0, semi: 3, fine: 40, enabled: true },
			osc2: { type: 'square', level: -6, octave: 0, semi: -3, fine: -40, enabled: true },
			env: { attack: 0.5, hold: 0, decay: 0.5, sustain: 0.6, release: 1.5 },
			filter: { cutoff: 1200, resonance: 8 },
			lfo: { rate: 0.12, depth: 2500, enabled: true }
		}
	},

	shimmer: {
		category: 'atmo',
		patch: {
			osc1: { type: 'sine', level: -2, octave: 2, semi: 0, fine: -12, enabled: true },
			osc2: { type: 'sine', level: -2, octave: 2, semi: 0, fine: 12, enabled: true },
			env: { attack: 1.5, hold: 0, decay: 0.5, sustain: 0.9, release: 2.5 },
			filter: { cutoff: 8000, resonance: 1 },
			lfo: { rate: 0.2, depth: 600, enabled: true }
		}
	},

	haunted: {
		category: 'atmo',
		patch: {
			osc1: { type: 'triangle', level: -4, octave: 0, semi: 1, fine: -30, enabled: true },
			osc2: { type: 'sine', level: -5, octave: 0, semi: -1, fine: 30, enabled: true },
			env: { attack: 1.8, hold: 0, decay: 0.6, sustain: 0.75, release: 2.8 },
			filter: { cutoff: 1400, resonance: 9 },
			lfo: { rate: 0.07, depth: 2200, enabled: true }
		}
	},

	underwater: {
		category: 'atmo',
		patch: {
			osc1: { type: 'sine', level: -2, octave: 0, semi: 0, fine: -8, enabled: true },
			osc2: { type: 'triangle', level: -4, octave: 0, semi: 0, fine: 8, enabled: true },
			env: { attack: 1.2, hold: 0, decay: 0.5, sustain: 0.85, release: 2.0 },
			filter: { cutoff: 600, resonance: 10 },
			lfo: { rate: 0.12, depth: 800, enabled: true }
		}
	},

	/* ==================== FX ==================== */

	lazer: {
		category: 'fx',
		patch: {
			osc1: { type: 'square', level: 0, octave: 2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -4, octave: 2, semi: 0, fine: 0, enabled: false },
			env: { attack: 0.001, hold: 0, decay: 0.08, sustain: 0, release: 0.04 },
			filter: { cutoff: 9000, resonance: 10 },
			lfo: { rate: 25, depth: 5000, enabled: true }
		}
	},

	explosion: {
		category: 'fx',
		patch: {
			osc1: { type: 'square', level: 0, octave: -1, semi: 0, fine: 40, enabled: true },
			osc2: { type: 'square', level: -2, octave: -1, semi: 0, fine: -40, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.8, sustain: 0, release: 0.5 },
			filter: { cutoff: 1200, resonance: 3 },
			lfo: { rate: 3, depth: 2500, enabled: true },
			sub: { level: -3, octave: -1, enabled: true, type: 'sine' }
		}
	},

	riser: {
		category: 'fx',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -20, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: 20, enabled: true },
			env: { attack: 2.0, hold: 0, decay: 0.1, sustain: 1.0, release: 0.5 },
			filter: { cutoff: 500, resonance: 5 },
			lfo: { rate: 0.5, depth: 5000, enabled: true }
		}
	},

	downlifter: {
		category: 'fx',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -4, octave: 0, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.01, hold: 0, decay: 2.0, sustain: 0, release: 1.0 },
			filter: { cutoff: 4000, resonance: 4 },
			lfo: { rate: 0.25, depth: 4000, enabled: true }
		}
	},

	teleport: {
		category: 'fx',
		patch: {
			osc1: { type: 'square', level: 0, octave: 1, semi: 0, fine: 25, enabled: true },
			osc2: { type: 'triangle', level: -4, octave: 2, semi: 0, fine: -25, enabled: true },
			env: { attack: 0.001, hold: 0.03, decay: 0.15, sustain: 0, release: 0.1 },
			filter: { cutoff: 7000, resonance: 12 },
			lfo: { rate: 18, depth: 3500, enabled: true }
		}
	},

	spit: {
		category: 'fx',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -6, octave: 1, semi: 0, fine: 20, enabled: true },
			env: { attack: 0.001, hold: 0.005, decay: 0.04, sustain: 0, release: 0.03 },
			filter: { cutoff: 5500, resonance: 8 },
			lfo: { rate: 20, depth: 2000, enabled: true }
		}
	},

	/* ==================== WORLD (expanded) ==================== */

	didgeridoo: {
		category: 'world',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -6, octave: -2, semi: 7, fine: 0, enabled: true },
			env: { attack: 0.05, hold: 0, decay: 0.3, sustain: 0.9, release: 0.4 },
			filter: { cutoff: 800, resonance: 8 },
			lfo: { rate: 0.8, depth: 600, enabled: true },
			sub: { level: -8, octave: -1, enabled: true, type: 'sine' }
		}
	},

	shakuhachi: {
		category: 'world',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -8, octave: 2, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.06, hold: 0, decay: 0.2, sustain: 0.7, release: 0.4 },
			filter: { cutoff: 3500, resonance: 5 },
			lfo: { rate: 4.5, depth: 350, enabled: true }
		}
	},

	erhu: {
		category: 'world',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 1, semi: 0, fine: -8, enabled: true },
			osc2: { type: 'sawtooth', level: -8, octave: 1, semi: 0, fine: 8, enabled: true },
			env: { attack: 0.06, hold: 0, decay: 0.1, sustain: 0.85, release: 0.35 },
			filter: { cutoff: 3800, resonance: 3 },
			lfo: { rate: 5.5, depth: 300, enabled: true }
		}
	},

	shamisen: {
		category: 'world',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -10, octave: 1, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.45, sustain: 0, release: 0.35 },
			filter: { cutoff: 3500, resonance: 5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	bagpipe: {
		category: 'world',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: -15, enabled: true },
			osc2: { type: 'square', level: -4, octave: 0, semi: 0, fine: 15, enabled: true },
			env: { attack: 0.04, hold: 0, decay: 0.1, sustain: 1.0, release: 0.2 },
			filter: { cutoff: 2500, resonance: 3 },
			lfo: { rate: 6, depth: 200, enabled: true }
		}
	},

	sarangi: {
		category: 'world',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -10, enabled: true },
			osc2: { type: 'sawtooth', level: -5, octave: 0, semi: 0, fine: 10, enabled: true },
			env: { attack: 0.04, hold: 0, decay: 0.1, sustain: 0.9, release: 0.4 },
			filter: { cutoff: 3000, resonance: 4 },
			lfo: { rate: 5.8, depth: 280, enabled: true }
		}
	},

	steel_drum: {
		category: 'world',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -5, octave: 2, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.6, sustain: 0.05, release: 0.5 },
			filter: { cutoff: 5000, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	mbira: {
		category: 'world',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -10, octave: 2, semi: 7, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.55, sustain: 0.02, release: 0.45 },
			filter: { cutoff: 4000, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	/* ==================== BELLS (expanded) ==================== */

	churchbell: {
		category: 'bells',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -3, octave: 1, semi: 4, fine: 20, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 3.0, sustain: 0.1, release: 2.5 },
			filter: { cutoff: 7000, resonance: 0.5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'singing bowl': {
		category: 'bells',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -6, octave: 0, semi: 2, fine: 0, enabled: true },
			env: { attack: 0.1, hold: 0, decay: 2.5, sustain: 0.2, release: 2.0 },
			filter: { cutoff: 5000, resonance: 1 },
			lfo: { rate: 5, depth: 100, enabled: true }
		}
	},

	glockenspiel: {
		category: 'bells',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -8, octave: 3, semi: 4, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.5, sustain: 0, release: 0.4 },
			filter: { cutoff: 9000, resonance: 0.5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	tubular: {
		category: 'bells',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -5, octave: 2, semi: 3, fine: 10, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 1.5, sustain: 0.08, release: 1.2 },
			filter: { cutoff: 6000, resonance: 1 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	windchime: {
		category: 'bells',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 2, semi: 0, fine: -15, enabled: true },
			osc2: { type: 'sine', level: -4, octave: 2, semi: 5, fine: 15, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.7, sustain: 0, release: 0.6 },
			filter: { cutoff: 8000, resonance: 0.3 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	/* ==================== BASS mutations ==================== */

	'dub bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'square', level: 0, octave: -2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -10, octave: -2, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.01, hold: 0, decay: 1.5, sustain: 0.7, release: 1.0 },
			filter: { cutoff: 600, resonance: 2 },
			lfo: { rate: 0.2, depth: 200, enabled: true },
			sub: { level: -4, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'gabber kick': {
		category: 'bass',
		patch: {
			osc1: { type: 'sine', level: 0, octave: -2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -20, octave: -1, semi: 0, fine: 0, enabled: false },
			env: { attack: 0.001, hold: 0, decay: 0.12, sustain: 0, release: 0.05 },
			filter: { cutoff: 400, resonance: 3 },
			lfo: { rate: 40, depth: 1200, enabled: true },
			sub: { level: -2, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'lo-fi bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: -1, semi: 0, fine: -12, enabled: true },
			osc2: { type: 'sine', level: -8, octave: -1, semi: 0, fine: 12, enabled: true },
			env: { attack: 0.008, hold: 0, decay: 0.6, sustain: 0.5, release: 0.4 },
			filter: { cutoff: 850, resonance: 1.5 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -6, octave: -1, enabled: true, type: 'triangle' }
		}
	},

	'hip hop bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: -1, semi: 0, fine: -5, enabled: true },
			osc2: { type: 'sine', level: -6, octave: -2, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.005, hold: 0, decay: 0.55, sustain: 0.45, release: 0.35 },
			filter: { cutoff: 900, resonance: 2.5 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -5, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'drill bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: -8, enabled: true },
			osc2: { type: 'sawtooth', level: -4, octave: -2, semi: 0, fine: 8, enabled: true },
			env: { attack: 0.002, hold: 0, decay: 0.3, sustain: 0.6, release: 0.2 },
			filter: { cutoff: 700, resonance: 5 },
			lfo: { rate: 0.4, depth: 900, enabled: true },
			sub: { level: -6, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'house bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -12, octave: -2, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.003, hold: 0, decay: 0.25, sustain: 0.55, release: 0.2 },
			filter: { cutoff: 1400, resonance: 4 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -7, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'funk stab bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'square', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -8, octave: 0, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0.02, decay: 0.18, sustain: 0, release: 0.12 },
			filter: { cutoff: 2800, resonance: 7 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -8, octave: -1, enabled: true, type: 'triangle' }
		}
	},

	'analog bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: -3, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: -1, semi: 0, fine: 3, enabled: true },
			env: { attack: 0.007, hold: 0, decay: 0.4, sustain: 0.7, release: 0.3 },
			filter: { cutoff: 1100, resonance: 6 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -7, octave: -1, enabled: true, type: 'sine' }
		}
	},

	thumper: {
		category: 'bass',
		patch: {
			osc1: { type: 'sine', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -10, octave: 0, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.4, sustain: 0.3, release: 0.2 },
			filter: { cutoff: 1000, resonance: 8 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -3, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'prog bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: -6, enabled: true },
			osc2: { type: 'square', level: -5, octave: -1, semi: 5, fine: 6, enabled: true },
			env: { attack: 0.008, hold: 0, decay: 0.5, sustain: 0.65, release: 0.4 },
			filter: { cutoff: 1300, resonance: 5 },
			lfo: { rate: 0.7, depth: 700, enabled: true },
			sub: { level: -6, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'sub wobble': {
		category: 'bass',
		patch: {
			osc1: { type: 'sine', level: 0, octave: -2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -18, octave: -2, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.005, hold: 0, decay: 0.8, sustain: 0.85, release: 0.5 },
			filter: { cutoff: 180, resonance: 1 },
			lfo: { rate: 0.4, depth: 120, enabled: true },
			sub: { level: 0, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'minimal bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'sine', level: 0, octave: -2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -24, octave: -1, semi: 0, fine: 0, enabled: false },
			env: { attack: 0.005, hold: 0, decay: 0.6, sustain: 0.8, release: 0.4 },
			filter: { cutoff: 250, resonance: 0.5 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -2, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'dark minimal': {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -2, semi: 0, fine: 16, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: -2, semi: 0, fine: -16, enabled: true },
			env: { attack: 0.01, hold: 0, decay: 0.5, sustain: 0.75, release: 0.4 },
			filter: { cutoff: 450, resonance: 4 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -5, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'bounce bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -8, octave: -1, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.22, sustain: 0.35, release: 0.18 },
			filter: { cutoff: 1200, resonance: 9 },
			lfo: { rate: 3, depth: 1200, enabled: true },
			sub: { level: -6, octave: -1, enabled: true, type: 'triangle' }
		}
	},

	'hardstyle bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -5, octave: -1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.2, sustain: 0.5, release: 0.15 },
			filter: { cutoff: 1800, resonance: 10 },
			lfo: { rate: 0.25, depth: 2800, enabled: true },
			sub: { level: -4, octave: -1, enabled: true, type: 'sine' }
		}
	},

	/* ==================== LEAD mutations ==================== */

	'moog lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -5, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.015, hold: 0, decay: 0.3, sustain: 0.85, release: 0.35 },
			filter: { cutoff: 2200, resonance: 9 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'analog mono': {
		category: 'lead',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -14, octave: -1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.005, hold: 0, decay: 0.25, sustain: 0.75, release: 0.3 },
			filter: { cutoff: 3000, resonance: 11 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'electro lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: -20, enabled: true },
			osc2: { type: 'square', level: -3, octave: 0, semi: 0, fine: 20, enabled: true },
			env: { attack: 0.003, hold: 0, decay: 0.2, sustain: 0.9, release: 0.25 },
			filter: { cutoff: 4000, resonance: 7 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'acid lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -18, octave: -1, semi: 0, fine: 0, enabled: false },
			env: { attack: 0.001, hold: 0, decay: 0.15, sustain: 0.3, release: 0.15 },
			filter: { cutoff: 800, resonance: 17 },
			lfo: { rate: 4, depth: 2800, enabled: true }
		}
	},

	'vintage synth': {
		category: 'lead',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: -8, enabled: true },
			osc2: { type: 'sawtooth', level: -6, octave: 0, semi: 0, fine: 8, enabled: true },
			env: { attack: 0.02, hold: 0, decay: 0.35, sustain: 0.75, release: 0.45 },
			filter: { cutoff: 3500, resonance: 4 },
			lfo: { rate: 5, depth: 300, enabled: true }
		}
	},

	'tape lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -18, enabled: true },
			osc2: { type: 'sawtooth', level: -2, octave: 0, semi: 0, fine: 18, enabled: true },
			env: { attack: 0.025, hold: 0, decay: 0.4, sustain: 0.7, release: 0.5 },
			filter: { cutoff: 2800, resonance: 2 },
			lfo: { rate: 0.3, depth: 400, enabled: true }
		}
	},

	'pluck lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -8, octave: 1, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.3, sustain: 0.1, release: 0.25 },
			filter: { cutoff: 4500, resonance: 6 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'synth brass': {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -12, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: 12, enabled: true },
			env: { attack: 0.04, hold: 0, decay: 0.2, sustain: 0.85, release: 0.3 },
			filter: { cutoff: 3800, resonance: 3 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	futurist: {
		category: 'lead',
		patch: {
			osc1: { type: 'square', level: 0, octave: 1, semi: 1, fine: -30, enabled: true },
			osc2: { type: 'sawtooth', level: -4, octave: 0, semi: -1, fine: 30, enabled: true },
			env: { attack: 0.01, hold: 0, decay: 0.3, sustain: 0.7, release: 0.4 },
			filter: { cutoff: 5500, resonance: 12 },
			lfo: { rate: 6, depth: 800, enabled: true }
		}
	},

	'crystal lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 2, semi: 0, fine: -6, enabled: true },
			osc2: { type: 'sine', level: -5, octave: 2, semi: 0, fine: 6, enabled: true },
			env: { attack: 0.002, hold: 0, decay: 0.3, sustain: 0.6, release: 0.4 },
			filter: { cutoff: 9000, resonance: 4 },
			lfo: { rate: 5, depth: 300, enabled: true }
		}
	},

	monophonic: {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -24, octave: 0, semi: 0, fine: 0, enabled: false },
			env: { attack: 0.008, hold: 0, decay: 0.2, sustain: 0.9, release: 0.25 },
			filter: { cutoff: 3200, resonance: 8 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'xmod lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 7, fine: 0, enabled: true },
			osc2: { type: 'square', level: -3, octave: 0, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.003, hold: 0, decay: 0.15, sustain: 0.8, release: 0.2 },
			filter: { cutoff: 6000, resonance: 13 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	/* ==================== PAD mutations ==================== */

	'lush pad': {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: -14, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: 14, enabled: true },
			env: { attack: 1.5, hold: 0, decay: 0.5, sustain: 0.95, release: 2.5 },
			filter: { cutoff: 2800, resonance: 1.5 },
			lfo: { rate: 0.15, depth: 600, enabled: true }
		}
	},

	'cinematic pad': {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -2, octave: -1, semi: 0, fine: -8, enabled: true },
			osc2: { type: 'triangle', level: -4, octave: 0, semi: 7, fine: 8, enabled: true },
			env: { attack: 1.8, hold: 0, decay: 0.6, sustain: 0.85, release: 3.0 },
			filter: { cutoff: 1800, resonance: 2 },
			lfo: { rate: 0.1, depth: 900, enabled: true }
		}
	},

	'lo-fi pad': {
		category: 'pad',
		patch: {
			osc1: { type: 'triangle', level: -3, octave: 0, semi: 0, fine: -20, enabled: true },
			osc2: { type: 'triangle', level: -3, octave: 0, semi: 0, fine: 20, enabled: true },
			env: { attack: 0.8, hold: 0, decay: 0.4, sustain: 0.85, release: 1.5 },
			filter: { cutoff: 1200, resonance: 1 },
			lfo: { rate: 0.2, depth: 250, enabled: true }
		}
	},

	'night pad': {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -4, octave: -1, semi: 0, fine: -5, enabled: true },
			osc2: { type: 'sine', level: -5, octave: -1, semi: 7, fine: 5, enabled: true },
			env: { attack: 1.4, hold: 0, decay: 0.5, sustain: 0.8, release: 2.2 },
			filter: { cutoff: 800, resonance: 5 },
			lfo: { rate: 0.08, depth: 700, enabled: true }
		}
	},

	'angel pad': {
		category: 'pad',
		patch: {
			osc1: { type: 'sine', level: -2, octave: 2, semi: 0, fine: -6, enabled: true },
			osc2: { type: 'triangle', level: -4, octave: 2, semi: 0, fine: 6, enabled: true },
			env: { attack: 1.2, hold: 0, decay: 0.4, sustain: 0.9, release: 2.0 },
			filter: { cutoff: 7000, resonance: 1 },
			lfo: { rate: 0.3, depth: 400, enabled: true }
		}
	},

	evolution: {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: -22, enabled: true },
			osc2: { type: 'square', level: -5, octave: 0, semi: 0, fine: 22, enabled: true },
			env: { attack: 2.5, hold: 0, decay: 0.7, sustain: 0.75, release: 3.5 },
			filter: { cutoff: 1400, resonance: 7 },
			lfo: { rate: 0.06, depth: 2200, enabled: true }
		}
	},

	horizon: {
		category: 'pad',
		patch: {
			osc1: { type: 'triangle', level: -2, octave: 0, semi: 0, fine: -10, enabled: true },
			osc2: { type: 'sawtooth', level: -4, octave: 1, semi: 0, fine: 10, enabled: true },
			env: { attack: 1.0, hold: 0, decay: 0.4, sustain: 0.9, release: 2.0 },
			filter: { cutoff: 3500, resonance: 1.5 },
			lfo: { rate: 0.14, depth: 800, enabled: true }
		}
	},

	memories: {
		category: 'pad',
		patch: {
			osc1: { type: 'triangle', level: -2, octave: 0, semi: 0, fine: -7, enabled: true },
			osc2: { type: 'sine', level: -4, octave: 1, semi: 0, fine: 7, enabled: true },
			env: { attack: 1.3, hold: 0, decay: 0.4, sustain: 0.88, release: 2.0 },
			filter: { cutoff: 2000, resonance: 1 },
			lfo: { rate: 0.22, depth: 350, enabled: true }
		}
	},

	drift: {
		category: 'pad',
		patch: {
			osc1: { type: 'sine', level: -2, octave: 0, semi: 0, fine: -25, enabled: true },
			osc2: { type: 'sine', level: -2, octave: 0, semi: 0, fine: 25, enabled: true },
			env: { attack: 1.8, hold: 0, decay: 0.5, sustain: 0.9, release: 3.0 },
			filter: { cutoff: 5000, resonance: 0.6 },
			lfo: { rate: 0.07, depth: 1500, enabled: true }
		}
	},

	bloom: {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: -9, enabled: true },
			osc2: { type: 'triangle', level: -4, octave: 1, semi: 0, fine: 9, enabled: true },
			env: { attack: 2.0, hold: 0, decay: 0.5, sustain: 0.88, release: 2.8 },
			filter: { cutoff: 2600, resonance: 2 },
			lfo: { rate: 0.16, depth: 700, enabled: true }
		}
	},

	haze: {
		category: 'pad',
		patch: {
			osc1: { type: 'sine', level: -3, octave: 0, semi: 0, fine: -16, enabled: true },
			osc2: { type: 'triangle', level: -5, octave: 0, semi: 5, fine: 16, enabled: true },
			env: { attack: 1.6, hold: 0, decay: 0.6, sustain: 0.8, release: 2.5 },
			filter: { cutoff: 1600, resonance: 3 },
			lfo: { rate: 0.09, depth: 1100, enabled: true }
		}
	},

	'frozen pad': {
		category: 'pad',
		patch: {
			osc1: { type: 'sine', level: -2, octave: 1, semi: 0, fine: -30, enabled: true },
			osc2: { type: 'sine', level: -2, octave: 1, semi: 0, fine: 30, enabled: true },
			env: { attack: 2.2, hold: 0, decay: 0.5, sustain: 0.85, release: 3.5 },
			filter: { cutoff: 7000, resonance: 1 },
			lfo: { rate: 0.04, depth: 2000, enabled: true }
		}
	},

	/* ==================== KEYS mutations ==================== */

	'toy piano 2': {
		category: 'keys',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -10, octave: 3, semi: 0, fine: 25, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.3, sustain: 0, release: 0.2 },
			filter: { cutoff: 5000, resonance: 1 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'prepared piano': {
		category: 'keys',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 30, enabled: true },
			osc2: { type: 'triangle', level: -8, octave: 0, semi: 0, fine: -30, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.5, sustain: 0.05, release: 0.4 },
			filter: { cutoff: 2000, resonance: 5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	clavinet: {
		category: 'keys',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -10, octave: 0, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.25, sustain: 0.08, release: 0.2 },
			filter: { cutoff: 3500, resonance: 4 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'felt piano': {
		category: 'keys',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: -6, enabled: true },
			osc2: { type: 'sine', level: -8, octave: 1, semi: 0, fine: 6, enabled: true },
			env: { attack: 0.003, hold: 0, decay: 0.5, sustain: 0.15, release: 0.4 },
			filter: { cutoff: 1800, resonance: 0.8 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'music box 2': {
		category: 'keys',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -12, octave: 3, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.4, sustain: 0, release: 0.35 },
			filter: { cutoff: 6000, resonance: 0.5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'bright piano': {
		category: 'keys',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: -4, enabled: true },
			osc2: { type: 'sawtooth', level: -14, octave: 1, semi: 0, fine: 4, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.65, sustain: 0.2, release: 0.5 },
			filter: { cutoff: 6000, resonance: 1 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'synth piano': {
		category: 'keys',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -12, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.55, sustain: 0.25, release: 0.45 },
			filter: { cutoff: 4500, resonance: 1.5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	/* ==================== VOX mutations ==================== */

	'robot voice': {
		category: 'vox',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: -20, enabled: true },
			osc2: { type: 'square', level: -3, octave: 0, semi: 0, fine: 20, enabled: true },
			env: { attack: 0.005, hold: 0, decay: 0.1, sustain: 0.9, release: 0.15 },
			filter: { cutoff: 1500, resonance: 12 },
			lfo: { rate: 1.5, depth: 1000, enabled: true }
		}
	},

	'vocoder approx': {
		category: 'vox',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -10, enabled: true },
			osc2: { type: 'sawtooth', level: -4, octave: 0, semi: 0, fine: 10, enabled: true },
			env: { attack: 0.05, hold: 0, decay: 0.2, sustain: 0.9, release: 0.4 },
			filter: { cutoff: 1000, resonance: 15 },
			lfo: { rate: 2, depth: 1800, enabled: true }
		}
	},

	scat: {
		category: 'vox',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: 5, enabled: true },
			osc2: { type: 'triangle', level: -8, octave: 1, semi: 0, fine: -5, enabled: true },
			env: { attack: 0.002, hold: 0.01, decay: 0.1, sustain: 0.4, release: 0.1 },
			filter: { cutoff: 2500, resonance: 5 },
			lfo: { rate: 8, depth: 600, enabled: true }
		}
	},

	'ee vowel': {
		category: 'vox',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -10, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.1, hold: 0, decay: 0.2, sustain: 0.9, release: 0.5 },
			filter: { cutoff: 2800, resonance: 8 },
			lfo: { rate: 0.7, depth: 300, enabled: true }
		}
	},

	whisper: {
		category: 'vox',
		patch: {
			osc1: { type: 'triangle', level: -6, octave: 0, semi: 0, fine: -15, enabled: true },
			osc2: { type: 'triangle', level: -6, octave: 0, semi: 0, fine: 15, enabled: true },
			env: { attack: 0.15, hold: 0, decay: 0.3, sustain: 0.6, release: 0.7 },
			filter: { cutoff: 4000, resonance: 2 },
			lfo: { rate: 0.4, depth: 200, enabled: true }
		}
	},

	/* ==================== PERC mutations ==================== */

	'e-kick': {
		category: 'perc',
		patch: {
			osc1: { type: 'sine', level: 0, octave: -2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -20, octave: -1, semi: 0, fine: 0, enabled: false },
			env: { attack: 0.001, hold: 0, decay: 0.28, sustain: 0, release: 0.08 },
			filter: { cutoff: 500, resonance: 3 },
			lfo: { rate: 35, depth: 1000, enabled: true },
			sub: { level: -4, octave: -1, enabled: true, type: 'sine' }
		}
	},

	'e-snare': {
		category: 'perc',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: 15, enabled: true },
			osc2: { type: 'triangle', level: -6, octave: 0, semi: 0, fine: -15, enabled: true },
			env: { attack: 0.001, hold: 0.008, decay: 0.12, sustain: 0, release: 0.07 },
			filter: { cutoff: 4000, resonance: 5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	clap: {
		category: 'perc',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 1, semi: 0, fine: 30, enabled: true },
			osc2: { type: 'triangle', level: -4, octave: 1, semi: 0, fine: -30, enabled: true },
			env: { attack: 0.001, hold: 0.005, decay: 0.1, sustain: 0, release: 0.06 },
			filter: { cutoff: 6000, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'hihat closed': {
		category: 'perc',
		patch: {
			osc1: { type: 'square', level: 0, octave: 3, semi: 0, fine: 40, enabled: true },
			osc2: { type: 'square', level: -3, octave: 3, semi: 0, fine: -40, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.04, sustain: 0, release: 0.02 },
			filter: { cutoff: 10000, resonance: 1 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'hihat open': {
		category: 'perc',
		patch: {
			osc1: { type: 'square', level: 0, octave: 3, semi: 0, fine: 40, enabled: true },
			osc2: { type: 'square', level: -3, octave: 3, semi: 0, fine: -40, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.35, sustain: 0.1, release: 0.3 },
			filter: { cutoff: 10000, resonance: 0.5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'industrial perc': {
		category: 'perc',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: 20, enabled: true },
			osc2: { type: 'sawtooth', level: -5, octave: -1, semi: 0, fine: -20, enabled: true },
			env: { attack: 0.001, hold: 0.02, decay: 0.25, sustain: 0, release: 0.15 },
			filter: { cutoff: 3500, resonance: 7 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'trap hihat': {
		category: 'perc',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 3, semi: 0, fine: 25, enabled: true },
			osc2: { type: 'square', level: -5, octave: 3, semi: 0, fine: -25, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.06, sustain: 0, release: 0.04 },
			filter: { cutoff: 9000, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	/* ==================== ORGAN mutations ==================== */

	'gospel organ': {
		category: 'organ',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -3, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.005, hold: 0, decay: 0.05, sustain: 1.0, release: 0.06 },
			filter: { cutoff: 6500, resonance: 0.7 },
			lfo: { rate: 7.5, depth: 400, enabled: true },
			sub: { level: -5, octave: -1, enabled: true, type: 'square' }
		}
	},

	'jazz organ': {
		category: 'organ',
		patch: {
			osc1: { type: 'sine', level: -2, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -5, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.008, hold: 0, decay: 0.05, sustain: 1.0, release: 0.05 },
			filter: { cutoff: 4000, resonance: 1 },
			lfo: { rate: 6, depth: 200, enabled: true }
		}
	},

	'rock organ': {
		category: 'organ',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: -8, enabled: true },
			osc2: { type: 'sine', level: -4, octave: 1, semi: 0, fine: 8, enabled: true },
			env: { attack: 0.004, hold: 0, decay: 0.05, sustain: 1.0, release: 0.04 },
			filter: { cutoff: 5500, resonance: 2 },
			lfo: { rate: 7, depth: 350, enabled: true },
			sub: { level: -6, octave: -1, enabled: true, type: 'square' }
		}
	},

	'vox continental': {
		category: 'organ',
		patch: {
			osc1: { type: 'square', level: -4, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -8, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.003, hold: 0, decay: 0.05, sustain: 1.0, release: 0.03 },
			filter: { cutoff: 4500, resonance: 1.5 },
			lfo: { rate: 7, depth: 280, enabled: true }
		}
	},

	/* ==================== WORLD mutations ==================== */

	'pan flute': {
		category: 'world',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -12, octave: 2, semi: 0, fine: 3, enabled: true },
			env: { attack: 0.06, hold: 0, decay: 0.15, sustain: 0.7, release: 0.35 },
			filter: { cutoff: 4000, resonance: 1.5 },
			lfo: { rate: 5, depth: 220, enabled: true }
		}
	},

	'tin whistle': {
		category: 'world',
		patch: {
			osc1: { type: 'square', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -14, octave: 2, semi: 0, fine: 4, enabled: true },
			env: { attack: 0.03, hold: 0, decay: 0.08, sustain: 0.88, release: 0.2 },
			filter: { cutoff: 4500, resonance: 2 },
			lfo: { rate: 5.5, depth: 240, enabled: true }
		}
	},

	duduk: {
		category: 'world',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: -6, enabled: true },
			osc2: { type: 'sawtooth', level: -8, octave: 0, semi: 0, fine: 6, enabled: true },
			env: { attack: 0.07, hold: 0, decay: 0.15, sustain: 0.85, release: 0.45 },
			filter: { cutoff: 2200, resonance: 5 },
			lfo: { rate: 4.5, depth: 320, enabled: true }
		}
	},

	mandolin: {
		category: 'world',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 1, semi: 0, fine: -10, enabled: true },
			osc2: { type: 'sawtooth', level: -4, octave: 1, semi: 0, fine: 10, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.3, sustain: 0, release: 0.25 },
			filter: { cutoff: 4000, resonance: 3 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	banjo: {
		category: 'world',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: 8, enabled: true },
			osc2: { type: 'sawtooth', level: -8, octave: 1, semi: 0, fine: -8, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.28, sustain: 0, release: 0.22 },
			filter: { cutoff: 5000, resonance: 4 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	cajon: {
		category: 'world',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -8, octave: -2, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.2, sustain: 0, release: 0.15 },
			filter: { cutoff: 2000, resonance: 4 },
			lfo: { rate: 12, depth: 400, enabled: true }
		}
	},

	ukelele: {
		category: 'world',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 1, semi: 0, fine: 5, enabled: true },
			osc2: { type: 'sine', level: -8, octave: 1, semi: 0, fine: -5, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.45, sustain: 0.05, release: 0.35 },
			filter: { cutoff: 4500, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	/* ==================== PLUCK mutations ==================== */

	pizzicato: {
		category: 'pluck',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -10, octave: 0, semi: 0, fine: 4, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.18, sustain: 0, release: 0.15 },
			filter: { cutoff: 2500, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'e-pluck': {
		category: 'pluck',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -6, enabled: true },
			osc2: { type: 'square', level: -10, octave: 1, semi: 0, fine: 6, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.35, sustain: 0.05, release: 0.28 },
			filter: { cutoff: 4000, resonance: 6 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	tine: {
		category: 'pluck',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -8, octave: 2, semi: 0, fine: 10, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.55, sustain: 0.1, release: 0.45 },
			filter: { cutoff: 3500, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'comb pluck': {
		category: 'pluck',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: -18, enabled: true },
			osc2: { type: 'square', level: -4, octave: 0, semi: 0, fine: 18, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.4, sustain: 0, release: 0.35 },
			filter: { cutoff: 3000, resonance: 8 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'harp harmonic': {
		category: 'pluck',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -6, octave: 3, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.5, sustain: 0, release: 0.4 },
			filter: { cutoff: 8000, resonance: 0.5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	/* ==================== ATMO mutations ==================== */

	'deep space': {
		category: 'atmo',
		patch: {
			osc1: { type: 'sine', level: -5, octave: -2, semi: 0, fine: -30, enabled: true },
			osc2: { type: 'sine', level: -5, octave: -2, semi: 0, fine: 30, enabled: true },
			env: { attack: 3.0, hold: 0, decay: 0.8, sustain: 0.7, release: 4.0 },
			filter: { cutoff: 400, resonance: 4 },
			lfo: { rate: 0.04, depth: 1800, enabled: true }
		}
	},

	'arctic wind': {
		category: 'atmo',
		patch: {
			osc1: { type: 'triangle', level: -4, octave: 1, semi: 0, fine: -35, enabled: true },
			osc2: { type: 'sine', level: -6, octave: 2, semi: 0, fine: 35, enabled: true },
			env: { attack: 2.5, hold: 0, decay: 0.7, sustain: 0.75, release: 3.5 },
			filter: { cutoff: 5000, resonance: 2 },
			lfo: { rate: 0.06, depth: 2500, enabled: true }
		}
	},

	'cave drip': {
		category: 'atmo',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -10, octave: 2, semi: 5, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 1.5, sustain: 0, release: 1.0 },
			filter: { cutoff: 3000, resonance: 12 },
			lfo: { rate: 0.1, depth: 3000, enabled: true }
		}
	},

	static: {
		category: 'atmo',
		patch: {
			osc1: { type: 'square', level: -5, octave: 0, semi: 5, fine: 45, enabled: true },
			osc2: { type: 'square', level: -5, octave: 0, semi: -5, fine: -45, enabled: true },
			env: { attack: 0.3, hold: 0, decay: 0.5, sustain: 0.7, release: 1.5 },
			filter: { cutoff: 2000, resonance: 6 },
			lfo: { rate: 0.2, depth: 3000, enabled: true }
		}
	},

	/* ==================== FX mutations ==================== */

	whoosh: {
		category: 'fx',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 1, semi: 0, fine: -20, enabled: true },
			osc2: { type: 'triangle', level: -5, octave: 2, semi: 0, fine: 20, enabled: true },
			env: { attack: 0.2, hold: 0, decay: 0.4, sustain: 0, release: 0.3 },
			filter: { cutoff: 4000, resonance: 3 },
			lfo: { rate: 0.8, depth: 5000, enabled: true }
		}
	},

	ping: {
		category: 'fx',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -8, octave: 3, semi: 4, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.5, sustain: 0, release: 0.4 },
			filter: { cutoff: 9000, resonance: 8 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'power up': {
		category: 'fx',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -4, octave: 1, semi: 0, fine: 10, enabled: true },
			env: { attack: 0.5, hold: 0, decay: 0.2, sustain: 0.8, release: 0.3 },
			filter: { cutoff: 3000, resonance: 5 },
			lfo: { rate: 0.6, depth: 4000, enabled: true }
		}
	},

	crackle: {
		category: 'fx',
		patch: {
			osc1: { type: 'square', level: 0, octave: 1, semi: 3, fine: 35, enabled: true },
			osc2: { type: 'square', level: -6, octave: 1, semi: -3, fine: -35, enabled: true },
			env: { attack: 0.001, hold: 0.003, decay: 0.03, sustain: 0, release: 0.02 },
			filter: { cutoff: 7000, resonance: 4 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	'glitch burst': {
		category: 'fx',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: 45, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: 1, semi: 1, fine: -45, enabled: true },
			env: { attack: 0.001, hold: 0.01, decay: 0.06, sustain: 0.3, release: 0.05 },
			filter: { cutoff: 5000, resonance: 16 },
			lfo: { rate: 22, depth: 4000, enabled: true }
		}
	},

	/* ===== CHOIR + GUITAR ===== */

	'choir guitar': {
		category: 'vox',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -8, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: 8, enabled: true },
			env: { attack: 0.06, hold: 0, decay: 0.4, sustain: 0.75, release: 0.7 },
			filter: { cutoff: 2000, resonance: 3 },
			lfo: { rate: 0.4, depth: 200, enabled: true }
		}
	},
	'sung string': {
		category: 'vox',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: -5, enabled: true },
			osc2: { type: 'sawtooth', level: -6, octave: 0, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.1, hold: 0, decay: 0.35, sustain: 0.8, release: 0.7 },
			filter: { cutoff: 2500, resonance: 2 },
			lfo: { rate: 0.5, depth: 250, enabled: true }
		}
	},
	'sacred pluck': {
		category: 'world',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -8, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.04, hold: 0, decay: 0.45, sustain: 0.5, release: 0.5 },
			filter: { cutoff: 2200, resonance: 2 },
			lfo: { rate: 0.35, depth: 180, enabled: true }
		}
	},
	'gospel strum': {
		category: 'vox',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -10, enabled: true },
			osc2: { type: 'square', level: -6, octave: 0, semi: 0, fine: 10, enabled: true },
			env: { attack: 0.02, hold: 0, decay: 0.35, sustain: 0.7, release: 0.4 },
			filter: { cutoff: 1800, resonance: 4 },
			lfo: { rate: 0.3, depth: 300, enabled: true },
			sub: { level: -10, octave: -1, enabled: true, type: 'sine' }
		}
	},
	'bowed voices': {
		category: 'vox',
		patch: {
			osc1: { type: 'sawtooth', level: -2, octave: 0, semi: 0, fine: -6, enabled: true },
			osc2: { type: 'sawtooth', level: -2, octave: 0, semi: 0, fine: 6, enabled: true },
			env: { attack: 0.3, hold: 0, decay: 0.2, sustain: 0.9, release: 0.8 },
			filter: { cutoff: 1500, resonance: 2 },
			lfo: { rate: 0.45, depth: 220, enabled: true }
		}
	},
	'vocal twang': {
		category: 'vox',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -8, octave: 0, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.002, hold: 0, decay: 0.5, sustain: 0.3, release: 0.4 },
			filter: { cutoff: 2000, resonance: 6 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},
	'choral harp': {
		category: 'vox',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -6, octave: 0, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.04, hold: 0, decay: 0.55, sustain: 0.4, release: 0.6 },
			filter: { cutoff: 3000, resonance: 1.5 },
			lfo: { rate: 0.4, depth: 180, enabled: true }
		}
	},
	'nylon choir': {
		category: 'vox',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -6, octave: 0, semi: 0, fine: 8, enabled: true },
			env: { attack: 0.08, hold: 0, decay: 0.5, sustain: 0.6, release: 0.7 },
			filter: { cutoff: 2500, resonance: 1.5 },
			lfo: { rate: 0.4, depth: 200, enabled: true }
		}
	},
	'strum choir': {
		category: 'vox',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -12, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: 12, enabled: true },
			env: { attack: 0.005, hold: 0, decay: 0.45, sustain: 0.6, release: 0.5 },
			filter: { cutoff: 2200, resonance: 3 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},
	'lute voices': {
		category: 'world',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: -7, enabled: true },
			osc2: { type: 'sawtooth', level: -5, octave: 0, semi: 7, fine: 7, enabled: true },
			env: { attack: 0.05, hold: 0, decay: 0.5, sustain: 0.55, release: 0.6 },
			filter: { cutoff: 2000, resonance: 2.5 },
			lfo: { rate: 0.35, depth: 160, enabled: true }
		}
	},

	/* ===== PAD + LEAD hybrids ===== */

	'drifting lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -10, enabled: true },
			osc2: { type: 'sine', level: -6, octave: 1, semi: 0, fine: 10, enabled: true },
			env: { attack: 0.3, hold: 0, decay: 0.3, sustain: 0.85, release: 0.8 },
			filter: { cutoff: 4000, resonance: 3 },
			lfo: { rate: 0.2, depth: 800, enabled: true }
		}
	},
	'lead swell': {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -6, enabled: true },
			osc2: { type: 'square', level: -5, octave: 0, semi: 0, fine: 6, enabled: true },
			env: { attack: 0.6, hold: 0, decay: 0.3, sustain: 0.9, release: 1.2 },
			filter: { cutoff: 5000, resonance: 4 },
			lfo: { rate: 0.25, depth: 1000, enabled: true }
		}
	},
	'gliding tone': {
		category: 'lead',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: -4, enabled: true },
			osc2: { type: 'sawtooth', level: -5, octave: 0, semi: 0, fine: 4, enabled: true },
			env: { attack: 0.25, hold: 0, decay: 0.25, sustain: 0.9, release: 0.6 },
			filter: { cutoff: 3500, resonance: 5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},
	'bright swell': {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -2, octave: 0, semi: 0, fine: -16, enabled: true },
			osc2: { type: 'sawtooth', level: -2, octave: 1, semi: 0, fine: 16, enabled: true },
			env: { attack: 0.8, hold: 0, decay: 0.4, sustain: 0.88, release: 1.5 },
			filter: { cutoff: 6500, resonance: 2 },
			lfo: { rate: 0.18, depth: 1200, enabled: true }
		}
	},
	'warm lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: -8, enabled: true },
			osc2: { type: 'triangle', level: -4, octave: 0, semi: 0, fine: 8, enabled: true },
			env: { attack: 0.2, hold: 0, decay: 0.3, sustain: 0.8, release: 0.5 },
			filter: { cutoff: 2800, resonance: 4 },
			lfo: { rate: 4.5, depth: 200, enabled: true }
		}
	},
	'slow lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -5, enabled: true },
			osc2: { type: 'sine', level: -8, octave: 0, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.5, hold: 0, decay: 0.2, sustain: 0.9, release: 0.7 },
			filter: { cutoff: 4500, resonance: 3 },
			lfo: { rate: 5, depth: 300, enabled: true }
		}
	},
	'soaring pad': {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -2, octave: 1, semi: 0, fine: -12, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: 0, semi: 7, fine: 12, enabled: true },
			env: { attack: 1.0, hold: 0, decay: 0.4, sustain: 0.9, release: 2.0 },
			filter: { cutoff: 4000, resonance: 2 },
			lfo: { rate: 0.2, depth: 700, enabled: true }
		}
	},
	'singing pad': {
		category: 'pad',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 0, semi: 0, fine: -5, enabled: true },
			osc2: { type: 'sawtooth', level: -5, octave: 0, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.9, hold: 0, decay: 0.4, sustain: 0.88, release: 1.8 },
			filter: { cutoff: 2500, resonance: 5 },
			lfo: { rate: 0.3, depth: 500, enabled: true }
		}
	},
	'tonal drift': {
		category: 'pad',
		patch: {
			osc1: { type: 'sine', level: -2, octave: 0, semi: 0, fine: -20, enabled: true },
			osc2: { type: 'triangle', level: -3, octave: 0, semi: 7, fine: 20, enabled: true },
			env: { attack: 1.4, hold: 0, decay: 0.5, sustain: 0.85, release: 2.2 },
			filter: { cutoff: 3000, resonance: 2 },
			lfo: { rate: 0.1, depth: 900, enabled: true }
		}
	},
	'floating lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 1, semi: 0, fine: -6, enabled: true },
			osc2: { type: 'triangle', level: -6, octave: 1, semi: 0, fine: 6, enabled: true },
			env: { attack: 0.4, hold: 0, decay: 0.3, sustain: 0.75, release: 0.8 },
			filter: { cutoff: 6000, resonance: 2 },
			lfo: { rate: 5, depth: 350, enabled: true }
		}
	},
	'resonant pad': {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: -8, enabled: true },
			osc2: { type: 'square', level: -5, octave: 0, semi: 0, fine: 8, enabled: true },
			env: { attack: 1.2, hold: 0, decay: 0.5, sustain: 0.8, release: 2.0 },
			filter: { cutoff: 1600, resonance: 14 },
			lfo: { rate: 0.15, depth: 1400, enabled: true }
		}
	},
	'melodic atmo': {
		category: 'atmo',
		patch: {
			osc1: { type: 'triangle', level: -3, octave: 0, semi: 0, fine: -18, enabled: true },
			osc2: { type: 'sine', level: -4, octave: 1, semi: 0, fine: 18, enabled: true },
			env: { attack: 1.5, hold: 0, decay: 0.5, sustain: 0.8, release: 2.5 },
			filter: { cutoff: 3500, resonance: 3 },
			lfo: { rate: 0.1, depth: 1200, enabled: true }
		}
	},
	'lead bloom': {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -14, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: 14, enabled: true },
			env: { attack: 0.7, hold: 0, decay: 0.4, sustain: 0.88, release: 1.5 },
			filter: { cutoff: 5500, resonance: 3 },
			lfo: { rate: 0.22, depth: 800, enabled: true }
		}
	},
	'pad melody': {
		category: 'pad',
		patch: {
			osc1: { type: 'sine', level: -2, octave: 0, semi: 0, fine: -9, enabled: true },
			osc2: { type: 'sawtooth', level: -4, octave: 0, semi: 4, fine: 9, enabled: true },
			env: { attack: 0.5, hold: 0, decay: 0.35, sustain: 0.85, release: 1.2 },
			filter: { cutoff: 4000, resonance: 4 },
			lfo: { rate: 0.3, depth: 600, enabled: true }
		}
	},
	'pad lead 2': {
		category: 'lead',
		patch: {
			osc1: { type: 'square', level: -2, octave: 0, semi: 0, fine: -7, enabled: true },
			osc2: { type: 'sine', level: -4, octave: 1, semi: 0, fine: 7, enabled: true },
			env: { attack: 0.35, hold: 0, decay: 0.25, sustain: 0.85, release: 0.7 },
			filter: { cutoff: 3800, resonance: 5 },
			lfo: { rate: 4.8, depth: 280, enabled: true }
		}
	},

	/* ===== BASS + PERC ===== */

	'kick bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'sine', level: 0, octave: -2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -14, octave: -1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.3, sustain: 0.2, release: 0.12 },
			filter: { cutoff: 600, resonance: 4 },
			lfo: { rate: 28, depth: 900, enabled: true },
			sub: { level: -4, octave: -1, enabled: true, type: 'sine' }
		}
	},
	'bass thump': {
		category: 'bass',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -10, octave: -2, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0.01, decay: 0.2, sustain: 0.1, release: 0.15 },
			filter: { cutoff: 1200, resonance: 6 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -5, octave: -1, enabled: true, type: 'sine' }
		}
	},
	'percussive sub': {
		category: 'bass',
		patch: {
			osc1: { type: 'sine', level: 0, octave: -2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -16, octave: -1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.5, sustain: 0, release: 0.2 },
			filter: { cutoff: 400, resonance: 2 },
			lfo: { rate: 20, depth: 600, enabled: true },
			sub: { level: -3, octave: -1, enabled: true, type: 'sine' }
		}
	},
	'punchy bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -12, octave: -1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0.015, decay: 0.25, sustain: 0.3, release: 0.18 },
			filter: { cutoff: 2000, resonance: 7 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -6, octave: -1, enabled: true, type: 'triangle' }
		}
	},
	'drum bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'sine', level: 0, octave: -2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -10, octave: -1, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.22, sustain: 0, release: 0.1 },
			filter: { cutoff: 800, resonance: 5 },
			lfo: { rate: 25, depth: 700, enabled: true },
			sub: { level: -4, octave: -1, enabled: true, type: 'sine' }
		}
	},
	'rhythmic low': {
		category: 'bass',
		patch: {
			osc1: { type: 'square', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -8, octave: -2, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0.02, decay: 0.18, sustain: 0, release: 0.1 },
			filter: { cutoff: 1500, resonance: 8 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -5, octave: -1, enabled: true, type: 'square' }
		}
	},
	'bass click': {
		category: 'bass',
		patch: {
			osc1: { type: 'square', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -8, octave: 0, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0.008, decay: 0.12, sustain: 0.05, release: 0.1 },
			filter: { cutoff: 3000, resonance: 5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},
	'attack bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: 4, enabled: true },
			osc2: { type: 'square', level: -8, octave: 0, semi: 0, fine: -4, enabled: true },
			env: { attack: 0.001, hold: 0.01, decay: 0.3, sustain: 0.4, release: 0.2 },
			filter: { cutoff: 2500, resonance: 9 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -7, octave: -1, enabled: true, type: 'sine' }
		}
	},
	'stab bass 2': {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: -5, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: -1, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.001, hold: 0.02, decay: 0.2, sustain: 0, release: 0.15 },
			filter: { cutoff: 3500, resonance: 8 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -6, octave: -1, enabled: true, type: 'sine' }
		}
	},
	'punch sub': {
		category: 'bass',
		patch: {
			osc1: { type: 'sine', level: 0, octave: -2, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -18, octave: -1, semi: 0, fine: 0, enabled: false },
			env: { attack: 0.001, hold: 0, decay: 0.4, sustain: 0, release: 0.15 },
			filter: { cutoff: 300, resonance: 1 },
			lfo: { rate: 32, depth: 1200, enabled: true },
			sub: { level: -2, octave: -1, enabled: true, type: 'sine' }
		}
	},

	/* ===== AMBIENT + NOISE ===== */

	'noise pad': {
		category: 'atmo',
		patch: {
			osc1: { type: 'square', level: -5, octave: 0, semi: 4, fine: 42, enabled: true },
			osc2: { type: 'square', level: -5, octave: 0, semi: -4, fine: -42, enabled: true },
			env: { attack: 1.0, hold: 0, decay: 0.6, sustain: 0.7, release: 2.0 },
			filter: { cutoff: 1500, resonance: 5 },
			lfo: { rate: 0.15, depth: 2000, enabled: true }
		}
	},
	'hiss cloud': {
		category: 'atmo',
		patch: {
			osc1: { type: 'square', level: -6, octave: 1, semi: 3, fine: 48, enabled: true },
			osc2: { type: 'square', level: -6, octave: 1, semi: -3, fine: -48, enabled: true },
			env: { attack: 1.5, hold: 0, decay: 0.5, sustain: 0.65, release: 2.5 },
			filter: { cutoff: 3000, resonance: 3 },
			lfo: { rate: 0.1, depth: 2500, enabled: true }
		}
	},
	'rough air': {
		category: 'atmo',
		patch: {
			osc1: { type: 'square', level: -4, octave: 0, semi: 5, fine: -45, enabled: true },
			osc2: { type: 'triangle', level: -6, octave: 1, semi: -5, fine: 45, enabled: true },
			env: { attack: 0.8, hold: 0, decay: 0.5, sustain: 0.7, release: 1.8 },
			filter: { cutoff: 2200, resonance: 8 },
			lfo: { rate: 0.12, depth: 1800, enabled: true }
		}
	},
	'corroded pad': {
		category: 'atmo',
		patch: {
			osc1: { type: 'sawtooth', level: -4, octave: -1, semi: 0, fine: 35, enabled: true },
			osc2: { type: 'square', level: -5, octave: 0, semi: 1, fine: -35, enabled: true },
			env: { attack: 1.2, hold: 0, decay: 0.6, sustain: 0.72, release: 2.2 },
			filter: { cutoff: 900, resonance: 9 },
			lfo: { rate: 0.08, depth: 2200, enabled: true }
		}
	},
	'rust cloud': {
		category: 'atmo',
		patch: {
			osc1: { type: 'square', level: -5, octave: -1, semi: 3, fine: 40, enabled: true },
			osc2: { type: 'sawtooth', level: -5, octave: -1, semi: -3, fine: -40, enabled: true },
			env: { attack: 1.8, hold: 0, decay: 0.7, sustain: 0.68, release: 3.0 },
			filter: { cutoff: 700, resonance: 6 },
			lfo: { rate: 0.07, depth: 1600, enabled: true }
		}
	},
	'tape hiss': {
		category: 'atmo',
		patch: {
			osc1: { type: 'triangle', level: -5, octave: 2, semi: 0, fine: 45, enabled: true },
			osc2: { type: 'triangle', level: -5, octave: 2, semi: 0, fine: -45, enabled: true },
			env: { attack: 0.5, hold: 0, decay: 0.5, sustain: 0.6, release: 1.5 },
			filter: { cutoff: 5000, resonance: 2 },
			lfo: { rate: 0.2, depth: 3000, enabled: true }
		}
	},
	'noise bloom': {
		category: 'atmo',
		patch: {
			osc1: { type: 'square', level: -4, octave: 0, semi: 6, fine: 38, enabled: true },
			osc2: { type: 'square', level: -5, octave: 1, semi: -6, fine: -38, enabled: true },
			env: { attack: 2.0, hold: 0, decay: 0.6, sustain: 0.75, release: 3.0 },
			filter: { cutoff: 1200, resonance: 7 },
			lfo: { rate: 0.06, depth: 2800, enabled: true }
		}
	},
	'static swell': {
		category: 'atmo',
		patch: {
			osc1: { type: 'square', level: -5, octave: 1, semi: 4, fine: 50, enabled: true },
			osc2: { type: 'square', level: -5, octave: 0, semi: -4, fine: -50, enabled: true },
			env: { attack: 2.5, hold: 0, decay: 0.7, sustain: 0.65, release: 3.5 },
			filter: { cutoff: 1800, resonance: 4 },
			lfo: { rate: 0.05, depth: 3500, enabled: true }
		}
	},
	'electric air': {
		category: 'atmo',
		patch: {
			osc1: { type: 'square', level: -4, octave: 0, semi: 2, fine: 32, enabled: true },
			osc2: { type: 'sawtooth', level: -6, octave: 0, semi: -2, fine: -32, enabled: true },
			env: { attack: 0.7, hold: 0, decay: 0.5, sustain: 0.7, release: 1.8 },
			filter: { cutoff: 2500, resonance: 10 },
			lfo: { rate: 0.18, depth: 2200, enabled: true }
		}
	},
	'storm pad': {
		category: 'atmo',
		patch: {
			osc1: { type: 'sawtooth', level: -4, octave: -1, semi: 0, fine: -28, enabled: true },
			osc2: { type: 'square', level: -4, octave: 0, semi: 0, fine: 28, enabled: true },
			env: { attack: 1.5, hold: 0, decay: 0.6, sustain: 0.8, release: 2.8 },
			filter: { cutoff: 1000, resonance: 6 },
			lfo: { rate: 0.09, depth: 2600, enabled: true }
		}
	},
	'chaos pad': {
		category: 'atmo',
		patch: {
			osc1: { type: 'square', level: -4, octave: 0, semi: 7, fine: 50, enabled: true },
			osc2: { type: 'sawtooth', level: -4, octave: 0, semi: -7, fine: -50, enabled: true },
			env: { attack: 1.0, hold: 0, decay: 0.6, sustain: 0.72, release: 2.2 },
			filter: { cutoff: 1400, resonance: 11 },
			lfo: { rate: 0.11, depth: 3000, enabled: true }
		}
	},
	'gritty atmo': {
		category: 'atmo',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: -1, semi: 3, fine: 22, enabled: true },
			osc2: { type: 'square', level: -5, octave: -1, semi: -3, fine: -22, enabled: true },
			env: { attack: 0.9, hold: 0, decay: 0.6, sustain: 0.68, release: 2.0 },
			filter: { cutoff: 800, resonance: 12 },
			lfo: { rate: 0.13, depth: 1900, enabled: true }
		}
	},
	'noisy ether': {
		category: 'atmo',
		patch: {
			osc1: { type: 'square', level: -5, octave: 0, semi: 0, fine: 44, enabled: true },
			osc2: { type: 'triangle', level: -5, octave: 1, semi: 5, fine: -44, enabled: true },
			env: { attack: 1.6, hold: 0, decay: 0.6, sustain: 0.7, release: 2.8 },
			filter: { cutoff: 2000, resonance: 8 },
			lfo: { rate: 0.14, depth: 2400, enabled: true }
		}
	},
	'gravel atmo': {
		category: 'atmo',
		patch: {
			osc1: { type: 'square', level: -4, octave: -1, semi: 4, fine: 36, enabled: true },
			osc2: { type: 'square', level: -6, octave: 0, semi: -4, fine: -36, enabled: true },
			env: { attack: 1.3, hold: 0, decay: 0.6, sustain: 0.66, release: 2.5 },
			filter: { cutoff: 600, resonance: 7 },
			lfo: { rate: 0.1, depth: 2100, enabled: true }
		}
	},
	'white void': {
		category: 'atmo',
		patch: {
			osc1: { type: 'square', level: -5, octave: 2, semi: 0, fine: 50, enabled: true },
			osc2: { type: 'square', level: -5, octave: -1, semi: 0, fine: -50, enabled: true },
			env: { attack: 2.2, hold: 0, decay: 0.8, sustain: 0.6, release: 4.0 },
			filter: { cutoff: 2800, resonance: 5 },
			lfo: { rate: 0.04, depth: 4000, enabled: true }
		}
	},

	/* ===== BELL + PAD ===== */

	'bell pad': {
		category: 'bells',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -5, octave: 2, semi: 4, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 1.8, sustain: 0.35, release: 1.5 },
			filter: { cutoff: 6000, resonance: 1 },
			lfo: { rate: 0.25, depth: 300, enabled: true }
		}
	},
	'chime pad': {
		category: 'bells',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 2, semi: 0, fine: -8, enabled: true },
			osc2: { type: 'triangle', level: -6, octave: 2, semi: 0, fine: 8, enabled: true },
			env: { attack: 0.002, hold: 0, decay: 1.4, sustain: 0.25, release: 1.2 },
			filter: { cutoff: 8000, resonance: 0.8 },
			lfo: { rate: 0.3, depth: 250, enabled: true }
		}
	},
	'sustained bell': {
		category: 'bells',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -8, octave: 1, semi: 7, fine: 15, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 2.5, sustain: 0.2, release: 2.0 },
			filter: { cutoff: 7000, resonance: 0.5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},
	'pad bell': {
		category: 'pad',
		patch: {
			osc1: { type: 'sine', level: -2, octave: 1, semi: 0, fine: -5, enabled: true },
			osc2: { type: 'triangle', level: -4, octave: 1, semi: 5, fine: 5, enabled: true },
			env: { attack: 0.6, hold: 0, decay: 1.0, sustain: 0.5, release: 1.8 },
			filter: { cutoff: 5000, resonance: 1.5 },
			lfo: { rate: 0.2, depth: 400, enabled: true }
		}
	},
	'bell cloud': {
		category: 'bells',
		patch: {
			osc1: { type: 'sine', level: -3, octave: 1, semi: 0, fine: -10, enabled: true },
			osc2: { type: 'sine', level: -3, octave: 2, semi: 0, fine: 10, enabled: true },
			env: { attack: 0.3, hold: 0, decay: 1.5, sustain: 0.4, release: 2.0 },
			filter: { cutoff: 7000, resonance: 1 },
			lfo: { rate: 0.15, depth: 500, enabled: true }
		}
	},
	'bell swell': {
		category: 'bells',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 2, semi: 0, fine: -12, enabled: true },
			osc2: { type: 'sine', level: -5, octave: 2, semi: 3, fine: 12, enabled: true },
			env: { attack: 0.8, hold: 0, decay: 1.2, sustain: 0.3, release: 2.0 },
			filter: { cutoff: 8000, resonance: 0.6 },
			lfo: { rate: 0.2, depth: 400, enabled: true }
		}
	},
	'crystal pad': {
		category: 'pad',
		patch: {
			osc1: { type: 'sine', level: -2, octave: 2, semi: 0, fine: -8, enabled: true },
			osc2: { type: 'sine', level: -3, octave: 2, semi: 4, fine: 8, enabled: true },
			env: { attack: 0.5, hold: 0, decay: 0.8, sustain: 0.6, release: 1.5 },
			filter: { cutoff: 9000, resonance: 1 },
			lfo: { rate: 0.25, depth: 350, enabled: true }
		}
	},
	'tonal bell': {
		category: 'bells',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -4, octave: 2, semi: 2, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 2.0, sustain: 0.1, release: 1.8 },
			filter: { cutoff: 6000, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},
	'mellow bell': {
		category: 'bells',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -6, octave: 1, semi: 0, fine: 6, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 1.2, sustain: 0.15, release: 1.0 },
			filter: { cutoff: 4500, resonance: 1 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},
	'bright bell pad': {
		category: 'pad',
		patch: {
			osc1: { type: 'sine', level: -2, octave: 2, semi: 0, fine: -14, enabled: true },
			osc2: { type: 'sine', level: -2, octave: 2, semi: 7, fine: 14, enabled: true },
			env: { attack: 0.4, hold: 0, decay: 1.0, sustain: 0.45, release: 1.8 },
			filter: { cutoff: 9000, resonance: 0.5 },
			lfo: { rate: 0.3, depth: 300, enabled: true }
		}
	},

	/* ===== GUITAR + SYNTH ===== */

	'synth guitar': {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -5, enabled: true },
			osc2: { type: 'square', level: -8, octave: 0, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.45, sustain: 0.35, release: 0.4 },
			filter: { cutoff: 4500, resonance: 5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},
	'digital strum': {
		category: 'pluck',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: -18, enabled: true },
			osc2: { type: 'sawtooth', level: -5, octave: 0, semi: 0, fine: 18, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.3, sustain: 0.08, release: 0.25 },
			filter: { cutoff: 3500, resonance: 6 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},
	'cyber strum': {
		category: 'lead',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -6, octave: 1, semi: 0, fine: 12, enabled: true },
			env: { attack: 0.002, hold: 0, decay: 0.35, sustain: 0.5, release: 0.35 },
			filter: { cutoff: 5000, resonance: 7 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},
	'hybrid string': {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -10, enabled: true },
			osc2: { type: 'triangle', level: -5, octave: 0, semi: 0, fine: 10, enabled: true },
			env: { attack: 0.02, hold: 0, decay: 0.4, sustain: 0.7, release: 0.5 },
			filter: { cutoff: 3800, resonance: 3 },
			lfo: { rate: 5, depth: 180, enabled: true }
		}
	},
	'modular guitar': {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -5, octave: 0, semi: 7, fine: 0, enabled: true },
			env: { attack: 0.003, hold: 0, decay: 0.4, sustain: 0.55, release: 0.4 },
			filter: { cutoff: 3000, resonance: 9 },
			lfo: { rate: 0.6, depth: 1200, enabled: true }
		}
	},
	'processed guitar': {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -22, enabled: true },
			osc2: { type: 'sawtooth', level: -2, octave: 0, semi: 0, fine: 22, enabled: true },
			env: { attack: 0.005, hold: 0, decay: 0.5, sustain: 0.7, release: 0.4 },
			filter: { cutoff: 2500, resonance: 10 },
			lfo: { rate: 1.5, depth: 1500, enabled: true }
		}
	},
	'digital guitar': {
		category: 'lead',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: -14, enabled: true },
			osc2: { type: 'square', level: -3, octave: 0, semi: 0, fine: 14, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.28, sustain: 0.2, release: 0.22 },
			filter: { cutoff: 4000, resonance: 8 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},
	'e-guitar pad': {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -2, octave: 0, semi: 0, fine: -8, enabled: true },
			osc2: { type: 'triangle', level: -4, octave: 0, semi: 0, fine: 8, enabled: true },
			env: { attack: 0.5, hold: 0, decay: 0.4, sustain: 0.8, release: 1.2 },
			filter: { cutoff: 3000, resonance: 4 },
			lfo: { rate: 0.3, depth: 500, enabled: true }
		}
	},
	'guitar lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -6, enabled: true },
			osc2: { type: 'sine', level: -10, octave: 0, semi: 0, fine: 6, enabled: true },
			env: { attack: 0.01, hold: 0, decay: 0.45, sustain: 0.6, release: 0.5 },
			filter: { cutoff: 3500, resonance: 4 },
			lfo: { rate: 5, depth: 250, enabled: true }
		}
	},
	'synth string': {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -12, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: 12, enabled: true },
			env: { attack: 0.08, hold: 0, decay: 0.3, sustain: 0.85, release: 0.6 },
			filter: { cutoff: 5000, resonance: 2 },
			lfo: { rate: 5, depth: 200, enabled: true }
		}
	},

	/* ===== VOX + SYNTH ===== */

	'cyber choir': {
		category: 'vox',
		patch: {
			osc1: { type: 'square', level: -2, octave: 0, semi: 0, fine: -12, enabled: true },
			osc2: { type: 'square', level: -3, octave: 0, semi: 0, fine: 12, enabled: true },
			env: { attack: 0.5, hold: 0, decay: 0.3, sustain: 0.88, release: 1.0 },
			filter: { cutoff: 1200, resonance: 8 },
			lfo: { rate: 0.4, depth: 600, enabled: true }
		}
	},
	'digital vox': {
		category: 'vox',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: -8, enabled: true },
			osc2: { type: 'sawtooth', level: -5, octave: 0, semi: 0, fine: 8, enabled: true },
			env: { attack: 0.08, hold: 0, decay: 0.2, sustain: 0.88, release: 0.5 },
			filter: { cutoff: 1500, resonance: 10 },
			lfo: { rate: 0.8, depth: 700, enabled: true }
		}
	},
	'synth voice': {
		category: 'vox',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -6, enabled: true },
			osc2: { type: 'triangle', level: -6, octave: 0, semi: 0, fine: 6, enabled: true },
			env: { attack: 0.12, hold: 0, decay: 0.25, sustain: 0.9, release: 0.6 },
			filter: { cutoff: 1100, resonance: 12 },
			lfo: { rate: 1.0, depth: 800, enabled: true }
		}
	},
	'electric voice': {
		category: 'vox',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -6, octave: 0, semi: 0, fine: 10, enabled: true },
			env: { attack: 0.05, hold: 0, decay: 0.2, sustain: 0.85, release: 0.4 },
			filter: { cutoff: 1800, resonance: 9 },
			lfo: { rate: 1.2, depth: 900, enabled: true }
		}
	},
	'filtered vox': {
		category: 'vox',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -14, enabled: true },
			osc2: { type: 'sawtooth', level: -4, octave: 0, semi: 0, fine: 14, enabled: true },
			env: { attack: 0.2, hold: 0, decay: 0.3, sustain: 0.88, release: 0.7 },
			filter: { cutoff: 900, resonance: 16 },
			lfo: { rate: 0.6, depth: 1200, enabled: true }
		}
	},
	'analog choir': {
		category: 'vox',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: -10, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: 10, enabled: true },
			env: { attack: 0.7, hold: 0, decay: 0.4, sustain: 0.9, release: 1.2 },
			filter: { cutoff: 1400, resonance: 5 },
			lfo: { rate: 0.35, depth: 280, enabled: true }
		}
	},
	'detuned vox': {
		category: 'vox',
		patch: {
			osc1: { type: 'sawtooth', level: -2, octave: 0, semi: 0, fine: -25, enabled: true },
			osc2: { type: 'sawtooth', level: -2, octave: 0, semi: 0, fine: 25, enabled: true },
			env: { attack: 0.4, hold: 0, decay: 0.3, sustain: 0.88, release: 0.9 },
			filter: { cutoff: 1600, resonance: 4 },
			lfo: { rate: 0.45, depth: 300, enabled: true }
		}
	},
	'wobble vox': {
		category: 'vox',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'square', level: -6, octave: 0, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.1, hold: 0, decay: 0.2, sustain: 0.85, release: 0.5 },
			filter: { cutoff: 1000, resonance: 14 },
			lfo: { rate: 0.8, depth: 2000, enabled: true }
		}
	},
	'processed choir': {
		category: 'vox',
		patch: {
			osc1: { type: 'square', level: -3, octave: 0, semi: 0, fine: -16, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: 0, semi: 7, fine: 16, enabled: true },
			env: { attack: 0.6, hold: 0, decay: 0.4, sustain: 0.9, release: 1.2 },
			filter: { cutoff: 1300, resonance: 6 },
			lfo: { rate: 0.3, depth: 400, enabled: true }
		}
	},
	'robot choir': {
		category: 'vox',
		patch: {
			osc1: { type: 'square', level: -2, octave: 0, semi: 0, fine: -20, enabled: true },
			osc2: { type: 'square', level: -2, octave: 0, semi: 0, fine: 20, enabled: true },
			env: { attack: 0.3, hold: 0, decay: 0.2, sustain: 0.9, release: 0.8 },
			filter: { cutoff: 1000, resonance: 10 },
			lfo: { rate: 0.5, depth: 800, enabled: true }
		}
	},

	/* ===== STRINGS + PAD ===== */

	'string pad': {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -2, octave: 0, semi: 0, fine: -8, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: 0, semi: 7, fine: 8, enabled: true },
			env: { attack: 0.5, hold: 0, decay: 0.4, sustain: 0.88, release: 1.2 },
			filter: { cutoff: 3200, resonance: 1.5 },
			lfo: { rate: 0.4, depth: 220, enabled: true }
		}
	},
	'orchestral pad': {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -2, octave: -1, semi: 0, fine: -10, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: 10, enabled: true },
			env: { attack: 0.8, hold: 0, decay: 0.5, sustain: 0.88, release: 1.8 },
			filter: { cutoff: 2800, resonance: 2 },
			lfo: { rate: 0.3, depth: 300, enabled: true }
		}
	},
	'bowed pad': {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: -6, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: 6, enabled: true },
			env: { attack: 1.0, hold: 0, decay: 0.4, sustain: 0.9, release: 1.6 },
			filter: { cutoff: 2500, resonance: 2 },
			lfo: { rate: 0.45, depth: 240, enabled: true }
		}
	},
	'string swell': {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -2, octave: 0, semi: 0, fine: -14, enabled: true },
			osc2: { type: 'sawtooth', level: -2, octave: 0, semi: 0, fine: 14, enabled: true },
			env: { attack: 1.5, hold: 0, decay: 0.5, sustain: 0.9, release: 2.2 },
			filter: { cutoff: 3500, resonance: 1.5 },
			lfo: { rate: 0.35, depth: 350, enabled: true }
		}
	},
	'slow strings': {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: -12, enabled: true },
			osc2: { type: 'triangle', level: -5, octave: 0, semi: 7, fine: 12, enabled: true },
			env: { attack: 1.8, hold: 0, decay: 0.6, sustain: 0.85, release: 2.5 },
			filter: { cutoff: 2200, resonance: 2 },
			lfo: { rate: 0.28, depth: 280, enabled: true }
		}
	},
	'cello pad': {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -2, octave: -1, semi: 0, fine: -7, enabled: true },
			osc2: { type: 'sawtooth', level: -4, octave: -1, semi: 0, fine: 7, enabled: true },
			env: { attack: 0.9, hold: 0, decay: 0.4, sustain: 0.88, release: 1.5 },
			filter: { cutoff: 1800, resonance: 2.5 },
			lfo: { rate: 0.38, depth: 200, enabled: true }
		}
	},
	'violin pad': {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -2, octave: 1, semi: 0, fine: -9, enabled: true },
			osc2: { type: 'sawtooth', level: -4, octave: 1, semi: 0, fine: 9, enabled: true },
			env: { attack: 0.7, hold: 0, decay: 0.4, sustain: 0.88, release: 1.4 },
			filter: { cutoff: 4000, resonance: 2 },
			lfo: { rate: 0.5, depth: 280, enabled: true }
		}
	},
	'chamber pad': {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: -5, enabled: true },
			osc2: { type: 'sawtooth', level: -4, octave: -1, semi: 7, fine: 5, enabled: true },
			env: { attack: 1.2, hold: 0, decay: 0.5, sustain: 0.88, release: 2.0 },
			filter: { cutoff: 2800, resonance: 1.8 },
			lfo: { rate: 0.32, depth: 260, enabled: true }
		}
	},
	'lush strings': {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -2, octave: 0, semi: 0, fine: -18, enabled: true },
			osc2: { type: 'sawtooth', level: -2, octave: 0, semi: 0, fine: 18, enabled: true },
			env: { attack: 1.4, hold: 0, decay: 0.5, sustain: 0.92, release: 2.2 },
			filter: { cutoff: 3000, resonance: 1.5 },
			lfo: { rate: 0.4, depth: 320, enabled: true }
		}
	},
	'pad strings 2': {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: -11, enabled: true },
			osc2: { type: 'triangle', level: -4, octave: 1, semi: 0, fine: 11, enabled: true },
			env: { attack: 1.0, hold: 0, decay: 0.4, sustain: 0.88, release: 1.8 },
			filter: { cutoff: 3500, resonance: 2 },
			lfo: { rate: 0.35, depth: 300, enabled: true }
		}
	},

	/* ===== BASS + LEAD ===== */

	'bass lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: -6, enabled: true },
			osc2: { type: 'square', level: -5, octave: 0, semi: 0, fine: 6, enabled: true },
			env: { attack: 0.005, hold: 0, decay: 0.3, sustain: 0.8, release: 0.35 },
			filter: { cutoff: 2500, resonance: 7 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},
	'low lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -8, octave: 0, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.008, hold: 0, decay: 0.35, sustain: 0.82, release: 0.4 },
			filter: { cutoff: 3000, resonance: 6 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -8, octave: -1, enabled: true, type: 'sine' }
		}
	},
	'melodic bass': {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: -5, enabled: true },
			osc2: { type: 'sine', level: -8, octave: 0, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.006, hold: 0, decay: 0.45, sustain: 0.7, release: 0.4 },
			filter: { cutoff: 2000, resonance: 5 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -6, octave: -1, enabled: true, type: 'sine' }
		}
	},
	'funky lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'square', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -8, octave: 0, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.001, hold: 0.01, decay: 0.25, sustain: 0.4, release: 0.2 },
			filter: { cutoff: 2200, resonance: 10 },
			lfo: { rate: 2, depth: 1800, enabled: true }
		}
	},
	'growling lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 15, enabled: true },
			osc2: { type: 'square', level: -4, octave: -1, semi: 0, fine: -15, enabled: true },
			env: { attack: 0.008, hold: 0, decay: 0.3, sustain: 0.75, release: 0.35 },
			filter: { cutoff: 1800, resonance: 12 },
			lfo: { rate: 0.5, depth: 2000, enabled: true }
		}
	},
	'dark lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: -10, enabled: true },
			osc2: { type: 'sawtooth', level: -5, octave: -1, semi: 0, fine: 10, enabled: true },
			env: { attack: 0.01, hold: 0, decay: 0.35, sustain: 0.8, release: 0.4 },
			filter: { cutoff: 1500, resonance: 8 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},
	'bass solo': {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: -4, enabled: true },
			osc2: { type: 'sawtooth', level: -4, octave: 0, semi: 0, fine: 4, enabled: true },
			env: { attack: 0.01, hold: 0, decay: 0.4, sustain: 0.85, release: 0.45 },
			filter: { cutoff: 2800, resonance: 6 },
			lfo: { rate: 5, depth: 200, enabled: true },
			sub: { level: -8, octave: -1, enabled: true, type: 'sine' }
		}
	},
	'sub lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'sine', level: 0, octave: -1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -8, octave: 0, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.005, hold: 0, decay: 0.3, sustain: 0.85, release: 0.35 },
			filter: { cutoff: 3000, resonance: 8 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -4, octave: -1, enabled: true, type: 'sine' }
		}
	},
	'lead bass 2': {
		category: 'bass',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: -1, semi: 0, fine: -8, enabled: true },
			osc2: { type: 'square', level: -5, octave: 0, semi: 0, fine: 8, enabled: true },
			env: { attack: 0.005, hold: 0, decay: 0.5, sustain: 0.7, release: 0.4 },
			filter: { cutoff: 2200, resonance: 7 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -7, octave: -1, enabled: true, type: 'sine' }
		}
	},
	'bass melody': {
		category: 'bass',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: -1, semi: 0, fine: -6, enabled: true },
			osc2: { type: 'sine', level: -6, octave: 0, semi: 0, fine: 6, enabled: true },
			env: { attack: 0.008, hold: 0, decay: 0.5, sustain: 0.6, release: 0.45 },
			filter: { cutoff: 2500, resonance: 4 },
			lfo: { rate: 4.5, depth: 150, enabled: true },
			sub: { level: -6, octave: -1, enabled: true, type: 'triangle' }
		}
	},

	/* ===== WORLD + PAD ===== */

	'ethnic pad': {
		category: 'world',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: -7, enabled: true },
			osc2: { type: 'triangle', level: -4, octave: 0, semi: 7, fine: 7, enabled: true },
			env: { attack: 0.8, hold: 0, decay: 0.4, sustain: 0.85, release: 1.5 },
			filter: { cutoff: 2000, resonance: 3 },
			lfo: { rate: 0.35, depth: 400, enabled: true }
		}
	},
	'eastern pad': {
		category: 'world',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: -12, enabled: true },
			osc2: { type: 'sawtooth', level: -4, octave: 0, semi: 5, fine: 12, enabled: true },
			env: { attack: 1.0, hold: 0, decay: 0.4, sustain: 0.88, release: 1.8 },
			filter: { cutoff: 1800, resonance: 4 },
			lfo: { rate: 0.3, depth: 500, enabled: true }
		}
	},
	'koto pad': {
		category: 'world',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -6, enabled: true },
			osc2: { type: 'triangle', level: -6, octave: 0, semi: 0, fine: 6, enabled: true },
			env: { attack: 0.3, hold: 0, decay: 0.7, sustain: 0.35, release: 0.8 },
			filter: { cutoff: 2500, resonance: 5 },
			lfo: { rate: 0.4, depth: 300, enabled: true }
		}
	},
	'desert pad': {
		category: 'atmo',
		patch: {
			osc1: { type: 'triangle', level: -3, octave: 0, semi: 0, fine: -15, enabled: true },
			osc2: { type: 'sine', level: -5, octave: 1, semi: 0, fine: 15, enabled: true },
			env: { attack: 1.5, hold: 0, decay: 0.6, sustain: 0.8, release: 2.5 },
			filter: { cutoff: 2500, resonance: 4 },
			lfo: { rate: 0.08, depth: 1500, enabled: true }
		}
	},
	'forest pad': {
		category: 'atmo',
		patch: {
			osc1: { type: 'triangle', level: -3, octave: 1, semi: 0, fine: -10, enabled: true },
			osc2: { type: 'sine', level: -5, octave: 1, semi: 4, fine: 10, enabled: true },
			env: { attack: 1.2, hold: 0, decay: 0.5, sustain: 0.82, release: 2.0 },
			filter: { cutoff: 3500, resonance: 2 },
			lfo: { rate: 0.12, depth: 900, enabled: true }
		}
	},
	'sitar pad': {
		category: 'world',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -8, enabled: true },
			osc2: { type: 'sawtooth', level: -6, octave: 1, semi: 0, fine: 8, enabled: true },
			env: { attack: 0.4, hold: 0, decay: 0.5, sustain: 0.55, release: 0.8 },
			filter: { cutoff: 2800, resonance: 7 },
			lfo: { rate: 0.3, depth: 400, enabled: true }
		}
	},
	'tribal pad': {
		category: 'world',
		patch: {
			osc1: { type: 'square', level: -3, octave: -1, semi: 0, fine: -10, enabled: true },
			osc2: { type: 'triangle', level: -5, octave: -1, semi: 5, fine: 10, enabled: true },
			env: { attack: 0.9, hold: 0, decay: 0.5, sustain: 0.8, release: 1.6 },
			filter: { cutoff: 1200, resonance: 5 },
			lfo: { rate: 0.25, depth: 600, enabled: true }
		}
	},
	'gamelan pad': {
		category: 'world',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 1, semi: 0, fine: -6, enabled: true },
			osc2: { type: 'sine', level: -4, octave: 1, semi: 2, fine: 6, enabled: true },
			env: { attack: 0.5, hold: 0, decay: 1.2, sustain: 0.3, release: 1.5 },
			filter: { cutoff: 5000, resonance: 2 },
			lfo: { rate: 0.2, depth: 350, enabled: true }
		}
	},
	'bamboo pad': {
		category: 'world',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 1, semi: 0, fine: -5, enabled: true },
			osc2: { type: 'sine', level: -8, octave: 2, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.6, hold: 0, decay: 0.5, sustain: 0.6, release: 1.0 },
			filter: { cutoff: 4000, resonance: 3 },
			lfo: { rate: 0.28, depth: 350, enabled: true }
		}
	},
	'world atmo': {
		category: 'atmo',
		patch: {
			osc1: { type: 'sawtooth', level: -4, octave: 0, semi: 0, fine: -18, enabled: true },
			osc2: { type: 'triangle', level: -5, octave: 0, semi: 5, fine: 18, enabled: true },
			env: { attack: 1.8, hold: 0, decay: 0.7, sustain: 0.78, release: 3.0 },
			filter: { cutoff: 1600, resonance: 5 },
			lfo: { rate: 0.07, depth: 1800, enabled: true }
		}
	},

	/* ===== KEYS + LEAD ===== */

	'piano lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: -5, enabled: true },
			osc2: { type: 'sine', level: -8, octave: 1, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.002, hold: 0, decay: 0.6, sustain: 0.5, release: 0.5 },
			filter: { cutoff: 5000, resonance: 3 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},
	'ep lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: -7, enabled: true },
			osc2: { type: 'sine', level: -6, octave: 1, semi: 0, fine: 7, enabled: true },
			env: { attack: 0.003, hold: 0, decay: 0.55, sustain: 0.4, release: 0.5 },
			filter: { cutoff: 3500, resonance: 4 },
			lfo: { rate: 5, depth: 180, enabled: true }
		}
	},
	'clav lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'triangle', level: -10, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.25, sustain: 0.3, release: 0.2 },
			filter: { cutoff: 4000, resonance: 7 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},
	'tine lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 0, semi: 0, fine: -4, enabled: true },
			osc2: { type: 'triangle', level: -8, octave: 1, semi: 0, fine: 4, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.6, sustain: 0.3, release: 0.5 },
			filter: { cutoff: 3500, resonance: 5 },
			lfo: { rate: 5.2, depth: 200, enabled: true }
		}
	},
	'key lead': {
		category: 'keys',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: -6, enabled: true },
			osc2: { type: 'sawtooth', level: -8, octave: 0, semi: 0, fine: 6, enabled: true },
			env: { attack: 0.002, hold: 0, decay: 0.5, sustain: 0.45, release: 0.45 },
			filter: { cutoff: 4500, resonance: 3 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},
	'synth key lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'square', level: -2, octave: 0, semi: 0, fine: -10, enabled: true },
			osc2: { type: 'triangle', level: -5, octave: 0, semi: 0, fine: 10, enabled: true },
			env: { attack: 0.003, hold: 0, decay: 0.45, sustain: 0.55, release: 0.4 },
			filter: { cutoff: 4000, resonance: 5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},
	'bright key lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 1, semi: 0, fine: -8, enabled: true },
			osc2: { type: 'sine', level: -8, octave: 2, semi: 0, fine: 8, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.5, sustain: 0.4, release: 0.5 },
			filter: { cutoff: 7000, resonance: 2 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},
	'keys solo': {
		category: 'lead',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: -3, enabled: true },
			osc2: { type: 'sawtooth', level: -10, octave: 1, semi: 0, fine: 3, enabled: true },
			env: { attack: 0.003, hold: 0, decay: 0.55, sustain: 0.5, release: 0.5 },
			filter: { cutoff: 5500, resonance: 2 },
			lfo: { rate: 5, depth: 150, enabled: true }
		}
	},
	'electric lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: -12, enabled: true },
			osc2: { type: 'sine', level: -8, octave: 1, semi: 0, fine: 12, enabled: true },
			env: { attack: 0.004, hold: 0, decay: 0.4, sustain: 0.65, release: 0.4 },
			filter: { cutoff: 4500, resonance: 6 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},
	'organ lead 3': {
		category: 'lead',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -4, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.005, hold: 0, decay: 0.05, sustain: 1.0, release: 0.05 },
			filter: { cutoff: 5500, resonance: 1 },
			lfo: { rate: 7, depth: 300, enabled: true }
		}
	},

	/* ===== FX + PAD ===== */

	'fx pad': {
		category: 'fx',
		patch: {
			osc1: { type: 'square', level: -3, octave: 0, semi: 0, fine: -25, enabled: true },
			osc2: { type: 'sawtooth', level: -4, octave: 0, semi: 0, fine: 25, enabled: true },
			env: { attack: 0.8, hold: 0, decay: 0.6, sustain: 0.75, release: 1.8 },
			filter: { cutoff: 2500, resonance: 10 },
			lfo: { rate: 0.25, depth: 2500, enabled: true }
		}
	},
	'effect swell': {
		category: 'fx',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: -30, enabled: true },
			osc2: { type: 'square', level: -4, octave: 1, semi: 0, fine: 30, enabled: true },
			env: { attack: 1.2, hold: 0, decay: 0.6, sustain: 0.72, release: 2.2 },
			filter: { cutoff: 3000, resonance: 8 },
			lfo: { rate: 0.18, depth: 3000, enabled: true }
		}
	},
	'glitch pad': {
		category: 'fx',
		patch: {
			osc1: { type: 'square', level: -2, octave: 0, semi: 3, fine: 40, enabled: true },
			osc2: { type: 'sawtooth', level: -4, octave: 0, semi: -3, fine: -40, enabled: true },
			env: { attack: 0.4, hold: 0, decay: 0.5, sustain: 0.7, release: 1.2 },
			filter: { cutoff: 3500, resonance: 14 },
			lfo: { rate: 6, depth: 3500, enabled: true }
		}
	},
	'swept pad': {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: -15, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: 15, enabled: true },
			env: { attack: 1.0, hold: 0, decay: 0.5, sustain: 0.85, release: 2.0 },
			filter: { cutoff: 500, resonance: 5 },
			lfo: { rate: 0.15, depth: 5000, enabled: true }
		}
	},
	'warped pad': {
		category: 'pad',
		patch: {
			osc1: { type: 'square', level: -3, octave: 0, semi: 0, fine: -22, enabled: true },
			osc2: { type: 'sawtooth', level: -4, octave: 0, semi: 7, fine: 22, enabled: true },
			env: { attack: 1.3, hold: 0, decay: 0.6, sustain: 0.78, release: 2.2 },
			filter: { cutoff: 1200, resonance: 12 },
			lfo: { rate: 0.12, depth: 2800, enabled: true }
		}
	},
	'morphing pad': {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: -20, enabled: true },
			osc2: { type: 'square', level: -4, octave: 0, semi: 0, fine: 20, enabled: true },
			env: { attack: 1.5, hold: 0, decay: 0.6, sustain: 0.82, release: 2.5 },
			filter: { cutoff: 2000, resonance: 9 },
			lfo: { rate: 0.09, depth: 3200, enabled: true }
		}
	},
	'noise swell': {
		category: 'fx',
		patch: {
			osc1: { type: 'square', level: -4, octave: 0, semi: 5, fine: 48, enabled: true },
			osc2: { type: 'square', level: -4, octave: 0, semi: -5, fine: -48, enabled: true },
			env: { attack: 1.8, hold: 0, decay: 0.7, sustain: 0.65, release: 3.0 },
			filter: { cutoff: 1500, resonance: 6 },
			lfo: { rate: 0.08, depth: 4000, enabled: true }
		}
	},
	'zap pad': {
		category: 'fx',
		patch: {
			osc1: { type: 'square', level: -2, octave: 1, semi: 0, fine: 35, enabled: true },
			osc2: { type: 'sawtooth', level: -4, octave: 1, semi: 0, fine: -35, enabled: true },
			env: { attack: 0.5, hold: 0, decay: 0.5, sustain: 0.7, release: 1.5 },
			filter: { cutoff: 4000, resonance: 15 },
			lfo: { rate: 8, depth: 4500, enabled: true }
		}
	},
	'twisted pad': {
		category: 'pad',
		patch: {
			osc1: { type: 'square', level: -4, octave: 0, semi: 1, fine: -38, enabled: true },
			osc2: { type: 'triangle', level: -4, octave: 0, semi: -1, fine: 38, enabled: true },
			env: { attack: 1.0, hold: 0, decay: 0.6, sustain: 0.78, release: 2.0 },
			filter: { cutoff: 2200, resonance: 11 },
			lfo: { rate: 0.13, depth: 2600, enabled: true }
		}
	},
	'modulated pad': {
		category: 'pad',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: -16, enabled: true },
			osc2: { type: 'square', level: -4, octave: 1, semi: 0, fine: 16, enabled: true },
			env: { attack: 1.4, hold: 0, decay: 0.6, sustain: 0.8, release: 2.4 },
			filter: { cutoff: 1800, resonance: 10 },
			lfo: { rate: 0.1, depth: 2900, enabled: true }
		}
	},

	/* ===== VOX + PAD ===== */

	'choir pad': {
		category: 'vox',
		patch: {
			osc1: { type: 'sawtooth', level: -2, octave: 0, semi: 0, fine: -9, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: 9, enabled: true },
			env: { attack: 1.0, hold: 0, decay: 0.4, sustain: 0.9, release: 1.8 },
			filter: { cutoff: 1600, resonance: 2.5 },
			lfo: { rate: 0.35, depth: 280, enabled: true }
		}
	},
	'vocal pad': {
		category: 'vox',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: -7, enabled: true },
			osc2: { type: 'triangle', level: -4, octave: 0, semi: 7, fine: 7, enabled: true },
			env: { attack: 1.2, hold: 0, decay: 0.5, sustain: 0.88, release: 2.0 },
			filter: { cutoff: 1200, resonance: 5 },
			lfo: { rate: 0.4, depth: 350, enabled: true }
		}
	},
	'choral swell': {
		category: 'vox',
		patch: {
			osc1: { type: 'sawtooth', level: -2, octave: 0, semi: 0, fine: -11, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: 11, enabled: true },
			env: { attack: 1.5, hold: 0, decay: 0.5, sustain: 0.9, release: 2.2 },
			filter: { cutoff: 1800, resonance: 3 },
			lfo: { rate: 0.3, depth: 300, enabled: true }
		}
	},
	'whisper pad': {
		category: 'vox',
		patch: {
			osc1: { type: 'triangle', level: -4, octave: 0, semi: 0, fine: -18, enabled: true },
			osc2: { type: 'triangle', level: -4, octave: 0, semi: 0, fine: 18, enabled: true },
			env: { attack: 1.0, hold: 0, decay: 0.5, sustain: 0.75, release: 2.0 },
			filter: { cutoff: 3500, resonance: 2 },
			lfo: { rate: 0.3, depth: 200, enabled: true }
		}
	},
	'sung pad': {
		category: 'vox',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: -5, enabled: true },
			osc2: { type: 'sine', level: -5, octave: 1, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.9, hold: 0, decay: 0.4, sustain: 0.88, release: 1.6 },
			filter: { cutoff: 1400, resonance: 4 },
			lfo: { rate: 0.45, depth: 250, enabled: true }
		}
	},
	'ahh pad': {
		category: 'vox',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: -8, enabled: true },
			osc2: { type: 'sawtooth', level: -4, octave: 0, semi: 0, fine: 8, enabled: true },
			env: { attack: 0.8, hold: 0, decay: 0.4, sustain: 0.9, release: 1.4 },
			filter: { cutoff: 900, resonance: 6 },
			lfo: { rate: 0.5, depth: 280, enabled: true }
		}
	},
	'vox cloud': {
		category: 'vox',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: -14, enabled: true },
			osc2: { type: 'triangle', level: -5, octave: 1, semi: 0, fine: 14, enabled: true },
			env: { attack: 1.6, hold: 0, decay: 0.6, sustain: 0.85, release: 2.5 },
			filter: { cutoff: 1400, resonance: 5 },
			lfo: { rate: 0.2, depth: 500, enabled: true }
		}
	},
	'voice pad': {
		category: 'vox',
		patch: {
			osc1: { type: 'sawtooth', level: -2, octave: 0, semi: 0, fine: -10, enabled: true },
			osc2: { type: 'sawtooth', level: -4, octave: 0, semi: 5, fine: 10, enabled: true },
			env: { attack: 1.0, hold: 0, decay: 0.5, sustain: 0.88, release: 1.8 },
			filter: { cutoff: 1600, resonance: 4 },
			lfo: { rate: 0.38, depth: 320, enabled: true }
		}
	},
	'harmonic vox': {
		category: 'vox',
		patch: {
			osc1: { type: 'sawtooth', level: -3, octave: 0, semi: 0, fine: -6, enabled: true },
			osc2: { type: 'sawtooth', level: -3, octave: 1, semi: 0, fine: 6, enabled: true },
			env: { attack: 1.2, hold: 0, decay: 0.5, sustain: 0.9, release: 2.0 },
			filter: { cutoff: 2000, resonance: 3 },
			lfo: { rate: 0.42, depth: 300, enabled: true }
		}
	},
	'breath pad 2': {
		category: 'vox',
		patch: {
			osc1: { type: 'triangle', level: -4, octave: 0, semi: 0, fine: -22, enabled: true },
			osc2: { type: 'sine', level: -5, octave: 1, semi: 0, fine: 22, enabled: true },
			env: { attack: 1.4, hold: 0, decay: 0.6, sustain: 0.78, release: 2.2 },
			filter: { cutoff: 2800, resonance: 3 },
			lfo: { rate: 0.22, depth: 400, enabled: true }
		}
	},

	/* ===== LEAD + PERC ===== */

	'perc lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -5, enabled: true },
			osc2: { type: 'triangle', level: -8, octave: 1, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.001, hold: 0.02, decay: 0.25, sustain: 0.4, release: 0.25 },
			filter: { cutoff: 5000, resonance: 7 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},
	'attack lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -6, octave: 0, semi: 0, fine: 8, enabled: true },
			env: { attack: 0.001, hold: 0.01, decay: 0.2, sustain: 0.6, release: 0.2 },
			filter: { cutoff: 4500, resonance: 9 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},
	'struck lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 1, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -6, octave: 2, semi: 0, fine: 6, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.3, sustain: 0.35, release: 0.3 },
			filter: { cutoff: 5500, resonance: 5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},
	'sharp lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -10, enabled: true },
			osc2: { type: 'square', level: -5, octave: 1, semi: 0, fine: 10, enabled: true },
			env: { attack: 0.001, hold: 0.015, decay: 0.18, sustain: 0.5, release: 0.2 },
			filter: { cutoff: 6500, resonance: 10 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},
	'snap lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'square', level: 0, octave: 1, semi: 0, fine: -8, enabled: true },
			osc2: { type: 'triangle', level: -8, octave: 1, semi: 0, fine: 8, enabled: true },
			env: { attack: 0.001, hold: 0.008, decay: 0.15, sustain: 0.45, release: 0.15 },
			filter: { cutoff: 5500, resonance: 8 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},
	'transient lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sine', level: -8, octave: 1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.12, sustain: 0.65, release: 0.15 },
			filter: { cutoff: 5000, resonance: 6 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},
	'pop lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: -6, enabled: true },
			osc2: { type: 'sine', level: -6, octave: 1, semi: 0, fine: 6, enabled: true },
			env: { attack: 0.001, hold: 0.01, decay: 0.2, sustain: 0.55, release: 0.18 },
			filter: { cutoff: 4000, resonance: 6 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},
	'punch lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'square', level: 0, octave: 0, semi: 0, fine: 0, enabled: true },
			osc2: { type: 'sawtooth', level: -6, octave: -1, semi: 0, fine: 0, enabled: true },
			env: { attack: 0.001, hold: 0.012, decay: 0.22, sustain: 0.55, release: 0.2 },
			filter: { cutoff: 3500, resonance: 8 },
			lfo: { rate: 4, depth: 0, enabled: false },
			sub: { level: -10, octave: -1, enabled: true, type: 'sine' }
		}
	},
	'hit lead': {
		category: 'lead',
		patch: {
			osc1: { type: 'sawtooth', level: 0, octave: 0, semi: 0, fine: -12, enabled: true },
			osc2: { type: 'sawtooth', level: -4, octave: 0, semi: 0, fine: 12, enabled: true },
			env: { attack: 0.001, hold: 0.02, decay: 0.3, sustain: 0, release: 0.2 },
			filter: { cutoff: 5500, resonance: 8 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},
	'pluck lead 3': {
		category: 'lead',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: -4, enabled: true },
			osc2: { type: 'sawtooth', level: -8, octave: 1, semi: 0, fine: 4, enabled: true },
			env: { attack: 0.001, hold: 0, decay: 0.35, sustain: 0.15, release: 0.3 },
			filter: { cutoff: 4000, resonance: 5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},

	/* ===== KEYS + PAD ===== */

	'piano pad': {
		category: 'keys',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: -5, enabled: true },
			osc2: { type: 'sine', level: -6, octave: 1, semi: 0, fine: 5, enabled: true },
			env: { attack: 0.5, hold: 0, decay: 0.6, sustain: 0.6, release: 1.4 },
			filter: { cutoff: 3000, resonance: 1.5 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},
	'ep pad': {
		category: 'keys',
		patch: {
			osc1: { type: 'triangle', level: 0, octave: 0, semi: 0, fine: -7, enabled: true },
			osc2: { type: 'sine', level: -5, octave: 1, semi: 0, fine: 7, enabled: true },
			env: { attack: 0.6, hold: 0, decay: 0.5, sustain: 0.65, release: 1.5 },
			filter: { cutoff: 2500, resonance: 2 },
			lfo: { rate: 4.5, depth: 150, enabled: true }
		}
	},
	'velvet keys': {
		category: 'keys',
		patch: {
			osc1: { type: 'triangle', level: -2, octave: 0, semi: 0, fine: -8, enabled: true },
			osc2: { type: 'triangle', level: -4, octave: 0, semi: 0, fine: 8, enabled: true },
			env: { attack: 0.4, hold: 0, decay: 0.5, sustain: 0.7, release: 1.2 },
			filter: { cutoff: 2000, resonance: 1 },
			lfo: { rate: 0.3, depth: 150, enabled: true }
		}
	},
	'soft piano': {
		category: 'keys',
		patch: {
			osc1: { type: 'triangle', level: -2, octave: 0, semi: 0, fine: -4, enabled: true },
			osc2: { type: 'sine', level: -6, octave: 1, semi: 0, fine: 4, enabled: true },
			env: { attack: 0.003, hold: 0, decay: 0.7, sustain: 0.3, release: 0.8 },
			filter: { cutoff: 2500, resonance: 0.8 },
			lfo: { rate: 4, depth: 0, enabled: false }
		}
	},
	'keys atmo': {
		category: 'keys',
		patch: {
			osc1: { type: 'sine', level: -2, octave: 0, semi: 0, fine: -6, enabled: true },
			osc2: { type: 'triangle', level: -4, octave: 1, semi: 0, fine: 6, enabled: true },
			env: { attack: 0.8, hold: 0, decay: 0.5, sustain: 0.75, release: 1.8 },
			filter: { cutoff: 4000, resonance: 1.5 },
			lfo: { rate: 0.2, depth: 350, enabled: true }
		}
	},
	'dreamy keys': {
		category: 'keys',
		patch: {
			osc1: { type: 'sine', level: 0, octave: 1, semi: 0, fine: -10, enabled: true },
			osc2: { type: 'triangle', level: -5, octave: 1, semi: 0, fine: 10, enabled: true },
			env: { attack: 0.4, hold: 0, decay: 0.7, sustain: 0.5, release: 1.5 },
			filter: { cutoff: 5000, resonance: 1 },
			lfo: { rate: 0.25, depth: 300, enabled: true }
		}
	},
	'hazy keys': {
		category: 'keys',
		patch: {
			osc1: { type: 'triangle', level: -3, octave: 0, semi: 0, fine: -16, enabled: true },
			osc2: { type: 'sine', level: -5, octave: 0, semi: 0, fine: 16, enabled: true },
			env: { attack: 0.6, hold: 0, decay: 0.6, sustain: 0.6, release: 1.4 },
			filter: { cutoff: 1800, resonance: 2 },
			lfo: { rate: 0.28, depth: 250, enabled: true }
		}
	},
	'keys swell': {
		category: 'keys',
		patch: {
			osc1: { type: 'triangle', level: -2, octave: 0, semi: 0, fine: -12, enabled: true },
			osc2: { type: 'triangle', level: -3, octave: 0, semi: 7, fine: 12, enabled: true },
			env: { attack: 1.0, hold: 0, decay: 0.5, sustain: 0.72, release: 2.0 },
			filter: { cutoff: 3000, resonance: 1.5 },
			lfo: { rate: 0.22, depth: 300, enabled: true }
		}
	},
	'pad piano': {
		category: 'pad',
		patch: {
			osc1: { type: 'triangle', level: -2, octave: 0, semi: 0, fine: -8, enabled: true },
			osc2: { type: 'sawtooth', level: -5, octave: 0, semi: 7, fine: 8, enabled: true },
			env: { attack: 0.7, hold: 0, decay: 0.5, sustain: 0.68, release: 1.5 },
			filter: { cutoff: 3500, resonance: 2 },
			lfo: { rate: 0.18, depth: 400, enabled: true }
		}
	},
	'keys pad 2': {
		category: 'keys',
		patch: {
			osc1: { type: 'triangle', level: -3, octave: 0, semi: 0, fine: -10, enabled: true },
			osc2: { type: 'sine', level: -4, octave: 0, semi: 4, fine: 10, enabled: true },
			env: { attack: 0.8, hold: 0, decay: 0.5, sustain: 0.7, release: 1.6 },
			filter: { cutoff: 2800, resonance: 1.5 },
			lfo: { rate: 0.2, depth: 280, enabled: true }
		}
	}
};

export const presetNames = Object.keys(presets);
