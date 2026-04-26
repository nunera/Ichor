<script lang="ts">
	type FilterType = 'lowpass' | 'highpass' | 'bandpass' | 'notch';
	let type = $state<FilterType>('lowpass');
	let cutoff = $state(0.5); // 0..1, log-mapped to 20Hz..20kHz visually
	let resonance = $state(2);

	const W = 320;
	const H = 90;

	// Map normalized cutoff (0..1) to a visual x position.
	const cutoffX = $derived(cutoff * W);

	// Approximate biquad magnitude response in log frequency space.
	// We sample ~120 points and draw the curve.
	function magnitude(freqRatio: number, fc: number, q: number, t: FilterType): number {
		// freqRatio: relative position 0..1 along log freq axis
		// fc: same scale, cutoff position
		const w = freqRatio;
		const wc = fc;
		const dist = w - wc; // signed log distance
		const peak = Math.max(0, q / 8); // resonance bump
		switch (t) {
			case 'lowpass': {
				// 1 below cutoff, falls off above; resonance bump near cutoff
				if (w <= wc) return 1 + peak * Math.exp(-Math.pow(dist * 8, 2));
				return Math.max(0, 1 - (w - wc) * 4) + peak * Math.exp(-Math.pow(dist * 8, 2));
			}
			case 'highpass': {
				if (w >= wc) return 1 + peak * Math.exp(-Math.pow(dist * 8, 2));
				return Math.max(0, 1 - (wc - w) * 4) + peak * Math.exp(-Math.pow(dist * 8, 2));
			}
			case 'bandpass': {
				return Math.max(0, 1 - Math.abs(dist) * 6) + peak * Math.exp(-Math.pow(dist * 8, 2));
			}
			case 'notch': {
				return Math.min(1, Math.abs(dist) * 4 + 0.1);
			}
		}
	}

	const path = $derived.by(() => {
		const N = 200;
		const pts: string[] = [];
		for (let i = 0; i < N; i++) {
			const w = i / (N - 1);
			const m = magnitude(w, cutoff, resonance, type);
			const yScale = Math.min(1.4, m); // clamp for display
			const y = H - 6 - yScale * (H - 12);
			pts.push(`${i === 0 ? 'M' : 'L'} ${(w * W).toFixed(1)} ${y.toFixed(1)}`);
		}
		return pts.join(' ');
	});

	const filterTypes: { id: FilterType; label: string }[] = [
		{ id: 'lowpass', label: 'LP' },
		{ id: 'highpass', label: 'HP' },
		{ id: 'bandpass', label: 'BP' },
		{ id: 'notch', label: 'NT' }
	];

	function freqLabel(c: number): string {
		// rough log map for label
		const hz = Math.round(20 * Math.pow(1000, c));
		return hz >= 1000 ? `${(hz / 1000).toFixed(1)}k` : `${hz}`;
	}
</script>

<div class="rounded-lg border border-surface0 bg-base/40 p-4">
	<svg viewBox="0 0 {W} {H}" class="h-24 w-full" preserveAspectRatio="none">
		<line x1="0" y1={H - 6} x2={W} y2={H - 6} class="stroke-surface1" stroke-width="0.5" />
		<line
			x1={cutoffX}
			y1={6}
			x2={cutoffX}
			y2={H - 6}
			class="stroke-surface2"
			stroke-width="0.5"
			stroke-dasharray="2 2"
		/>
		<path d={path} class="stroke-mauve" stroke-width="2" fill="none" />
	</svg>

	<div class="mt-3 flex items-center justify-center gap-1">
		{#each filterTypes as ft}
			<button
				class="rounded px-2 py-1 text-[10px] font-medium tracking-wide uppercase transition-colors"
				class:bg-blue={type === ft.id}
				class:text-base={type === ft.id}
				class:bg-surface0={type !== ft.id}
				class:text-overlay1={type !== ft.id}
				onclick={() => (type = ft.id)}
			>
				{ft.label}
			</button>
		{/each}
	</div>

	<div class="mt-3 grid grid-cols-2 gap-3 text-[10px]">
		<label class="flex items-center gap-2">
			<span class="w-12 text-subtext0">cutoff</span>
			<input
				type="range"
				min={0.05}
				max={0.95}
				step={0.01}
				bind:value={cutoff}
				class="flex-1 accent-blue"
			/>
			<span class="w-10 text-right text-overlay1 tabular-nums">{freqLabel(cutoff)} Hz</span>
		</label>
		<label class="flex items-center gap-2">
			<span class="w-12 text-subtext0">reso</span>
			<input
				type="range"
				min={0.1}
				max={20}
				step={0.1}
				bind:value={resonance}
				class="flex-1 accent-blue"
			/>
			<span class="w-8 text-right text-overlay1 tabular-nums">{resonance.toFixed(1)}</span>
		</label>
	</div>
</div>
