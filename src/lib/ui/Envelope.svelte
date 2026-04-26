<script lang="ts">
	import { audio } from '$lib/audio/engine.svelte';
	import Knob from './Knob.svelte';

	const env = $derived(audio.patch.env);

	// Maximum durations (seconds) used to scale time on screen.
	const MAX = { attack: 2, hold: 2, decay: 2, release: 4 };
	// Visual width allotted to each stage (in SVG user units).
	const W = { attack: 80, hold: 80, decay: 80, sustainPad: 50, release: 100 };
	const H = 120;
	const PAD = 12;
	const totalW = W.attack + W.hold + W.decay + W.sustainPad + W.release + PAD * 2;

	// Convert seconds → x offset within each stage.
	const ax = $derived((env.attack / MAX.attack) * W.attack);
	const hx = $derived((env.hold / MAX.hold) * W.hold);
	const dx = $derived((env.decay / MAX.decay) * W.decay);
	const rx = $derived((env.release / MAX.release) * W.release);

	// Stage X boundaries.
	const x0 = PAD;
	const x1 = $derived(x0 + ax); // end of attack
	const x2 = $derived(x1 + hx); // end of hold
	const x3 = $derived(x2 + dx); // end of decay (sustain start)
	const x4 = $derived(x3 + W.sustainPad); // sustain end
	const x5 = $derived(x4 + rx); // release end

	const yTop = PAD;
	const yBot = H - PAD;
	const sustainY = $derived(yBot - env.sustain * (yBot - yTop));

	const path = $derived(
		`M ${x0} ${yBot}` +
			` L ${x1} ${yTop}` +
			` L ${x2} ${yTop}` +
			` L ${x3} ${sustainY}` +
			` L ${x4} ${sustainY}` +
			` L ${x5} ${yBot}`
	);

	const fill = $derived(
		`M ${x0} ${yBot}` +
			` L ${x1} ${yTop}` +
			` L ${x2} ${yTop}` +
			` L ${x3} ${sustainY}` +
			` L ${x4} ${sustainY}` +
			` L ${x5} ${yBot} Z`
	);

	type Handle = 'A' | 'H' | 'D' | 'S' | 'R';
	let dragging = $state<Handle | null>(null);
	let svgEl: SVGSVGElement;

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
				audio.setEnvelope({ attack: v });
				break;
			}
			case 'H': {
				const v = clamp((x - x1) / W.hold, 0, 1) * MAX.hold;
				audio.setEnvelope({ hold: v });
				break;
			}
			case 'D': {
				const v = clamp((x - x2) / W.decay, 0, 1) * MAX.decay;
				audio.setEnvelope({ decay: v });
				break;
			}
			case 'S': {
				const s = clamp((yBot - y) / (yBot - yTop), 0, 1);
				audio.setEnvelope({ sustain: s });
				break;
			}
			case 'R': {
				const v = clamp((x - x4) / W.release, 0, 1) * MAX.release;
				audio.setEnvelope({ release: v });
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

	function fmt(v: number) {
		return v < 1 ? `${(v * 1000).toFixed(0)} ms` : `${v.toFixed(2)} s`;
	}
</script>

<div class="flex h-full min-h-0 flex-col gap-2">
	<div class="flex shrink-0 items-baseline justify-between">
		<h3 class="text-xs tracking-widest text-subtext0 uppercase">envelope</h3>
		<span class="text-[10px] text-overlay1">drag the dots</span>
	</div>

	<svg
		bind:this={svgEl}
		viewBox="0 0 {totalW} {H}"
		preserveAspectRatio="none"
		class="min-h-0 w-full flex-1 touch-none rounded-md bg-mantle"
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
		<path d={fill} class="fill-mauve/20" />
		<!-- Curve -->
		<path d={path} class="stroke-mauve" stroke-width="2" fill="none" stroke-linejoin="round" />

		<!-- Handles -->
		<circle
			cx={x1}
			cy={yTop}
			r="6"
			class="cursor-ew-resize fill-peach"
			onpointerdown={(e) => onDown('A', e)}
		/>
		<circle
			cx={x2}
			cy={yTop}
			r="6"
			class="cursor-ew-resize fill-yellow"
			onpointerdown={(e) => onDown('H', e)}
		/>
		<circle
			cx={x3}
			cy={sustainY}
			r="6"
			class="cursor-move fill-green"
			onpointerdown={(e) => onDown('D', e)}
		/>
		<circle
			cx={x4}
			cy={sustainY}
			r="6"
			class="cursor-ns-resize fill-teal"
			onpointerdown={(e) => onDown('S', e)}
		/>
		<circle
			cx={x5}
			cy={yBot}
			r="6"
			class="cursor-ew-resize fill-blue"
			onpointerdown={(e) => onDown('R', e)}
		/>

		<!-- Stage labels -->
		<g
			class="fill-subtext0"
			font-size="9"
			text-anchor="middle"
			font-family="ui-monospace, monospace"
		>
			<text x={x0 + W.attack / 2} y={H - 1}>A</text>
			<text x={x0 + W.attack + W.hold / 2} y={H - 1}>H</text>
			<text x={x0 + W.attack + W.hold + W.decay / 2} y={H - 1}>D</text>
			<text x={x0 + W.attack + W.hold + W.decay + W.sustainPad / 2} y={H - 1}>S</text>
			<text x={x0 + W.attack + W.hold + W.decay + W.sustainPad + W.release / 2} y={H - 1}>R</text>
		</g>
	</svg>

	<div class="grid shrink-0 grid-cols-5 gap-2">
		<div class="flex justify-center">
			<Knob
				label="attack"
				value={env.attack}
				min={0.001}
				max={2}
				step={0.001}
				size={44}
				curve={2}
				format={fmt}
				onchange={(v) => audio.setEnvelope({ attack: v })}
			/>
		</div>
		<div class="flex justify-center">
			<Knob
				label="hold"
				value={env.hold}
				min={0}
				max={2}
				step={0.001}
				size={44}
				curve={2}
				format={fmt}
				onchange={(v) => audio.setEnvelope({ hold: v })}
			/>
		</div>
		<div class="flex justify-center">
			<Knob
				label="decay"
				value={env.decay}
				min={0.001}
				max={2}
				step={0.001}
				size={44}
				curve={2}
				format={fmt}
				onchange={(v) => audio.setEnvelope({ decay: v })}
			/>
		</div>
		<div class="flex justify-center">
			<Knob
				label="sustain"
				value={env.sustain}
				min={0}
				max={1}
				step={0.01}
				size={44}
				format={(v) => `${(v * 100).toFixed(0)}%`}
				onchange={(v) => audio.setEnvelope({ sustain: v })}
			/>
		</div>
		<div class="flex justify-center">
			<Knob
				label="release"
				value={env.release}
				min={0.001}
				max={4}
				step={0.001}
				size={44}
				curve={2}
				format={fmt}
				onchange={(v) => audio.setEnvelope({ release: v })}
			/>
		</div>
	</div>
</div>
