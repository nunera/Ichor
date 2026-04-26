<script lang="ts">
	let attack = $state(0.15);
	let hold = $state(0.05);
	let decay = $state(0.25);
	let sustain = $state(0.6);
	let release = $state(0.4);

	const W = 320;
	const H = 90;
	const totalShown = 1.5; // seconds shown across the chart

	// Treat sustain phase as a fixed visual width so users can see it.
	const sustainW = 0.25;

	const points = $derived.by(() => {
		const a = attack;
		const h = hold;
		const d = decay;
		const r = release;
		const total = a + h + d + sustainW + r;
		const scale = W / Math.max(total, totalShown);

		const x0 = 0;
		const x1 = a * scale;
		const x2 = x1 + h * scale;
		const x3 = x2 + d * scale;
		const x4 = x3 + sustainW * scale;
		const x5 = x4 + r * scale;

		const top = 6;
		const bot = H - 6;
		const sustainY = bot - sustain * (bot - top);

		return { x0, x1, x2, x3, x4, x5, top, bot, sustainY };
	});

	const path = $derived(
		`M ${points.x0} ${points.bot} ` +
			`L ${points.x1.toFixed(1)} ${points.top} ` +
			`L ${points.x2.toFixed(1)} ${points.top} ` +
			`L ${points.x3.toFixed(1)} ${points.sustainY.toFixed(1)} ` +
			`L ${points.x4.toFixed(1)} ${points.sustainY.toFixed(1)} ` +
			`L ${points.x5.toFixed(1)} ${points.bot}`
	);
	const area = $derived(`${path} L ${points.x5.toFixed(1)} ${points.bot} Z`);
</script>

<div class="rounded-lg border border-surface0 bg-base/40 p-4">
	<svg viewBox="0 0 {W} {H}" class="h-24 w-full" preserveAspectRatio="none">
		<line x1="0" y1={H - 6} x2={W} y2={H - 6} class="stroke-surface1" stroke-width="0.5" />
		<path d={area} class="fill-mauve" opacity="0.15" />
		<path d={path} class="stroke-mauve" stroke-width="2" fill="none" />
		<!-- stage markers -->
		{#each [points.x1, points.x2, points.x3, points.x4] as x}
			<line
				x1={x}
				y1={6}
				x2={x}
				y2={H - 6}
				class="stroke-surface2"
				stroke-width="0.5"
				stroke-dasharray="2 2"
			/>
		{/each}
	</svg>

	<div class="mt-3 grid grid-cols-5 gap-2 text-[10px]">
		<label class="flex flex-col items-center gap-1">
			<span class="text-subtext0">A</span>
			<input
				type="range"
				min={0.001}
				max={2}
				step={0.01}
				bind:value={attack}
				class="w-full accent-mauve"
			/>
			<span class="text-overlay1 tabular-nums">{attack.toFixed(2)}s</span>
		</label>
		<label class="flex flex-col items-center gap-1">
			<span class="text-subtext0">H</span>
			<input
				type="range"
				min={0}
				max={1}
				step={0.01}
				bind:value={hold}
				class="w-full accent-mauve"
			/>
			<span class="text-overlay1 tabular-nums">{hold.toFixed(2)}s</span>
		</label>
		<label class="flex flex-col items-center gap-1">
			<span class="text-subtext0">D</span>
			<input
				type="range"
				min={0.001}
				max={2}
				step={0.01}
				bind:value={decay}
				class="w-full accent-mauve"
			/>
			<span class="text-overlay1 tabular-nums">{decay.toFixed(2)}s</span>
		</label>
		<label class="flex flex-col items-center gap-1">
			<span class="text-subtext0">S</span>
			<input
				type="range"
				min={0}
				max={1}
				step={0.01}
				bind:value={sustain}
				class="w-full accent-mauve"
			/>
			<span class="text-overlay1 tabular-nums">{(sustain * 100).toFixed(0)}%</span>
		</label>
		<label class="flex flex-col items-center gap-1">
			<span class="text-subtext0">R</span>
			<input
				type="range"
				min={0.001}
				max={2}
				step={0.01}
				bind:value={release}
				class="w-full accent-mauve"
			/>
			<span class="text-overlay1 tabular-nums">{release.toFixed(2)}s</span>
		</label>
	</div>
</div>
