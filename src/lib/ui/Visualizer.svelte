<script lang="ts">
	import { audio } from '$lib/audio/engine.svelte';
	import { onMount } from 'svelte';

	type Mode = 'scope' | 'spectrum';
	let mode = $state<Mode>('scope');
	let canvas: HTMLCanvasElement;

	onMount(() => {
		let raf = 0;
		const ctx2d = canvas.getContext('2d');
		if (!ctx2d) return;
		const ctx: CanvasRenderingContext2D = ctx2d;

		// Read CSS-resolved theme colors so the viz follows latte/mocha switches.
		function color(name: string) {
			return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
		}

		function draw() {
			raf = requestAnimationFrame(draw);
			const dpr = window.devicePixelRatio || 1;
			const cssW = canvas.clientWidth;
			const cssH = canvas.clientHeight;
			if (canvas.width !== cssW * dpr || canvas.height !== cssH * dpr) {
				canvas.width = cssW * dpr;
				canvas.height = cssH * dpr;
			}
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			const w = cssW;
			const h = cssH;
			ctx.clearRect(0, 0, w, h);

			// Background grid
			ctx.strokeStyle = color('--ctp-surface0');
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(0, h / 2);
			ctx.lineTo(w, h / 2);
			ctx.stroke();

			if (!audio.started) {
				ctx.fillStyle = color('--ctp-overlay1');
				ctx.font = '11px ui-monospace, monospace';
				ctx.textAlign = 'center';
				ctx.fillText('press a key to start', w / 2, h / 2 - 6);
				return;
			}

			ctx.strokeStyle = color('--ctp-mauve');
			ctx.lineWidth = 1.5;
			ctx.beginPath();

			if (mode === 'scope') {
				const data = audio.getWaveform();
				if (!data) return;
				const N = data.length;
				for (let i = 0; i < N; i++) {
					const x = (i / (N - 1)) * w;
					const y = h / 2 - data[i] * (h / 2 - 4);
					if (i === 0) ctx.moveTo(x, y);
					else ctx.lineTo(x, y);
				}
				ctx.stroke();
			} else {
				const data = audio.getFFT();
				if (!data) return;
				const N = data.length;
				// Log-frequency axis: human ear hears logarithmically.
				const minDb = -100;
				const maxDb = 0;
				ctx.beginPath();
				for (let i = 1; i < N; i++) {
					const t = Math.log2(i) / Math.log2(N - 1); // 0..1 log
					const x = t * w;
					const db = data[i];
					const norm = (db - minDb) / (maxDb - minDb);
					const y = h - Math.max(0, Math.min(1, norm)) * h;
					if (i === 1) ctx.moveTo(x, y);
					else ctx.lineTo(x, y);
				}
				ctx.lineTo(w, h);
				ctx.lineTo(0, h);
				ctx.closePath();
				ctx.fillStyle = color('--ctp-mauve') + '33';
				ctx.fill();
				ctx.stroke();
			}
		}

		draw();
		return () => cancelAnimationFrame(raf);
	});
</script>

<section
	class="flex h-full min-h-0 flex-col gap-2 rounded-lg border border-surface0 bg-mantle/60 p-3"
>
	<header class="flex items-center gap-2">
		<span class="text-xs tracking-widest text-subtext0 uppercase">visualizer</span>
		<div class="ml-auto flex gap-1 text-[10px]">
			<button
				class="rounded px-2 py-1 transition-colors"
				class:bg-mauve={mode === 'scope'}
				class:text-base={mode === 'scope'}
				class:bg-surface0={mode !== 'scope'}
				class:text-subtext0={mode !== 'scope'}
				onclick={() => (mode = 'scope')}
			>
				scope
			</button>
			<button
				class="rounded px-2 py-1 transition-colors"
				class:bg-mauve={mode === 'spectrum'}
				class:text-base={mode === 'spectrum'}
				class:bg-surface0={mode !== 'spectrum'}
				class:text-subtext0={mode !== 'spectrum'}
				onclick={() => (mode = 'spectrum')}
			>
				spectrum
			</button>
		</div>
	</header>
	<canvas bind:this={canvas} class="min-h-0 w-full flex-1 rounded-md bg-base"></canvas>
</section>
