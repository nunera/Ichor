<script lang="ts">
	import { audio } from '$lib/audio/engine.svelte';
	import Knob from './Knob.svelte';

	const n = $derived(audio.patch.noise);

	const noiseTypes = ['white', 'pink', 'brown'] as const;
	const noiseLabels: Record<string, string> = { white: 'WHT', pink: 'PNK', brown: 'BRN' };
</script>

<section
	class="flex h-full min-h-0 flex-col gap-2 rounded-lg border border-surface0 bg-mantle/60 p-3"
	class:opacity-50={!n.enabled}
>
	<header class="flex items-center gap-2">
		<input
			type="checkbox"
			checked={n.enabled}
			onchange={(e) => audio.setNoise({ enabled: e.currentTarget.checked })}
			class="accent-mauve"
			aria-label="enable noise"
		/>
		<span class="text-xs tracking-widest text-subtext0 uppercase">noise</span>
	</header>

	<!-- Noise type selector -->
	<div class="flex justify-around gap-1">
		{#each noiseTypes as t}
			<button
				class="flex-1 rounded py-0.5 text-[10px] font-medium tracking-wide transition-colors"
				class:bg-mauve={n.type === t}
				class:text-base={n.type === t}
				class:bg-surface0={n.type !== t}
				class:text-overlay1={n.type !== t}
				onclick={() => audio.setNoise({ type: t })}
				title={t}>{noiseLabels[t]}</button
			>
		{/each}
	</div>

	<div class="flex flex-1 items-center justify-around gap-1">
		<Knob
			label="level"
			target="noise.level"
			value={n.level}
			min={-60}
			max={0}
			step={1}
			size={26}
			unit=" dB"
			onchange={(v) => audio.setNoise({ level: v })}
		/>
		<Knob
			label="pan"
			target="noise.pan"
			value={n.pan}
			min={-1}
			max={1}
			step={0.01}
			size={26}
			format={(v) =>
				v === 0 ? 'C' : v > 0 ? `R${Math.round(v * 100)}` : `L${Math.round(-v * 100)}`}
			onchange={(v) => audio.setNoise({ pan: v })}
		/>
		<!-- reserved slot -->
		<div class="w-[26px]"></div>
	</div>
</section>
