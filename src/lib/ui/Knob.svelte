<script lang="ts">
	type Props = {
		label: string;
		value: number;
		min: number;
		max: number;
		step?: number;
		unit?: string;
		size?: number;
		curve?: number; // exponent: 1 = linear, >1 = more resolution near min
		format?: (v: number) => string;
		onchange: (v: number) => void;
	};

	let {
		label,
		value,
		min,
		max,
		step = 0.01,
		unit = '',
		size = 44,
		curve = 1,
		format,
		onchange
	}: Props = $props();

	// Map value <-> 0..1 with optional exponential curve.
	const norm = $derived(
		curve === 1 ? (value - min) / (max - min) : ((value - min) / (max - min)) ** (1 / curve)
	);

	// Arc spans 270° from -135° (bottom-left) to +135° (bottom-right).
	const ARC = 270;
	const START = -135;
	const angle = $derived(START + norm * ARC);

	const r = size / 2 - 4;
	const cx = size / 2;
	const cy = size / 2;

	function polar(deg: number, radius: number) {
		const rad = (deg - 90) * (Math.PI / 180);
		return { x: cx + Math.cos(rad) * radius, y: cy + Math.sin(rad) * radius };
	}

	const trackStart = $derived(polar(START, r));
	const trackEnd = $derived(polar(START + ARC, r));
	const valueEnd = $derived(polar(angle, r));
	const indicatorOuter = $derived(polar(angle, r));
	const indicatorInner = $derived(polar(angle, r * 0.45));

	const largeArcTrack = ARC > 180 ? 1 : 0;
	const largeArcValue = $derived(norm * ARC > 180 ? 1 : 0);

	const trackPath = $derived(
		`M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 ${largeArcTrack} 1 ${trackEnd.x} ${trackEnd.y}`
	);
	const valuePath = $derived(
		`M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 ${largeArcValue} 1 ${valueEnd.x} ${valueEnd.y}`
	);

	const display = $derived(format ? format(value) : value.toFixed(step >= 1 ? 0 : 2));

	let dragging = $state(false);
	let dragStartY = 0;
	let dragStartNorm = 0;

	function onPointerDown(e: PointerEvent) {
		dragging = true;
		dragStartY = e.clientY;
		dragStartNorm = norm;
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging) return;
		const dy = dragStartY - e.clientY; // up = positive
		// 200px drag = full range. Shift slows it down 5x for fine control.
		const sensitivity = e.shiftKey ? 1000 : 200;
		const nextNorm = clamp(dragStartNorm + dy / sensitivity, 0, 1);
		const raw = curve === 1 ? min + nextNorm * (max - min) : min + nextNorm ** curve * (max - min);
		const snapped = step ? Math.round(raw / step) * step : raw;
		const final = clamp(snapped, min, max);
		if (final !== value) onchange(final);
	}

	function onPointerUp(e: PointerEvent) {
		dragging = false;
		(e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
	}

	function onDblClick() {
		// Reset to midpoint on double-click. Could be overridden via prop later.
		const mid = curve === 1 ? (min + max) / 2 : min + (max - min) * 0.5 ** curve;
		onchange(mid);
	}

	function onWheel(e: WheelEvent) {
		e.preventDefault();
		const delta = -Math.sign(e.deltaY) * (e.shiftKey ? step : step * 5);
		const next = clamp(value + delta, min, max);
		if (next !== value) onchange(next);
	}

	function clamp(v: number, lo: number, hi: number) {
		return Math.max(lo, Math.min(hi, v));
	}
</script>

<div class="flex flex-col items-center gap-1 select-none">
	<svg
		viewBox="0 0 {size} {size}"
		width={size}
		height={size}
		class="cursor-ns-resize touch-none"
		role="slider"
		tabindex="0"
		aria-label={label}
		aria-valuemin={min}
		aria-valuemax={max}
		aria-valuenow={value}
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointercancel={onPointerUp}
		ondblclick={onDblClick}
		onwheel={onWheel}
	>
		<!-- background track -->
		<path
			d={trackPath}
			class="stroke-surface1"
			stroke-width="3"
			fill="none"
			stroke-linecap="round"
		/>
		<!-- value arc -->
		<path d={valuePath} class="stroke-mauve" stroke-width="3" fill="none" stroke-linecap="round" />
		<!-- knob body -->
		<circle {cx} {cy} r={r * 0.7} class="fill-surface0 stroke-surface2" stroke-width="1" />
		<!-- pointer line -->
		<line
			x1={indicatorInner.x}
			y1={indicatorInner.y}
			x2={indicatorOuter.x}
			y2={indicatorOuter.y}
			class="stroke-text"
			stroke-width="2"
			stroke-linecap="round"
		/>
	</svg>
	<span class="text-[10px] tracking-wide text-subtext0 lowercase">{label}</span>
	<span class="text-[10px] text-overlay1 tabular-nums">{display}{unit}</span>
</div>
