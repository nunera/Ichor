<script lang="ts">
	import { audio } from '$lib/audio/engine.svelte';
	import Knob from './Knob.svelte';

	const v = $derived(audio.patch.voicing);

	// 'porta' (poly + glide) is intentionally omitted — Tone.js PolySynth
	// allocates a fresh voice per attack so portamento has nothing to glide
	// from, making true poly portamento not actually work in our engine.
	const modes = ['poly', 'mono', 'legato', 'scale'] as const;
	const modeLabels: Record<string, string> = {
		poly: 'PLY',
		mono: 'MNO',
		legato: 'LGT',
		scale: 'SCL'
	};
	const modeTitle: Record<string, string> = {
		poly: 'Polyphonic',
		mono: 'Monophonic',
		legato: 'Legato (mono + glide)',
		scale: 'Scaled portamento (glide scales with interval)'
	};

	const glideActive = $derived(v.mode === 'legato' || v.mode === 'scale');
</script>

<section
	class="flex h-full min-h-0 flex-col gap-1.5 overflow-hidden rounded-lg border border-surface0 bg-mantle/60 p-2"
>
	<header class="flex shrink-0 items-center gap-1.5">
		<span class="h-2 w-2 shrink-0 rounded-full bg-mauve"></span>
		<span class="text-[10px] tracking-widest text-subtext0 uppercase">voice</span>
		<span class="ml-auto text-[10px] text-overlay1 lowercase">{modeTitle[v.mode]}</span>
	</header>

	<!-- Body: 4 mode pills as a single tall row filling the width, with the
	     glide knob as a hero on the right. Mirrors the Arp panel's rhythm. -->
	<div class="flex min-h-0 flex-1 items-stretch gap-2">
		<div class="grid min-w-0 flex-1 grid-cols-4 gap-1">
			{#each modes as mode}
				<button
					class="rounded text-[11px] font-medium tracking-wide uppercase transition-colors"
					class:bg-mauve={v.mode === mode}
					class:text-base={v.mode === mode}
					class:bg-surface0={v.mode !== mode}
					class:text-overlay1={v.mode !== mode}
					onclick={() => audio.setVoicing({ mode })}
					title={modeTitle[mode]}>{modeLabels[mode]}</button
				>
			{/each}
		</div>

		<div
			class="flex shrink-0 flex-col items-center justify-center gap-0.5"
			class:opacity-40={!glideActive}
		>
			<Knob
				label=""
				target="voicing.glide"
				value={v.glide}
				min={0}
				max={2}
				step={0.01}
				curve={2}
				size={44}
				unit=""
				format={() => ''}
				onchange={(val) => audio.setVoicing({ glide: val })}
			/>
			<span class="text-[9px] tracking-wide text-subtext0 lowercase">glide</span>
			<span class="text-[9px] text-overlay1 tabular-nums">{v.glide.toFixed(2)}s</span>
		</div>
	</div>
</section>
