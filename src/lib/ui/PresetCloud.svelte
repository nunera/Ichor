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
	};

	type Props = { active: boolean };
	let { active }: Props = $props();

	let container: HTMLDivElement;
	let nodes = $state<Node[]>([]);
	let edges = $state<[number, number][]>([]);
	let hover = $state<number | null>(null);
	let dragging = $state<number | null>(null);
	let dragOffset = { x: 0, y: 0 };
	let bounds = $state({ w: 600, h: 400 });
	let raf = 0;

	function init() {
		const r = container.getBoundingClientRect();
		bounds = { w: r.width, h: r.height };

		nodes = presetNames.map((name) => ({
			name,
			category: presets[name].category,
			// Sprinkle around the centre with small jitter; physics will spread them.
			x: bounds.w / 2 + (Math.random() - 0.5) * Math.min(bounds.w, 400),
			y: bounds.h / 2 + (Math.random() - 0.5) * Math.min(bounds.h, 300),
			vx: 0,
			vy: 0,
			r: 22
		}));

		// Edges: every node connects to every other node in the same category.
		edges = [];
		for (let i = 0; i < nodes.length; i++) {
			for (let j = i + 1; j < nodes.length; j++) {
				if (nodes[i].category === nodes[j].category) edges.push([i, j]);
			}
		}
	}

	function step() {
		raf = requestAnimationFrame(step);
		if (!active) return;

		const REPEL_SAME = 500; // light push within a category
		const REPEL_DIFF = 2200; // strong push between categories → clusters separate
		const SPRING_K = 0.008; // very soft pull within categories
		const REST = 130; // ideal spring length within a category
		const CENTER_PULL = 0.004; // strong gravity → compact overall layout
		const DAMP = 0.86;

		for (let i = 0; i < nodes.length; i++) {
			const a = nodes[i];
			if (i === dragging) continue;

			// Centre gravity
			a.vx += (bounds.w / 2 - a.x) * CENTER_PULL;
			a.vy += (bounds.h / 2 - a.y) * CENTER_PULL;

			// Repulsion from every other node
			for (let j = 0; j < nodes.length; j++) {
				if (j === i) continue;
				const b = nodes[j];
				const dx = a.x - b.x;
				const dy = a.y - b.y;
				const d2 = dx * dx + dy * dy + 1;
				const repel = a.category === b.category ? REPEL_SAME : REPEL_DIFF;
				const f = repel / d2;
				const d = Math.sqrt(d2);
				a.vx += (dx / d) * f;
				a.vy += (dy / d) * f;
			}
		}

		// Springs (category bonds)
		for (const [i, j] of edges) {
			const a = nodes[i];
			const b = nodes[j];
			const dx = b.x - a.x;
			const dy = b.y - a.y;
			const d = Math.hypot(dx, dy) || 1;
			const force = (d - REST) * SPRING_K;
			const fx = (dx / d) * force;
			const fy = (dy / d) * force;
			if (i !== dragging) {
				a.vx += fx;
				a.vy += fy;
			}
			if (j !== dragging) {
				b.vx -= fx;
				b.vy -= fy;
			}
		}

		// Integrate + damp + clamp to bounds
		for (let i = 0; i < nodes.length; i++) {
			if (i === dragging) continue;
			const n = nodes[i];
			n.vx *= DAMP;
			n.vy *= DAMP;
			n.x += n.vx;
			n.y += n.vy;
			const pad = n.r + 4;
			if (n.x < pad) {
				n.x = pad;
				n.vx *= -0.3;
			}
			if (n.x > bounds.w - pad) {
				n.x = bounds.w - pad;
				n.vx *= -0.3;
			}
			if (n.y < pad) {
				n.y = pad;
				n.vy *= -0.3;
			}
			if (n.y > bounds.h - pad) {
				n.y = bounds.h - pad;
				n.vy *= -0.3;
			}
		}

		// Reassign so Svelte sees the change. The array's mutated in place;
		// reassign the ref to trigger reactivity.
		nodes = nodes;
	}

	function load(name: string) {
		audio.loadPatch(presets[name].patch, 'editor');
	}

	function onPointerDown(e: PointerEvent, i: number) {
		// Don't let the click bubble to the backdrop and close the drawer.
		e.stopPropagation();
		dragging = i;
		const r = container.getBoundingClientRect();
		dragOffset.x = e.clientX - r.left - nodes[i].x;
		dragOffset.y = e.clientY - r.top - nodes[i].y;
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent, i: number) {
		if (dragging !== i) return;
		const r = container.getBoundingClientRect();
		nodes[i].x = e.clientX - r.left - dragOffset.x;
		nodes[i].y = e.clientY - r.top - dragOffset.y;
		nodes[i].vx = 0;
		nodes[i].vy = 0;
	}

	function onPointerUp(e: PointerEvent, i: number, name: string) {
		// Distinguish a click from a drag: tiny movement → load.
		const moved = Math.hypot(e.movementX, e.movementY);
		if (dragging === i && moved < 2) load(name);
		dragging = null;
	}

	onMount(() => {
		init();
		const ro = new ResizeObserver(() => {
			const r = container.getBoundingClientRect();
			bounds = { w: r.width, h: r.height };
		});
		ro.observe(container);
		raf = requestAnimationFrame(step);
		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
		};
	});
</script>

<div bind:this={container} class="absolute inset-0 overflow-hidden" role="presentation">
	<!-- Edges (drawn first so nodes paint over them). Each line uses the
	     category color so groups are visually identifiable; lit edges
	     get brighter and thicker on hover. -->
	<svg class="pointer-events-none absolute inset-0 h-full w-full">
		{#each edges as [i, j] (i + '-' + j)}
			{@const a = nodes[i]}
			{@const b = nodes[j]}
			{@const lit = hover === i || hover === j}
			{#if a && b && lit}
				<line
					x1={a.x}
					y1={a.y}
					x2={b.x}
					y2={b.y}
					stroke={categoryColor[a.category]}
					stroke-width="1.25"
					stroke-opacity="0.55"
				/>
			{/if}
		{/each}
	</svg>

	<!-- Nodes. When hovering, same-category nodes stay bright; others dim. -->
	{#each nodes as n, i (n.name)}
		{@const related = hover === null || hover === i || nodes[hover]?.category === n.category}
		<button
			class="absolute flex items-center justify-center rounded-full border-2 transition-[transform,opacity,box-shadow] duration-150 hover:scale-110 active:scale-95"
			style:left="{n.x - n.r}px"
			style:top="{n.y - n.r}px"
			style:width="{n.r * 2}px"
			style:height="{n.r * 2}px"
			style:background-color={categoryColor[n.category]}
			style:border-color="var(--ctp-base)"
			style:cursor={dragging === i ? 'grabbing' : 'grab'}
			style:touch-action="none"
			style:opacity={related ? 1 : 0.25}
			style:box-shadow={hover === i
				? `0 0 0 4px ${categoryColor[n.category]}55, 0 0 24px ${categoryColor[n.category]}99`
				: 'none'}
			onpointerdown={(e) => onPointerDown(e, i)}
			onpointermove={(e) => onPointerMove(e, i)}
			onpointerup={(e) => onPointerUp(e, i, n.name)}
			onclick={(e) => e.stopPropagation()}
			onpointerenter={() => (hover = i)}
			onpointerleave={() => (hover = null)}
			aria-label="load preset {n.name}"
		>
			<span class="sr-only">{n.name}</span>
		</button>

		{#if hover === i}
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
	{/each}
</div>
