<script lang="ts">
	import { audio } from '$lib/audio/engine.svelte';
	import { dragMod } from './dragMod.svelte';
	import Knob from './Knob.svelte';

	type Props = {
		which: 'modEnv1' | 'modEnv2';
		showRoutes?: boolean;
	};
	let { which, showRoutes = true }: Props = $props();

	const env = $derived(audio.patch[which]);
	const label = $derived(which === 'modEnv1' ? 'env 1' : 'env 2');

	function set(p: Parameters<typeof audio.setModEnv1>[0]) {
		if (which === 'modEnv1') audio.setModEnv1(p);
		else audio.setModEnv2(p);
	}

	let titleEl: HTMLElement | null = $state(null);

	function onTitlePointerDown(e: PointerEvent) {
		const rect = titleEl?.getBoundingClientRect();
		if (!rect) return;
		const anchor = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
		const cursor = { x: e.clientX, y: e.clientY };
		dragMod.begin(which, anchor, cursor);
		e.preventDefault();
		window.addEventListener('pointermove', onWinMove);
		window.addEventListener('pointerup', onWinUp, { once: true });
	}

	function onWinMove(e: PointerEvent) {
		dragMod.move({ x: e.clientX, y: e.clientY });
	}

	function onWinUp() {
		window.removeEventListener('pointermove', onWinMove);
		const result = dragMod.end();
		if (result) audio.addRoute(result.lfo, result.target);
	}

	function fmt(v: number) {
		return v < 1 ? `${(v * 1000).toFixed(0)}ms` : `${v.toFixed(2)}s`;
	}

	/* ---- Envelope visualization -------------------------------------------- */
	const MAX = { attack: 2, hold: 2, decay: 2, release: 4 };
	const PAD = 8;
	const LABEL_PAD = 12;

	let svgEl: SVGSVGElement;
	let viewW = $state(320);
	let viewH = $state(100);

	const STAGE_RATIO = { attack: 0.2, hold: 0.15, decay: 0.2, sustainPad: 0.15, release: 0.3 };
	const innerW = $derived(viewW - PAD * 2);
	const W = $derived({
		attack: innerW * STAGE_RATIO.attack,
		hold: innerW * STAGE_RATIO.hold,
		decay: innerW * STAGE_RATIO.decay,
		sustainPad: innerW * STAGE_RATIO.sustainPad,
		release: innerW * STAGE_RATIO.release
	});

	const ax = $derived((env.attack / MAX.attack) * W.attack);
	const hx = $derived((env.hold / MAX.hold) * W.hold);
	const dx = $derived((env.decay / MAX.decay) * W.decay);
	const rx = $derived((env.release / MAX.release) * W.release);

	const x0 = PAD;
	const x1 = $derived(x0 + ax);
	const x2 = $derived(x1 + hx);
	const x3 = $derived(x2 + dx);
	const x4 = $derived(x3 + W.sustainPad);
	const x5 = $derived(x4 + rx);

	const yTop = PAD;
	const yBot = $derived(viewH - PAD - LABEL_PAD);
	const sustainY = $derived(yBot - env.sustain * (yBot - yTop));

	const curvePath = $derived(
		`M ${x0} ${yBot} L ${x1} ${yTop} L ${x2} ${yTop} L ${x3} ${sustainY} L ${x4} ${sustainY} L ${x5} ${yBot}`
	);
	const fillPath = $derived(curvePath + ' Z');

	type Handle = 'A' | 'H' | 'D' | 'S' | 'R';
	let dragging = $state<Handle | null>(null);

	function onDown(h: Handle, e: PointerEvent) {
		dragging = h;
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
	}

	function onMove(e: PointerEvent) {
		if (!dragging || !svgEl) return;
		const pt = svgEl.createSVGPoint();
		pt.x = e.clientX;
		pt.y = e.clientY;
		const ctm = svgEl.getScreenCTM();
		if (!ctm) return;
		const { x, y } = pt.matrixTransform(ctm.inverse());

		switch (dragging) {
			case 'A': {
				const v = clamp((x - x0) / W.attack, 0, 1) * MAX.attack;
				set({ attack: v });
				break;
			}
			case 'H': {
				const v = clamp((x - x1) / W.hold, 0, 1) * MAX.hold;
				set({ hold: v });
				break;
			}
			case 'D': {
				const v = clamp((x - x2) / W.decay, 0, 1) * MAX.decay;
				set({ decay: v });
				break;
			}
			case 'S': {
				const s = clamp((yBot - y) / (yBot - yTop), 0, 1);
				set({ sustain: s });
				break;
			}
			case 'R': {
				const v = clamp((x - x4) / W.release, 0, 1) * MAX.release;
				set({ release: v });
				break;
			}
		}
	}

	function onUp() {
		dragging = null;
	}

	function clamp(v: number, lo: number, hi: number) {
		return Math.max(lo, Math.min(hi, v));
	}

	$effect(() => {
		if (!svgEl) return;
		const ro = new ResizeObserver(([entry]) => {
			const r = entry.contentRect;
			viewW = Math.max(120, r.width);
			viewH = Math.max(60, r.height);
		});
		ro.observe(svgEl);
		return () => ro.disconnect();
	});
