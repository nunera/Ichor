<script lang="ts">
	import { audio } from '$lib/audio/engine.svelte';

	const lfo = $derived(audio.patch.lfo);

	// Visualize a few cycles of a sine wave; depth scales the amplitude.
	const W = 160;
	const H = 40;
	const CYCLES = 3;

	const path = $derived.by(() => {
		const N = 120;
		const pts: string[] = [];
		// Map depth (0..6000 Hz) to a 0..1 amplitude factor for visual scale.
		const amp = lfo.enabled ? Math.min(1, lfo.depth / 3000) : 0.05;
		for (let i = 0; i < N; i++) {
			const t = i / (N - 1);
			const x = t * W;
			const y = H / 2 - Math.sin(t * CYCLES * 2 * Math.PI) * (H / 2 - 4) * amp;
			pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
		}
		return pts.join(' ');
	});
</script>

<svg viewBox="0 0 {W} {H}" preserveAspectRatio="none" class="h-full w-full rounded-md bg-base/60">
	<line x1="0" y1={H / 2} x2={W} y2={H / 2} class="stroke-surface1" stroke-width="0.5" />
	<path
		d={path}
		fill="none"
		stroke="currentColor"
		stroke-width="1.5"
		class="text-mauve transition-opacity"
		style:opacity={lfo.enabled ? 0.9 : 0.3}
	/>
</svg>
