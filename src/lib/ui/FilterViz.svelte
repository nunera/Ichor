<script lang="ts">
	import { audio } from '$lib/audio/engine.svelte';
	import { liveMod } from '$lib/audio/modTargets';

	const f = $derived(audio.patch.filter);

	// When LFOs modulate the filter, the engine writes the live effective values
	// to `liveMod` (without mutating the patch). Use those for visualization.
	let liveCutoff = $state<number | null>(null);
	let liveResonance = $state<number | null>(null);
	$effect(() => {
		const unsubs = [
			liveMod.subscribe('filter.cutoff', (v) => (liveCutoff = v)),
			liveMod.subscribe('filter.resonance', (v) => (liveResonance = v))
		];
		return () => {
			for (const u of unsubs) u();
		};
	});

	const effCutoff = $derived(liveCutoff ?? f.cutoff);
	const effResonance = $derived(liveResonance ?? f.resonance);

	// Display range and sample rate (matches Tone.js default).
	const FMIN = 20;
	const FMAX = 20000;
	const FS = 48000;

	let svgEl: SVGSVGElement;
	let viewW = $state(640);
	let viewH = $state(160);
	const PAD_X = 8;
	const PAD_T = 8;
	const PAD_B = 14;

	const innerW = $derived(Math.max(40, viewW - PAD_X * 2));
	const innerH = $derived(Math.max(40, viewH - PAD_T - PAD_B));

	/** Map Hz → x using log scale. */
	function fToX(hz: number): number {
		const t = (Math.log(hz) - Math.log(FMIN)) / (Math.log(FMAX) - Math.log(FMIN));
		return PAD_X + t * innerW;
	}
	function xToF(x: number): number {
		const t = (x - PAD_X) / innerW;
		return Math.exp(Math.log(FMIN) + t * (Math.log(FMAX) - Math.log(FMIN)));
	}

	/** dB → y. Display window: -36 dB (bottom) … +18 dB (top). */
	const DB_MIN = -36;
	const DB_MAX = 18;
	function dbToY(db: number): number {
		const t = (db - DB_MIN) / (DB_MAX - DB_MIN);
		return PAD_T + (1 - t) * innerH;
	}

	/** RBJ biquad magnitude (dB) for the four filter types we expose. */
	function magDb(hz: number, fc: number, q: number, type: typeof f.type): number {
		const w = (2 * Math.PI * fc) / FS;
		const cosw = Math.cos(w);
		const sinw = Math.sin(w);
		const alpha = sinw / (2 * Math.max(0.0001, q));
		let b0 = 0,
			b1 = 0,
			b2 = 0,
			a0 = 1,
			a1 = 0,
			a2 = 0;
		switch (type) {
			case 'lowpass':
				b0 = (1 - cosw) / 2;
				b1 = 1 - cosw;
				b2 = (1 - cosw) / 2;
				a0 = 1 + alpha;
				a1 = -2 * cosw;
				a2 = 1 - alpha;
				break;
			case 'highpass':
				b0 = (1 + cosw) / 2;
				b1 = -(1 + cosw);
				b2 = (1 + cosw) / 2;
				a0 = 1 + alpha;
				a1 = -2 * cosw;
				a2 = 1 - alpha;
				break;
			case 'bandpass':
				b0 = alpha;
				b1 = 0;
				b2 = -alpha;
				a0 = 1 + alpha;
				a1 = -2 * cosw;
				a2 = 1 - alpha;
				break;
			case 'notch':
				b0 = 1;
				b1 = -2 * cosw;
				b2 = 1;
				a0 = 1 + alpha;
				a1 = -2 * cosw;
				a2 = 1 - alpha;
				break;
		}
		// Evaluate at the analysis frequency.
		const wf = (2 * Math.PI * hz) / FS;
		const cwf = Math.cos(wf);
		const c2wf = Math.cos(2 * wf);
		const num = b0 * b0 + b1 * b1 + b2 * b2 + 2 * (b0 * b1 + b1 * b2) * cwf + 2 * b0 * b2 * c2wf;
		const den = a0 * a0 + a1 * a1 + a2 * a2 + 2 * (a0 * a1 + a1 * a2) * cwf + 2 * a0 * a2 * c2wf;
		const mag2 = num / Math.max(1e-12, den);
		return 10 * Math.log10(Math.max(1e-12, mag2));
	}

	/** Build the response polyline across the visible width. */
	const path = $derived.by(() => {
		const N = 160;
		let d = '';
		for (let i = 0; i <= N; i++) {
			const x = PAD_X + (i / N) * innerW;
			const hz = xToF(x);
			const db = magDb(hz, effCutoff, effResonance, f.type);
			const y = Math.max(PAD_T, Math.min(PAD_T + innerH, dbToY(db)));
			d += (i === 0 ? 'M' : 'L') + ' ' + x.toFixed(2) + ' ' + y.toFixed(2) + ' ';
		}
		return d.trim();
	});

	const fill = $derived(
		path ? path + ` L ${PAD_X + innerW} ${PAD_T + innerH} L ${PAD_X} ${PAD_T + innerH} Z` : ''
	);

	// Decade gridlines: 100, 1k, 10k.
	const grid = [100, 1000, 10000];
	const gridLabels: Record<number, string> = { 100: '100', 1000: '1k', 10000: '10k' };

	const cutoffX = $derived(fToX(Math.max(FMIN, Math.min(FMAX, effCutoff))));
	// Mark the cutoff point on the curve (where response crosses ~ -3 dB for LP/HP).
	const cutoffDb = $derived(magDb(effCutoff, effCutoff, effResonance, f.type));
	const cutoffY = $derived(dbToY(cutoffDb));

	/* ---- Drag interaction ---------------------------------------------------
	 * Pointer events update *target* values; an rAF loop eases the patch
	 * toward them. This smooths jittery mouse input and softens what would
	 * otherwise be a 1:1 hard mapping. Q is mapped exponentially so the
	 * vertical axis feels uniform — without that, the top half of the plot
	 * would cover most of the audible Q range and feel snappy.
	 */
	const Q_MIN = 0.1;
	const Q_MAX = 20;
	const Q_LOG_MIN = Math.log(Q_MIN);
	const Q_LOG_MAX = Math.log(Q_MAX);

	let dragging = $state(false);
	let targetCutoff = 0;
	let targetQ = 0;
	let rafId = 0;

	function onDown(e: PointerEvent) {
		dragging = true;
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
		// Seed targets from current values so the first frame doesn't snap.
		targetCutoff = f.cutoff;
		targetQ = f.resonance;
		applyFromPointer(e);
		startLoop();
	}
	function onMove(e: PointerEvent) {
		if (!dragging) return;
		applyFromPointer(e);
	}
	function onUp() {
		dragging = false;
		// Loop finishes settling on its own and stops itself.
	}

	function applyFromPointer(e: PointerEvent) {
		if (!svgEl) return;
		const pt = svgEl.createSVGPoint();
		pt.x = e.clientX;
		pt.y = e.clientY;
		const ctm = svgEl.getScreenCTM();
		if (!ctm) return;
		const { x, y } = pt.matrixTransform(ctm.inverse());
		targetCutoff = Math.max(50, Math.min(12000, xToF(x)));
		// Vertical → resonance, exponential map so the curve isn't sharp.
		const t = Math.max(0, Math.min(1, (PAD_T + innerH - y) / innerH));
		targetQ = Math.exp(Q_LOG_MIN + t * (Q_LOG_MAX - Q_LOG_MIN));
	}

	/** Exponential smoothing toward target. Smaller `tau` = snappier. */
	function startLoop() {
		if (rafId) return;
		let last = performance.now();
		const tick = (now: number) => {
			const dt = Math.min(0.05, (now - last) / 1000);
			last = now;
			// 60ms time constant — feels responsive but visibly smoothed.
			const k = 1 - Math.exp(-dt / 0.06);
			// Smooth cutoff in log space so motion feels uniform across the decade.
			const logCur = Math.log(f.cutoff);
			const logTgt = Math.log(targetCutoff);
			const newCutoff = Math.exp(logCur + (logTgt - logCur) * k);
			const newQ = f.resonance + (targetQ - f.resonance) * k;
			const cutoffDelta = Math.abs(newCutoff - f.cutoff);
			const qDelta = Math.abs(newQ - f.resonance);
			if (cutoffDelta > 0.01 || qDelta > 0.0005) {
				audio.setFilter({ cutoff: newCutoff, resonance: newQ });
			}
			const settled = !dragging && cutoffDelta < 0.05 && qDelta < 0.001;
			if (settled) {
				rafId = 0;
			} else {
				rafId = requestAnimationFrame(tick);
			}
		};
		rafId = requestAnimationFrame(tick);
	}

	$effect(() => {
		if (!svgEl) return;
		const ro = new ResizeObserver(([entry]) => {
			const r = entry.contentRect;
			viewW = Math.max(120, r.width);
			viewH = Math.max(80, r.height);
		});
		ro.observe(svgEl);
		return () => ro.disconnect();
	});
