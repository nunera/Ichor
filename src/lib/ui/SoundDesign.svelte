<script lang="ts">
	import { audio } from '$lib/audio/engine.svelte';
	import Knob from './Knob.svelte';
	import Envelope from './Envelope.svelte';
	import OscCard from './OscCard.svelte';
	import LFOWave from './LFOWave.svelte';
	import SubOsc from './SubOsc.svelte';
	import NoiseSection from './NoiseSection.svelte';
	import Voicing from './Voicing.svelte';

	const p = audio.patch;

	const filterTypes = ['lowpass', 'highpass', 'bandpass', 'notch'] as const;
	const filterLabels: Record<string, string> = { lowpass: 'LP', highpass: 'HP', bandpass: 'BP', notch: 'NT' };

	const lfoShapes = ['sine', 'square', 'triangle', 'sawtooth'] as const;
	const lfoShapeLabels: Record<string, string> = { sine: '∿', square: '⊓', triangle: '△', sawtooth: '⊿' };
</script>

<!--
  6-col grid:
    Row 1: OSC1 (2) | OSC2 (2) | FILTER (1) | [future] (1)
    Row 2: ENVELOPE (4) | LFO+SUB (2)
-->
<div class="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-3" style="grid-template-columns: 1fr 1fr 1fr 1fr 1.08fr 0.92fr;">
	<!-- Row 1 -->
	<div class="col-span-2 min-h-0">
		<OscCard which="osc1" />
	</div>
	<div class="col-span-2 min-h-0">
		<OscCard which="osc2" />
	</div>
	<section class="col-span-1 flex min-h-0 flex-col gap-2 rounded-lg border border-surface0 bg-mantle/60 p-3">
		<header class="flex flex-wrap items-center gap-1">
			<span class="h-2 w-2 rounded-full bg-blue shrink-0"></span>
			<span class="text-xs tracking-widest text-subtext0 uppercase">filter</span>
			<div class="flex gap-0.5 flex-wrap">
				{#each filterTypes as ft}
					<button
						class="rounded px-1 py-0.5 text-[9px] font-medium uppercase tracking-wide transition-colors"
						class:bg-blue={p.filter.type === ft}
						class:text-base={p.filter.type === ft}
						class:bg-surface0={p.filter.type !== ft}
						class:text-overlay1={p.filter.type !== ft}
						onclick={() => audio.setFilter({ type: ft })}
					>{filterLabels[ft]}</button>
				{/each}
			</div>
		</header>
		<div class="flex flex-1 items-center justify-around gap-1">
			<Knob
				label="cutoff"
				value={p.filter.cutoff}
				min={50}
				max={12000}
				step={1}
				curve={3}
				size={34}
				unit=" Hz"
				format={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0))}
				onchange={(v) => audio.setFilter({ cutoff: v })}
			/>
			<Knob
				label="reso"
				value={p.filter.resonance}
				min={0.1}
				max={20}
				step={0.1}
				size={34}
				onchange={(v) => audio.setFilter({ resonance: v })}
			/>
		</div>
	</section>
	<div class="col-span-1 min-h-0"><Voicing /></div>

	<!-- Row 2 -->
	<section
		class="col-span-4 flex min-h-0 flex-col rounded-lg border border-surface0 bg-mantle/60 p-3"
	>
		<Envelope />
	</section>
	<!-- LFO + Sub side-by-side -->
	<div class="col-span-2 flex min-h-0 gap-2">
		<section class="flex min-h-0 flex-1 flex-col gap-2 rounded-lg border border-surface0 bg-mantle/60 p-3">

			<header class="flex items-center gap-2">
				<input
					type="checkbox"
					checked={p.lfo.enabled}
					onchange={(e) => audio.setLFO({ enabled: e.currentTarget.checked })}
					class="accent-mauve"
					aria-label="enable lfo"
				/>
				<span class="text-xs tracking-widest text-subtext0 uppercase">lfo → cutoff</span>
				<!-- LFO shape selector -->
				<div class="ml-auto flex gap-0.5">
					{#each lfoShapes as shape}
						<button
							class="rounded px-1 py-0.5 text-sm transition-colors"
							class:bg-mauve={p.lfo.shape === shape}
							class:text-base={p.lfo.shape === shape}
							class:bg-surface0={p.lfo.shape !== shape}
							class:text-overlay1={p.lfo.shape !== shape}
							onclick={() => audio.setLFO({ shape })}
							title={shape}
						>{lfoShapeLabels[shape]}</button>
					{/each}
				</div>
			</header>
			<div class="h-10 shrink-0">
				<LFOWave />
			</div>
			<div class="flex flex-1 items-center justify-around gap-1" class:opacity-50={!p.lfo.enabled}>
				<Knob
					label="rate"
					value={p.lfo.rate}
					min={0.05}
					max={20}
					step={0.05}
					curve={2}
					size={34}
					unit=" Hz"
					onchange={(v) => audio.setLFO({ rate: v })}
				/>
				<Knob
					label="depth"
					value={p.lfo.depth}
					min={0}
					max={6000}
					step={10}
					curve={2}
					size={34}
					unit=" Hz"
					format={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0))}
					onchange={(v) => audio.setLFO({ depth: v })}
				/>
			</div>
		</section>
		<div class="flex flex-1 min-h-0 flex-col gap-2">
			<div class="flex-1 min-h-0"><SubOsc /></div>
			<div class="flex-1 min-h-0"><NoiseSection /></div>
		</div>
	</div>
</div>
