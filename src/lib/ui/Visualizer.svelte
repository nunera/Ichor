<script lang="ts">
	import { audio } from '$lib/audio/engine.svelte';
	import { onMount } from 'svelte';

	type Mode = 'scope' | 'spectrum';

	type Props = {
		mode?: Mode;
		class?: string;
		/** Render the line softer/dimmer when used as a background. */
		ambient?: boolean;
	};

	let { mode = 'scope', class: cls = '', ambient = false }: Props = $props();
	let canvas: HTMLCanvasElement;

	onMount(() => {
		let raf = 0;
		const ctx2d = canvas.getContext('2d');
		if (!ctx2d) return;
		const ctx: CanvasRenderingContext2D = ctx2d;

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

			if (!audio.started) return;

			const stroke = color('--ctp-mauve');
			ctx.strokeStyle = stroke;
			ctx.lineWidth = ambient ? 1.25 : 1.5;
			ctx.globalAlpha = ambient ? 0.55 : 1;
			ctx.beginPath();

			if (mode === 'scope') {
				const data = audio.getWaveform();
				if (!data) {
					ctx.globalAlpha = 1;
					return;
				}
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
				if (!data) {
					ctx.globalAlpha = 1;
					return;
				}
				const N = data.length;
				const minDb = -100;
				const maxDb = 0;
				ctx.beginPath();
				for (let i = 1; i < N; i++) {
					const t = Math.log2(i) / Math.log2(N - 1);
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
				ctx.fillStyle = stroke + (ambient ? '22' : '33');
				ctx.fill();
				ctx.stroke();
			}
			ctx.globalAlpha = 1;
		}

		draw();
		return () => cancelAnimationFrame(raf);
	});
</script>

<canvas bind:this={canvas} class={cls}></canvas>
