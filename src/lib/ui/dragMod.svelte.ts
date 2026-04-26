/**
 * Global state for "I'm dragging an LFO source onto a target."
 *
 * - LFOCard sets `source` on pointerdown over its title and tracks cursor
 *   position via window listeners while `source` is set.
 * - Knob components register/unregister their bounding rects in `targets`
 *   and watch `hoveredTarget` to highlight when the cursor is over them.
 * - On pointerup, LFOCard reads `hoveredTarget`, calls into the engine to
 *   add a route, then clears `source`.
 */

type Source = { lfo: 'lfo1' | 'lfo2'; anchor: { x: number; y: number } };

class DragMod {
	source = $state<Source | null>(null);
	cursor = $state<{ x: number; y: number }>({ x: 0, y: 0 });
	hoveredTarget = $state<string | null>(null);

	#rects = new Map<string, () => DOMRect | null>();

	registerTarget(id: string, getRect: () => DOMRect | null): () => void {
		this.#rects.set(id, getRect);
		return () => this.#rects.delete(id);
	}

	/** Recompute hoveredTarget based on the current cursor position. */
	updateHover() {
		if (!this.source) {
			this.hoveredTarget = null;
			return;
		}
		const { x, y } = this.cursor;
		let hit: string | null = null;
		for (const [id, getRect] of this.#rects) {
			const r = getRect();
			if (!r) continue;
			if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
				hit = id;
				break;
			}
		}
		this.hoveredTarget = hit;
	}

	begin(lfo: 'lfo1' | 'lfo2', anchor: { x: number; y: number }, cursor: { x: number; y: number }) {
		this.source = { lfo, anchor };
		this.cursor = cursor;
		this.hoveredTarget = null;
	}

	move(cursor: { x: number; y: number }) {
		this.cursor = cursor;
		this.updateHover();
	}

	end(): { lfo: 'lfo1' | 'lfo2'; target: string } | null {
		const result =
			this.source && this.hoveredTarget
				? { lfo: this.source.lfo, target: this.hoveredTarget }
				: null;
		this.source = null;
		this.hoveredTarget = null;
		return result;
	}
}

export const dragMod = new DragMod();
