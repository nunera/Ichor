<script lang="ts">
	import { audio } from '$lib/audio/engine.svelte';
	import Knob from './Knob.svelte';

	const v = $derived(audio.patch.voicing);

	const modes = ['poly', 'mono', 'legato', 'porta', 'scale'] as const;
	const modeLabels: Record<string, string> = {
		poly: 'PLY',
		mono: 'MNO',
		legato: 'LGT',
		porta: 'PRT',
		scale: 'SCL'
	};
	const modeTitle: Record<string, string> = {
		poly: 'Polyphonic',
		mono: 'Monophonic',
		legato: 'Legato (mono + glide)',
		porta: 'Portamento (poly + glide)',
		scale: 'Scaled portamento (glide scales with interval)'
	};

	const glideActive = $derived(v.mode === 'legato' || v.mode === 'porta' || v.mode === 'scale');
</script>

<section class="flex h-full min-h-0 flex-col gap-2 rounded-lg border border-surface0 bg-mantle/60 p-3">
	<header class="flex items-center gap-1.5">
		<span class="h-2 w-2 rounded-full bg-mauve shrink-0"></span>
		<span class="text-xs tracking-widest text-subtext0 uppercase">voice</span>
	</header>

	<!-- Mode buttons -->
	<div class="flex flex-wrap gap-0.5">
		{#each modes as mode}
			<button
				class="flex-1 rounded py-0.5 text-[9px] font-medium uppercase tracking-wide transition-colors"
				class:bg-mauve={v.mode === mode}
				class:text-base={v.mode === mode}
				class:bg-surface0={v.mode !== mode}
				class:text-overlay1={v.mode !== mode}
				onclick={() => audio.setVoicing({ mode })}
				title={modeTitle[mode]}
			>{modeLabels[mode]}</button>
		{/each}
	</div>

	<!-- Glide knob -->
	<div class="flex flex-1 items-center justify-around gap-1" class:opacity-40={!glideActive}>
		<Knob
			label="glide"
			value={v.glide}
			min={0}
			max={2}
			step={0.01}
			curve={2}
			size={34}
			unit=" s"
			format={(val) => val.toFixed(2)}
			onchange={(val) => audio.setVoicing({ glide: val })}
		/>
	</div>
</section>