</script>

<svg
	bind:this={svgEl}
	viewBox="0 0 {viewW} {viewH}"
	class="min-h-0 w-full flex-1 cursor-crosshair touch-none rounded-md bg-mantle"
	onpointerdown={onDown}
	onpointermove={onMove}
	onpointerup={onUp}
	onpointercancel={onUp}
>
	<!-- Decade gridlines + labels -->
	<g class="stroke-surface0" stroke-width="0.5">
		{#each grid as hz}
			<line x1={fToX(hz)} y1={PAD_T} x2={fToX(hz)} y2={PAD_T + innerH} />
		{/each}
	</g>
	<!-- 0 dB line -->
	<line
		x1={PAD_X}
		y1={dbToY(0)}
		x2={PAD_X + innerW}
		y2={dbToY(0)}
		class="stroke-surface0"
		stroke-width="0.5"
		stroke-dasharray="2 3"
	/>

	<!-- Filled response -->
	{#if fill}
		<path d={fill} class="fill-blue/15" />
	{/if}
	{#if path}
		<path d={path} class="stroke-blue" stroke-width="1.5" fill="none" stroke-linejoin="round" />
	{/if}

	<!-- Cutoff marker -->
	<line
		x1={cutoffX}
		y1={PAD_T}
		x2={cutoffX}
		y2={PAD_T + innerH}
		class="stroke-blue/50"
		stroke-width="0.5"
		stroke-dasharray="3 3"
	/>
	<circle
		cx={cutoffX}
		cy={Math.max(PAD_T, Math.min(PAD_T + innerH, cutoffY))}
		r="4"
		class="fill-blue"
	/>

	<!-- Frequency labels -->
	<g class="fill-overlay1" font-size="9" text-anchor="middle" font-family="ui-monospace, monospace">
		{#each grid as hz}
			<text x={fToX(hz)} y={viewH - 3}>{gridLabels[hz]}</text>
		{/each}
	</g>
</svg>
