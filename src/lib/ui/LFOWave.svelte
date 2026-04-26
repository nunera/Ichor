<script lang="ts">
	import { audio } from '$lib/audio/engine.svelte';

	const lfo = $derived(audio.patch.lfo);

	// Visualize a few cycles of a sine wave; depth scales the amplitude.
	const W = 160;
	const H = 40;
	const CYCLES = 3;

	function waveAt(phase: number, shape: string): number {
		// phase scaled so that integer steps = full cycles
		const p = phase - Math.floor(phase);
		switch (shape) {
			case 'square':
				return p < 0.5 ? 1 : -1;
			case 'triangle':
				return p < 0.5 ? -1 + 4 * p : 3 - 4 * p;
			case 'sawtooth':
				return 2 * p - 1;
			case 'sine':
			default:
				return Math.sin(p * 2 * Math.PI);
		}
	}

	const path = $derived.by(() => {
		const N = 240;
		const pts: string[] = [];
		const amp = lfo.enabled ? Math.min(1, lfo.depth / 3000) : 0.05;
		for (let i = 0; i < N; i++) {
			const t = i / (N - 1);
			const x = t * W;
			const y = H / 2 - waveAt(t * CYCLES, lfo.shape) * (H / 2 - 4) * amp;
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
