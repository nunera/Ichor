<script lang="ts">
	/**
	 * Dangling cable from a fixed anchor to a moving cursor, simulated as a
	 * verlet rope with gravity + damping. Renders as a smooth Catmull-Rom
	 * curve in a fixed-position SVG overlaying the whole viewport.
	 *
	 * Lives in CursorLayer (or page root); only rendered while a drag is in
	 * progress. The component drives its own rAF; on unmount the loop stops.
	 */

	type Props = {
		anchor: { x: number; y: number };
		cursor: { x: number; y: number };
		/** Highlight color when over a valid target. */
		hot?: boolean;
	};

	let { anchor, cursor, hot = false }: Props = $props();

	const SEGMENTS = 10;
	const GRAVITY = 0.6;
	const DAMP = 0.92;
	const ITER = 6;

	type Pt = { x: number; y: number; px: number; py: number };

	let points = $state<Pt[]>(initPoints(anchor, cursor));
	let raf: number | null = null;

	function initPoints(a: { x: number; y: number }, c: { x: number; y: number }): Pt[] {
		const out: Pt[] = [];
		for (let i = 0; i <= SEGMENTS; i++) {
			const t = i / SEGMENTS;
			const x = a.x + (c.x - a.x) * t;
			const y = a.y + (c.y - a.y) * t;
			out.push({ x, y, px: x, py: y });
		}
		return out;
	}

	function step() {
		const segLen = Math.hypot(cursor.x - anchor.x, cursor.y - anchor.y) / SEGMENTS;
		const next = points.map((p, i) => {
			if (i === 0 || i === points.length - 1) return p;
			const vx = (p.x - p.px) * DAMP;
			const vy = (p.y - p.py) * DAMP;
			const nx = p.x + vx;
			const ny = p.y + vy + GRAVITY;
			return { x: nx, y: ny, px: p.x, py: p.y };
		});
		// Pin endpoints
		next[0] = { ...next[0], x: anchor.x, y: anchor.y, px: anchor.x, py: anchor.y };
		const last = next.length - 1;
		next[last] = { ...next[last], x: cursor.x, y: cursor.y, px: cursor.x, py: cursor.y };

		// Constraint relaxation: keep neighbouring points segLen apart.
		for (let it = 0; it < ITER; it++) {
			for (let i = 0; i < next.length - 1; i++) {
				const a = next[i];
				const b = next[i + 1];
				const dx = b.x - a.x;
				const dy = b.y - a.y;
				const dist = Math.hypot(dx, dy) || 0.0001;
				const diff = (dist - segLen) / dist;
				const halfX = dx * 0.5 * diff;
				const halfY = dy * 0.5 * diff;
				if (i !== 0) {
					a.x += halfX;
					a.y += halfY;
				}
				if (i + 1 !== next.length - 1) {
					b.x -= halfX;
					b.y -= halfY;
				}
			}
		}
		points = next;
	}

	function loop() {
		step();
		raf = requestAnimationFrame(loop);
	}

	$effect(() => {
		raf = requestAnimationFrame(loop);
		return () => {
			if (raf !== null) cancelAnimationFrame(raf);
		};
	});

	const path = $derived.by(() => {
		if (points.length < 2) return '';
		let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
		for (let i = 1; i < points.length; i++) {
			d += ` L ${points[i].x.toFixed(1)} ${points[i].y.toFixed(1)}`;
		}
		return d;
	});
</script>

<svg class="pointer-events-none fixed inset-0 z-50 h-full w-full">
	<path
		d={path}
		fill="none"
		stroke="currentColor"
		stroke-width={hot ? 3 : 2.5}
		stroke-linecap="round"
		class="transition-colors"
		class:text-yellow={hot}
		class:text-mauve={!hot}
		opacity={hot ? 1 : 0.85}
	/>
	<!-- anchor pin -->
	<circle cx={anchor.x} cy={anchor.y} r="4" class="fill-mauve" />
	<!-- cursor head -->
	<circle
		cx={cursor.x}
		cy={cursor.y}
		r={hot ? 7 : 5}
		class="transition-all"
		class:fill-yellow={hot}
		class:fill-mauve={!hot}
	/>
</svg>