</script>

<section
	class="flex h-full min-h-0 flex-col gap-1.5 overflow-hidden rounded-lg border border-surface0 bg-mantle/60 p-2"
>
	<header class="flex items-center gap-1.5">
		<input
			type="checkbox"
			checked={env.enabled}
			onchange={(e) => set({ enabled: e.currentTarget.checked })}
			class="accent-mauve"
			aria-label="enable {label}"
		/>
		<button
			bind:this={titleEl}
			onpointerdown={onTitlePointerDown}
			class="cursor-grab rounded px-1 text-[11px] tracking-widest text-text uppercase select-none active:cursor-grabbing"
			class:bg-sapphire={dragMod.source?.lfo === which}
			class:text-base={dragMod.source?.lfo === which}
			title="drag onto a knob to route this mod envelope"
		>
			{label}
		</button>
	</header>

	<!-- ADSR visualization -->
	<svg
		bind:this={svgEl}
		viewBox="0 0 {viewW} {viewH}"
		class="min-h-0 w-full flex-1 touch-none rounded-md bg-base/60"
		class:opacity-50={!env.enabled}
		style:overflow="visible"
		onpointermove={onMove}
		onpointerup={onUp}
		onpointercancel={onUp}
	>
		<!-- Stage backgrounds -->
		<rect x={x0} y={yTop} width={W.attack} height={yBot - yTop} class="fill-surface0/40" />
		<rect x={x0 + W.attack} y={yTop} width={W.hold} height={yBot - yTop} class="fill-surface0/20" />
		<rect
			x={x0 + W.attack + W.hold}
			y={yTop}
			width={W.decay}
			height={yBot - yTop}
			class="fill-surface0/40"
		/>
		<rect
			x={x0 + W.attack + W.hold + W.decay}
			y={yTop}
			width={W.sustainPad}
			height={yBot - yTop}
			class="fill-surface0/20"
		/>
		<rect
			x={x0 + W.attack + W.hold + W.decay + W.sustainPad}
			y={yTop}
			width={W.release}
			height={yBot - yTop}
			class="fill-surface0/40"
		/>

		<!-- Baseline -->
		<line
			x1={x0}
			y1={yBot}
			x2={x5 + (W.release - rx)}
			y2={yBot}
			class="stroke-overlay0"
			stroke-width="0.5"
		/>

		<!-- Filled curve -->
		<path d={fillPath} class="fill-sapphire/20" />
		<!-- Curve stroke -->
		<path
			d={curvePath}
			class="stroke-sapphire"
			stroke-width="2"
			fill="none"
			stroke-linejoin="round"
		/>

		<!-- Drag handles -->
		<circle
			cx={x1}
			cy={yTop}
			r="5"
			class="cursor-ew-resize fill-sapphire"
			onpointerdown={(e) => onDown('A', e)}
		/>
		<circle
			cx={x2}
			cy={yTop}
			r="5"
			class="cursor-ew-resize fill-teal"
			onpointerdown={(e) => onDown('H', e)}
		/>
		<circle
			cx={x3}
			cy={sustainY}
			r="5"
			class="cursor-move fill-blue"
			onpointerdown={(e) => onDown('D', e)}
		/>
		<circle
			cx={x4}
			cy={sustainY}
			r="5"
			class="cursor-ns-resize fill-sky"
			onpointerdown={(e) => onDown('S', e)}
		/>
		<circle
			cx={x5}
			cy={yBot}
			r="5"
			class="cursor-ew-resize fill-sapphire"
			onpointerdown={(e) => onDown('R', e)}
		/>

		<!-- Stage labels -->
		<g
			class="fill-subtext0"
			font-size="8"
			text-anchor="middle"
			font-family="ui-monospace, monospace"
		>
			<text x={x0 + W.attack / 2} y={yBot + LABEL_PAD - 2}>A</text>
			<text x={x0 + W.attack + W.hold / 2} y={yBot + LABEL_PAD - 2}>H</text>
			<text x={x0 + W.attack + W.hold + W.decay / 2} y={yBot + LABEL_PAD - 2}>D</text>
			<text x={x0 + W.attack + W.hold + W.decay + W.sustainPad / 2} y={yBot + LABEL_PAD - 2}>S</text
			>
			<text
				x={x0 + W.attack + W.hold + W.decay + W.sustainPad + W.release / 2}
				y={yBot + LABEL_PAD - 2}>R</text
			>
		</g>
	</svg>

	<!-- AHDSR knobs row -->
	<div class="grid shrink-0 grid-cols-5 gap-1" class:opacity-50={!env.enabled}>
		<div class="flex justify-center">
			<Knob
				label="A"
				target={`${which}.attack`}
				value={env.attack}
				min={0.001}
				max={8}
				step={0.001}
				curve={2}
				size={20}
				format={fmt}
				onchange={(v) => set({ attack: v })}
			/>
		</div>
		<div class="flex justify-center">
			<Knob
				label="H"
				target={`${which}.hold`}
				value={env.hold}
				min={0}
				max={8}
				step={0.001}
				curve={2}
				size={20}
				format={fmt}
				onchange={(v) => set({ hold: v })}
			/>
		</div>
		<div class="flex justify-center">
			<Knob
				label="D"
				target={`${which}.decay`}
				value={env.decay}
				min={0.001}
				max={8}
				step={0.001}
				curve={2}
				size={20}
				format={fmt}
				onchange={(v) => set({ decay: v })}
			/>
		</div>
		<div class="flex justify-center">
			<Knob
				label="S"
				target={`${which}.sustain`}
				value={env.sustain}
				min={0}
				max={1}
				step={0.01}
				size={20}
				format={(v) => `${(v * 100).toFixed(0)}%`}
				onchange={(v) => set({ sustain: v })}
			/>
		</div>
		<div class="flex justify-center">
			<Knob
				label="R"
				target={`${which}.release`}
				value={env.release}
				min={0.001}
				max={8}
				step={0.001}
				curve={2}
				size={20}
				format={fmt}
				onchange={(v) => set({ release: v })}
			/>
		</div>
	</div>

	{#if !showRoutes}
		<div class="min-w-0">
			{#if env.routes.length === 0}
				<p class="truncate text-[9px] leading-tight text-overlay1">
					drag the title onto a knob to route
				</p>
			{:else}
				<p class="text-[9px] tracking-wide text-subtext0 uppercase">
					{env.routes.length} route{env.routes.length === 1 ? '' : 's'}
				</p>
			{/if}
		</div>
	{/if}
</section>
