<script lang="ts">
	type Props = { lfo?: boolean; unison?: boolean };
	let { lfo = false, unison = false }: Props = $props();

	type Wave = 'sine' | 'triangle' | 'square' | 'sawtooth' | 'pulse';
	let selected = $state<Wave>(lfo ? 'sine' : 'sawtooth');
	let pulseWidth = $state(0.5);
	let unisonVoices = $state(5);
	let unisonSpread = $state(40);

	const W = 320;
	const H = 90;
	const cycles = lfo ? 2 : 3;

	function sample(t: number, type: Wave, w = 0.5): number {
		const x = t * cycles * 2 * Math.PI;
		switch (type) {
			case 'sine':
				return Math.sin(x);
			case 'triangle': {
				const u = (t * cycles) % 1;
				return 4 * Math.abs(u - 0.5) - 1;
			}
			case 'square':
				return Math.sin(x) >= 0 ? 1 : -1;
			case 'sawtooth':
				return 2 * (((t * cycles) % 1) - 0.5);
			case 'pulse': {
				const phase = (t * cycles) % 1;
				return phase < w ? 1 : -1;
			}
		}
	}

	function buildPath(type: Wave, offset = 0): string {
		const N = 360;
		const pts: string[] = [];
		for (let i = 0; i < N; i++) {
			const t = i / (N - 1);
			const y = H / 2 - sample(t, type, pulseWidth) * (H / 2 - 6) + offset;
			pts.push(`${i === 0 ? 'M' : 'L'} ${(t * W).toFixed(1)} ${y.toFixed(1)}`);
		}
		return pts.join(' ');
	}

	const mainPath = $derived(buildPath(selected));

	// Unison: render N copies, each phase-detuned
	const unisonPaths = $derived.by(() => {
		if (!unison) return [];
		const out: { d: string; opacity: number }[] = [];
		for (let i = 0; i < unisonVoices; i++) {
			// detune by spread cents → fake by tiny phase shift
			const det = (i - (unisonVoices - 1) / 2) * (unisonSpread / 200);
			const N = 360;
			const pts: string[] = [];
			for (let j = 0; j < N; j++) {
				const t = (j / (N - 1) + det * 0.05) % 1;
				const y = H / 2 - sample(t, selected, pulseWidth) * (H / 2 - 6);
				pts.push(`${j === 0 ? 'M' : 'L'} ${((j / (N - 1)) * W).toFixed(1)} ${y.toFixed(1)}`);
			}
			out.push({ d: pts.join(' '), opacity: 0.3 + 0.7 / unisonVoices });
		}
		return out;
	});

	const waves: Wave[] = lfo
		? ['sine', 'triangle', 'square', 'sawtooth']
		: ['sine', 'triangle', 'square', 'sawtooth', 'pulse'];
</script>

<div class="rounded-lg border border-surface0 bg-base/40 p-4">
	<svg viewBox="0 0 {W} {H}" class="h-24 w-full" preserveAspectRatio="none">
		<line x1="0" y1={H / 2} x2={W} y2={H / 2} class="stroke-surface1" stroke-width="0.5" />
		{#if unison}
			{#each unisonPaths as up}
				<path d={up.d} class="stroke-mauve" stroke-width="1.2" fill="none" opacity={up.opacity} />
			{/each}
		{:else}
			<path d={mainPath} class="stroke-mauve" stroke-width="1.5" fill="none" />
		{/if}
	</svg>

	<div class="mt-3 flex items-center justify-center gap-1">
		{#each waves as w}
			<button
				class="rounded px-2 py-1 text-[10px] font-medium tracking-wide uppercase transition-colors"
				class:bg-mauve={selected === w}
				class:text-base={selected === w}
				class:bg-surface0={selected !== w}
				class:text-overlay1={selected !== w}
				onclick={() => (selected = w)}
			>
				{w}
			</button>
		{/each}
	</div>

	{#if selected === 'pulse' && !unison}
		<div class="mt-3 flex items-center gap-2 text-[10px]">
			<span class="text-subtext0">width</span>
			<input
				type="range"
				min={0.05}
				max={0.95}
				step={0.01}
				bind:value={pulseWidth}
				class="flex-1 accent-mauve"
			/>
			<span class="w-10 text-right text-overlay1 tabular-nums"
				>{(pulseWidth * 100).toFixed(0)}%</span
			>
		</div>
	{/if}

	{#if unison}
		<div class="mt-3 grid grid-cols-2 gap-3 text-[10px]">
			<label class="flex items-center gap-2">
				<span class="w-12 text-subtext0">voices</span>
				<input
					type="range"
					min={1}
					max={8}
					step={1}
					bind:value={unisonVoices}
					class="flex-1 accent-mauve"
				/>
				<span class="w-6 text-right text-overlay1 tabular-nums">{unisonVoices}</span>
			</label>
			<label class="flex items-center gap-2">
				<span class="w-12 text-subtext0">spread</span>
				<input
					type="range"
					min={0}
					max={100}
					step={1}
					bind:value={unisonSpread}
					disabled={unisonVoices <= 1}
					class="flex-1 accent-mauve disabled:opacity-30"
				/>
				<span class="w-8 text-right text-overlay1 tabular-nums">{unisonSpread}c</span>
			</label>
		</div>
	{/if}
</div>
