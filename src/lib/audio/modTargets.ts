/**
 * Mod-matrix target registry.
 *
 * Every continuous knob in the UI registers itself here as a "modulatable
 * target" so the LFO scheduler can write modulated values directly to the
 * audio graph without round-tripping through the patch state.
 *
 * The patch state remains the user's *base* value (what they see in the
 * editor / what sliders represent). Live audio = base + offset + lfo*amount,
 * clamped per-target. Knob UIs can subscribe to read the live "effective"
 * value for visualization (the moving dot on the arc ring).
 *
 * Targets are addressed by stable string ids of the form 'section.param',
 * e.g. 'filter.cutoff'. The id is what gets stored in patch.lfo*.routes,
 * so renaming a target id is a breaking change to existing patches.
 */

export type ModTarget = {
	id: string;
	/** Human-friendly label for the LFO routing UI ("cutoff"). */
	label: string;
	/** Group/section name for the routing UI ("filter"). */
	group: string;
	/** Parameter min/max in its own units. Used to clamp + size the ring arc. */
	min: number;
	max: number;
	/**
	 * Knob curve exponent (matches Knob.svelte's `curve`). Modulation happens
	 * in *knob space* so it feels consistent across the knob travel.
	 */
	curve?: number;
	/** Read the user's base value (un-modulated, from patch state). */
	getBase(): number;
	/** Apply a fully-resolved (already clamped) value to the audio graph. */
	apply(value: number): void;
};

class ModTargetRegistry {
	#targets = new Map<string, ModTarget>();

	register(t: ModTarget): () => void {
		this.#targets.set(t.id, t);
		return () => this.#targets.delete(t.id);
	}

	get(id: string): ModTarget | undefined {
		return this.#targets.get(id);
	}

	all(): ModTarget[] {
		return [...this.#targets.values()];
	}

	clamp(id: string, value: number): number {
		const t = this.#targets.get(id);
		if (!t) return value;
		return Math.max(t.min, Math.min(t.max, value));
	}
}

export const modTargets = new ModTargetRegistry();

/**
 * Per-target live "effective" value (base + offset + lfo*amount, clamped).
 * Updated each frame by the engine's modulation tick. Knob components read
 * this to draw the moving indicator on top of the static arc ring.
 */
class LiveModValues {
	#values = new Map<string, number>();
	#listeners = new Map<string, Set<(v: number) => void>>();

	set(id: string, v: number) {
		this.#values.set(id, v);
		const ls = this.#listeners.get(id);
		if (ls) for (const fn of ls) fn(v);
	}

	get(id: string): number | undefined {
		return this.#values.get(id);
	}

	subscribe(id: string, fn: (v: number) => void): () => void {
		let ls = this.#listeners.get(id);
		if (!ls) {
			ls = new Set();
			this.#listeners.set(id, ls);
		}
		ls.add(fn);
		return () => ls.delete(fn);
	}
}

export const liveMod = new LiveModValues();
