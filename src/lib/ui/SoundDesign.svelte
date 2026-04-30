<script lang="ts">
	import { audio } from '$lib/audio/engine.svelte';
	import Knob from './Knob.svelte';
	import Envelope from './Envelope.svelte';
	import OscCard from './OscCard.svelte';
	import SubOsc from './SubOsc.svelte';
	import NoiseSection from './NoiseSection.svelte';
	import FilterViz from './FilterViz.svelte';

	const p = audio.patch;

	const filterTypes = ['lowpass', 'highpass', 'bandpass', 'notch'] as const;
	const filterLabels: Record<string, string> = {
		lowpass: 'LP',
		highpass: 'HP',
		bandpass: 'BP',
		notch: 'NT'
	};
</script>

<!--
  Two-row layout:
    Row 1: OSC1 | OSC2 | SUB | NOISE
    Row 2: FILTER | AMP ENV
  LFOs / mod envs / routing have moved into the Modulation drawer.
-->
<div class="flex h-full min-h-0 flex-col gap-3">
	<!-- Row 1: oscillators + sub + noise -->
	<div class="grid min-h-0 flex-1 grid-cols-6 gap-3">
		<div class="col-span-2 min-h-0">
			<OscCard which="osc1" />
		</div>
		<div class="col-span-2 min-h-0">
			<OscCard which="osc2" />
		</div>
		<div class="col-span-1 min-h-0">
			<SubOsc />
		</div>
		<div class="col-span-1 min-h-0">
			<NoiseSection />
		</div>
	</div>

	<!-- Row 2: filter (half) + amp envelope (half) -->
	<div class="grid min-h-0 flex-1 grid-cols-2 gap-3">
		<section class="flex min-h-0 flex-col gap-2 rounded-lg border border-surface0 bg-mantle/60 p-3">
			<header class="flex shrink-0 flex-wrap items-center gap-1">
				<span class="h-2 w-2 shrink-0 rounded-full bg-blue"></span>
				<span class="text-xs tracking-widest text-subtext0 uppercase">filter</span>
				<div class="ml-1 flex flex-wrap gap-0.5">
					{#each filterTypes as ft}
						<button
							class="rounded px-1 py-0.5 text-[9px] font-medium tracking-wide uppercase transition-colors"
							class:bg-blue={p.filter.type === ft}
							class:text-base={p.filter.type === ft}
							class:bg-surface0={p.filter.type !== ft}
							class:text-overlay1={p.filter.type !== ft}
							onclick={() => audio.setFilter({ type: ft })}>{filterLabels[ft]}</button
						>
					{/each}
				</div>
				<span class="ml-auto text-[10px] text-overlay1">drag to set cutoff / Q</span>
			</header>

			<FilterViz />

			<div class="grid shrink-0 grid-cols-2 gap-2">
				<div class="flex justify-center">
					<Knob
						label="cutoff"
						target="filter.cutoff"
						value={p.filter.cutoff}
						min={50}
						max={12000}
						step={1}
						curve={3}
						size={32}
						unit=" Hz"
						format={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0))}
						onchange={(v) => audio.setFilter({ cutoff: v })}
					/>
				</div>
				<div class="flex justify-center">
					<Knob
						label="reso"
						target="filter.resonance"
						value={p.filter.resonance}
						min={0.1}
						max={20}
						step={0.1}
						size={32}
						onchange={(v) => audio.setFilter({ resonance: v })}
					/>
				</div>
			</div>
		</section>

		<section class="flex min-h-0 flex-col rounded-lg border border-surface0 bg-mantle/60 p-3">
			<Envelope />
		</section>
	</div>
</div>
