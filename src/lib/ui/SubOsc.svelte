<script lang="ts">
	import { audio } from '$lib/audio/engine.svelte';
	import Knob from './Knob.svelte';

	const s = $derived(audio.patch.sub);

	const waves = ['sine', 'triangle', 'square', 'sawtooth'] as const;
	const waveLabels: Record<string, string> = { sine: '∿', triangle: '△', square: '⊓', sawtooth: '⊿' };
</script>

<section
	class="flex min-h-0 flex-col gap-2 rounded-lg border border-surface0 bg-mantle/60 p-3"
	class:opacity-50={!s.enabled}
>
	<header class="flex items-center gap-2">
		<input
			type="checkbox"
			checked={s.enabled}
			onchange={(e) => audio.setSub({ enabled: e.currentTarget.checked })}
			class="accent-mauve"
			aria-label="enable sub oscillator"
		/>
		<span class="text-xs tracking-widest text-subtext0 uppercase">sub</span>
	</header>

	<!-- Wave type selector -->
	<div class="flex justify-around gap-1">
		{#each waves as w}
			<button
				class="flex-1 rounded py-0.5 text-sm font-medium transition-colors"
				class:bg-mauve={s.type === w}
				class:text-base={s.type === w}
				class:bg-surface0={s.type !== w}
				class:text-overlay1={s.type !== w}
				onclick={() => audio.setSub({ type: w })}
				title={w}
			>{waveLabels[w]}</button>
		{/each}
	</div>

	<div class="flex flex-1 items-center justify-around gap-1">
		<Knob
			label="oct"
			value={s.octave}
			min={-3}
			max={0}
			step={1}
			size={26}
			format={(v) => (v === 0 ? '0' : `${v}`)}
			onchange={(v) => audio.setSub({ octave: v })}
		/>
		<Knob
			label="level"
			value={s.level}
			min={-60}
			max={0}
			step={1}
			size={26}
			unit=" dB"
			onchange={(v) => audio.setSub({ level: v })}
		/>
		<Knob
			label="pan"
			value={s.pan}
			min={-1}
			max={1}
			step={0.01}
			size={26}
			format={(v) => (v === 0 ? 'C' : v > 0 ? `R${Math.round(v * 100)}` : `L${Math.round(-v * 100)}`)}
			onchange={(v) => audio.setSub({ pan: v })}
		/>
	</div>
</section>
