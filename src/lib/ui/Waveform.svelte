<script lang="ts">
	import type { Waveform } from '$lib/audio/engine.svelte';

	type Props = { type: Waveform; width?: number; class?: string };
	let { type, width = 0.5, class: cls = '' }: Props = $props();

	const W = 120;
	const H = 40;
	const cycles = 2;

	function sample(t: number): number {
		const x = t * cycles * 2 * Math.PI;
		switch (type) {
			case 'sine':
				return Math.sin(x);
			case 'square':
				return Math.sin(x) >= 0 ? 1 : -1;
			case 'sawtooth':
				return 2 * (((t * cycles) % 1) - 0.5);
			case 'triangle': {
				const u = (t * cycles) % 1;
				return 4 * Math.abs(u - 0.5) - 1;
			}
			case 'pulse': {
				const phase = (t * cycles) % 1;
				return phase < width ? 1 : -1;
			}
		}
	}

	const path = $derived.by(() => {
		const N = 200;
		const pts: string[] = [];
		for (let i = 0; i < N; i++) {
			const t = i / (N - 1);
			const y = H / 2 - sample(t) * (H / 2 - 2);
			pts.push(`${i === 0 ? 'M' : 'L'} ${(t * W).toFixed(1)} ${y.toFixed(1)}`);
		}
		return pts.join(' ');
	});
</script>

<svg viewBox="0 0 {W} {H}" class={cls} preserveAspectRatio="none">
	<line x1="0" y1={H / 2} x2={W} y2={H / 2} class="stroke-surface1" stroke-width="0.5" />
	<path d={path} class="stroke-mauve" stroke-width="1.5" fill="none" />
</svg>
