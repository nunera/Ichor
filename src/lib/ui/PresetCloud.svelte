<script lang="ts">
	import { audio } from '$lib/audio/engine.svelte';
	import { presets, presetNames, categoryColor, type Category } from '$lib/audio/presets';
	import { onMount } from 'svelte';

	type Node = {
		name: string;
		category: Category;
		x: number;
		y: number;
		vx: number;
		vy: number;
		r: number;
		tx: number;
		ty: number;
	};

	type Props = { active: boolean };
	let { active }: Props = $props();

	let container: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let nodes: Node[] = [];
	let edges: [number, number][] = [];
	let hover = $state<number | null>(null);
	let focused = $state<number | null>(null);
	let dragging: number | null = null;
	let dragOffset = { x: 0, y: 0 };
	let bounds = { w: 600, h: 400 };
	let raf = 0;
	let previewTimer = 0;
	// Snapshot of the patch when hover-preview begins, so leaving without a
	// click restores the user's working patch.
	let previewSnapshot: unknown = null;

	function preview(name: string) {
		if (!audio.started) return;
		if (previewSnapshot === null) {
			// Deep-clone the current patch so subsequent loadPatch calls don't
			// mutate it.
			previewSnapshot = structuredClone($state.snapshot(audio.patch));
		}
		clearTimeout(previewTimer);
		audio.releaseAll();
		// 'preview' source isn't broadcast over the websocket, so hovering presets
		// in a multiplayer session doesn't spam co-listeners with patch changes.
		audio.loadPatch(presets[name].patch, 'preview');
		audio.attack('A3');
		previewTimer = window.setTimeout(() => audio.release('A3'), 700);
	}

	function restoreSnapshot() {
		if (previewSnapshot !== null && audio.started) {
			audio.loadPatch(previewSnapshot, 'preview');
		}
		previewSnapshot = null;
	}

	function commitPreview() {
		// User selected — snapshot is no longer needed.
		previewSnapshot = null;
	}

	function draw() {
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.clearRect(0, 0, bounds.w, bounds.h);

		// Category lines — always visible, highlight on hover.
		const hoverCat = hover !== null ? nodes[hover]?.category : null;
		ctx.lineWidth = 1.5;
		for (const [i, j] of edges) {
			const cat = nodes[i].category;
			const lit = hoverCat === cat;
			ctx.globalAlpha = lit ? 0.75 : 0.22;
			ctx.strokeStyle = categoryColor[cat];
			ctx.beginPath();
			ctx.moveTo(nodes[i].x, nodes[i].y);
			ctx.lineTo(nodes[j].x, nodes[j].y);
			ctx.stroke();
		}
		ctx.globalAlpha = 1;

		// Dots
		const pivot = hover ?? focused;
		for (let i = 0; i < nodes.length; i++) {
			const n = nodes[i];
			const isHov = hover === i;
			const isFoc = focused === i;
			const related = pivot === null || pivot === i || nodes[pivot]?.category === n.category;
			const r = isHov || isFoc ? n.r * 1.2 : n.r;

			if (isHov) {
				ctx.globalAlpha = 0.35;
				ctx.fillStyle = categoryColor[n.category];
				ctx.beginPath();
				ctx.arc(n.x, n.y, r + 6, 0, Math.PI * 2);
				ctx.fill();
			}

			ctx.globalAlpha = related ? 1 : 0.2;
			ctx.fillStyle = categoryColor[n.category];
			ctx.beginPath();
			ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
			ctx.fill();

			if (isFoc) {
				ctx.globalAlpha = 1;
				ctx.strokeStyle = '#ffffff';
				ctx.lineWidth = 1.5;
				ctx.beginPath();
				ctx.arc(n.x, n.y, r + 3, 0, Math.PI * 2);
				ctx.stroke();
			}
		}

		ctx.globalAlpha = 1;
	}

	function init() {
		const rect = container.getBoundingClientRect();
		bounds = { w: rect.width, h: rect.height };
		canvas.width = bounds.w;
		canvas.height = bounds.h;

		const cx = bounds.w / 2;
		const cy = bounds.h / 2;
		const N = presetNames.length;
		const R_outer = Math.min(bounds.w, bounds.h) * 0.44;
		const R_inner = R_outer * 0.42;
		const SIDES = 7;

		// Build the 14-vertex star polygon.
		const starVerts: [number, number][] = [];
		for (let k = 0; k < SIDES; k++) {
			const outerA = -Math.PI / 2 + (2 * Math.PI * k) / SIDES;
			const innerA = outerA + Math.PI / SIDES;
			starVerts.push([cx + Math.cos(outerA) * R_outer, cy + Math.sin(outerA) * R_outer]);
			starVerts.push([cx + Math.cos(innerA) * R_inner, cy + Math.sin(innerA) * R_inner]);
		}
		starVerts.push(starVerts[0]);

		// Ray-cast point-in-polygon for the star shape.
		function inStar(px: number, py: number): boolean {
			let inside = false;
			const n = starVerts.length - 1;
			for (let i = 0, j = n - 1; i < n; j = i++) {
				const xi = starVerts[i][0],
					yi = starVerts[i][1];
				const xj = starVerts[j][0],
					yj = starVerts[j][1];
				if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
			}
			return inside;
		}

		// Jittered grid — keep only points inside the star.
		// IMPORTANT: spacing must adapt to available area. When the panel is
		// small (common at high zoom), a fixed spacing can produce fewer
		// candidates than presets, causing many nodes to share targets which
		// makes the physics explode.
		const approxStarArea = Math.PI * R_outer * R_outer * 0.6;
		const spacing = Math.max(4, Math.min(16, Math.sqrt(approxStarArea / (N * 1.35))));
		const jitter = spacing * 0.5;
		const candidates: [number, number][] = [];
		for (let gy = cy - R_outer; gy <= cy + R_outer; gy += spacing) {
			for (let gx = cx - R_outer; gx <= cx + R_outer; gx += spacing) {
				const px = gx + (Math.random() - 0.5) * jitter;
				const py = gy + (Math.random() - 0.5) * jitter;
				if (inStar(px, py)) candidates.push([px, py]);
			}
		}

		// If the panel is tiny we may still not have enough points. Top up via
		// rejection-sampling inside the star so every preset can get a distinct
		// target.
		while (candidates.length < N) {
			const px = cx + (Math.random() * 2 - 1) * R_outer;
			const py = cy + (Math.random() * 2 - 1) * R_outer;
			if (inStar(px, py)) candidates.push([px, py]);
		}

		// Sort by angle so same-category dots cluster in the same wedge of the star.
		candidates.sort((a, b) => Math.atan2(a[1] - cy, a[0] - cx) - Math.atan2(b[1] - cy, b[0] - cx));

		// Pick N evenly from the candidates.
		const step = candidates.length / N;
		const targets = Array.from(
			{ length: N },
			(_, i) => candidates[Math.min(Math.floor(i * step), candidates.length - 1)] ?? [cx, cy]
		);

		// Sort presets by category to match angular order.
		const sorted = [...presetNames].sort((a, b) =>
			presets[a].category.localeCompare(presets[b].category)
		);

		// Keep the sim scale proportional to panel size.
		// Key idea: these are in *CSS px*, so when the panel becomes smaller
		// (e.g. zoomed in), we shrink radii too to avoid over-constraining.
		nodeR = Math.max(3, Math.min(6, Math.round(Math.min(bounds.w, bounds.h) / 180)));
		REPEL_R = nodeR * 3.5;
		CELL = Math.max(24, Math.ceil(REPEL_R * 1.6));

		nodes = sorted.map((name, i) => {
			const [tx, ty] = targets[i];
			const x = cx + (Math.random() - 0.5) * R_outer * 0.4;
			const y = cy + (Math.random() - 0.5) * R_outer * 0.4;
			return { name, category: presets[name].category, x, y, vx: 0, vy: 0, r: nodeR, tx, ty };
		});

		edges = [];
		for (let i = 0; i < nodes.length - 1; i++) {
			if (nodes[i].category === nodes[i + 1].category) edges.push([i, i + 1]);
		}

		draw();
	}

	// --- Spatial hash for O(N) neighbor lookups (vs naive O(N²)) -----------
	// At 300+ nodes the all-pairs check becomes the frame bottleneck. By
	// bucketing nodes into a coarse grid and only repelling against cells
	// in our 3×3 neighborhood, we keep physics smooth at hundreds of nodes.
	let CELL = 24; // px; ~ 2× node radius — bigger = fewer buckets but more pairs per bucket
	let REPEL_R = 14; // px — repulsion radius (must be < CELL)
	let nodeR = 4;
	const grid = new Map<number, number[]>();
	function cellKey(x: number, y: number): number {
		return ((Math.floor(x / CELL) | 0) << 16) ^ (Math.floor(y / CELL) | 0);
	}
	function gridKey(cx: number, cy: number): number {
		return ((cx | 0) << 16) ^ (cy | 0);
	}
	function rebuildGrid() {
		grid.clear();
		for (let i = 0; i < nodes.length; i++) {
			const k = cellKey(nodes[i].x, nodes[i].y);
			let bucket = grid.get(k);
			if (!bucket) {
				bucket = [];
				grid.set(k, bucket);
			}
			bucket.push(i);
		}
	}

	function tick(): number {
		// Pure position relaxation: looks less "floaty/fake" than velocity springs
		// and converges cleanly without orbital rotation.
		const TARGET_PULL = 0.14; // ease-to-target per frame (0..1)
		const REPEL_POS = 0.6; // positional separation (0..1)
		const ITERS = 2;
		const REPEL_R2 = REPEL_R * REPEL_R;
		let maxMove = 0;

		// 1. Ease back to assigned star slot
		for (let i = 0; i < nodes.length; i++) {
			if (i === dragging) continue;
			const n = nodes[i];
			const dx = n.tx - n.x;
			const dy = n.ty - n.y;
			const mx = dx * TARGET_PULL;
			const my = dy * TARGET_PULL;
			n.x += mx;
			n.y += my;
			maxMove = Math.max(maxMove, Math.abs(mx), Math.abs(my));
		}

		// 2. Overlap relaxation iterations
		for (let iter = 0; iter < ITERS; iter++) {
			rebuildGrid();
			for (let i = 0; i < nodes.length; i++) {
				const a = nodes[i];
				const cx = Math.floor(a.x / CELL) | 0;
				const cy = Math.floor(a.y / CELL) | 0;
				for (let oy = -1; oy <= 1; oy++) {
					for (let ox = -1; ox <= 1; ox++) {
						const bucket = grid.get(gridKey(cx + ox, cy + oy));
						if (!bucket) continue;
						for (const j of bucket) {
							if (j <= i) continue;
							const b = nodes[j];
							const dx = a.x - b.x;
							const dy = a.y - b.y;
							const d2 = dx * dx + dy * dy;
							if (d2 >= REPEL_R2 || d2 === 0) continue;
							const d = Math.sqrt(d2);
							const overlap = REPEL_R - d;
							const nx = dx / d;
							const ny = dy / d;
							const push = overlap * REPEL_POS;
							maxMove = Math.max(maxMove, push);
							if (i === dragging) {
								b.x -= nx * push;
								b.y -= ny * push;
							} else if (j === dragging) {
								a.x += nx * push;
								a.y += ny * push;
							} else {
								const half = push * 0.5;
								a.x += nx * half;
								a.y += ny * half;
								b.x -= nx * half;
								b.y -= ny * half;
							}
						}
					}
				}
			}
		}

		// Keep velocities from accumulating (drag sets them to 0 anyway).
		for (const n of nodes) {
			n.vx = 0;
			n.vy = 0;
		}

		return maxMove;
	}

	function step() {
		raf = requestAnimationFrame(step);
		if (!active) return;
		const moved = tick();
		draw();
		if (dragging === null && moved < 0.05) {
			cancelAnimationFrame(raf);
			raf = 0;
		}
	}

	function load(name: string) {
		audio.loadPatch(presets[name].patch, 'editor');
		commitPreview();
	}

	function getPos(e: PointerEvent) {
		const r = canvas.getBoundingClientRect();
		return { x: e.clientX - r.left, y: e.clientY - r.top };
	}

	function hitTest(x: number, y: number): number | null {
		// Slightly enlarged hit radius for small dots
		for (let i = nodes.length - 1; i >= 0; i--) {
			const n = nodes[i];
			if ((x - n.x) ** 2 + (y - n.y) ** 2 <= (n.r + 4) ** 2) return i;
		}
		return null;
	}

	function onCanvasMove(e: PointerEvent) {
		const { x, y } = getPos(e);
		if (dragging !== null) {
			nodes[dragging].x = x - dragOffset.x;
			nodes[dragging].y = y - dragOffset.y;
			nodes[dragging].vx = 0;
			nodes[dragging].vy = 0;
			draw();
			return;
		}
		const hit = hitTest(x, y);
		if (hit !== hover) {
			hover = hit;
			if (hit !== null) preview(nodes[hit].name);
			draw();
		}
	}

	function onCanvasDown(e: PointerEvent) {
		e.stopPropagation();
		const { x, y } = getPos(e);
		const hit = hitTest(x, y);
		if (hit !== null) {
			dragging = hit;
			dragOffset = { x: x - nodes[hit].x, y: y - nodes[hit].y };
			canvas.setPointerCapture(e.pointerId);
			if (!raf) raf = requestAnimationFrame(step);
		}
	}

	function onCanvasUp(e: PointerEvent) {
		if (dragging !== null) {
			const moved = Math.hypot(e.movementX, e.movementY);
			if (moved < 2) load(nodes[dragging].name);
			dragging = null;
			if (!raf) raf = requestAnimationFrame(step);
		}
	}

	$effect(() => {
		if (!active) {
			focused = null;
			restoreSnapshot();
		}
	});

	function navigate(dir: 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown') {
		if (nodes.length === 0) return;
		if (focused === null) {
			focused = 0;
			preview(nodes[0].name);
			draw();
			return;
		}
		const cur = nodes[focused];
		let best: number | null = null;
		let bestScore = Infinity;
		for (let i = 0; i < nodes.length; i++) {
			if (i === focused) continue;
			const dx = nodes[i].x - cur.x;
			const dy = nodes[i].y - cur.y;
			const dist = Math.hypot(dx, dy);
			let qualifies = false,
				score = 0;
			if (dir === 'ArrowRight' && dx > 0) {
				qualifies = true;
				score = dist + Math.abs(dy) * 1.5;
			}
			if (dir === 'ArrowLeft' && dx < 0) {
				qualifies = true;
				score = dist + Math.abs(dy) * 1.5;
			}
			if (dir === 'ArrowDown' && dy > 0) {
				qualifies = true;
				score = dist + Math.abs(dx) * 1.5;
			}
			if (dir === 'ArrowUp' && dy < 0) {
				qualifies = true;
				score = dist + Math.abs(dx) * 1.5;
			}
			if (qualifies && score < bestScore) {
				bestScore = score;
				best = i;
			}
		}
		if (best !== null) {
			focused = best;
			preview(nodes[best].name);
			draw();
		}
	}

	function onKeyDown(e: KeyboardEvent) {
		if (!active) return;
		if (
			e.key === 'ArrowLeft' ||
			e.key === 'ArrowRight' ||
			e.key === 'ArrowUp' ||
			e.key === 'ArrowDown'
		) {
			e.preventDefault();
			navigate(e.key);
		}
		if ((e.key === 'Enter' || e.key === ' ') && focused !== null) {
			e.preventDefault();
			load(nodes[focused].name);
		}
	}

	onMount(() => {
		init();
		raf = requestAnimationFrame(step);
		const ro = new ResizeObserver(() => init());
		ro.observe(container);
		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
			clearTimeout(previewTimer);
			audio.releaseAll();
		};
	});
</script>

<svelte:window onkeydown={onKeyDown} />

<div bind:this={container} class="absolute inset-0 overflow-hidden" role="presentation">
	<canvas
		bind:this={canvas}
		class="absolute inset-0"
		style:cursor={dragging !== null ? 'grabbing' : hover !== null ? 'grab' : 'default'}
		onpointermove={onCanvasMove}
		onpointerdown={onCanvasDown}
		onpointerup={onCanvasUp}
		onpointerleave={() => {
			hover = null;
			// If user hasn't focused/committed, restore their working patch.
			if (focused === null) restoreSnapshot();
			draw();
		}}
	/>

	{#if hover !== null || focused !== null}
		{@const n = nodes[(hover ?? focused)!]}
		<div
			class="pointer-events-none absolute z-10 -translate-x-1/2 rounded bg-crust px-2 py-0.5 text-[10px] tracking-wide text-text shadow-lg"
			style:left="{n.x}px"
			style:top="{n.y - n.r - 18}px"
		>
			{n.name}
			<span class="ml-1 text-overlay1">·</span>
			<span class="ml-1 text-overlay1">{n.category}</span>
		</div>
	{/if}
</div>
