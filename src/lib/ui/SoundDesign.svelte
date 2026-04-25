<script lang="ts">
	import { audio } from '$lib/audio/engine.svelte';
	import Knob from './Knob.svelte';
	import Envelope from './Envelope.svelte';
	import OscCard from './OscCard.svelte';

	const p = audio.patch;
</script>

<!--
  Serum-inspired layout:
  Top row  : OSC 1 | OSC 2 | FILTER  (sources & shaping live together)
  Bottom   : ENVELOPE (wide, visual)  |  LFO (compact)
-->
<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
	<!-- Row 1 -->
	<OscCard which="osc1" />
	<OscCard which="osc2" />

	<!-- Filter card -->
	<section class="flex flex-col gap-3 rounded-lg border border-surface0 bg-mantle/60 p-3">
		<header class="flex items-center gap-2">
			<span class="h-2 w-2 rounded-full bg-blue"></span>
			<span class="text-xs tracking-widest text-subtext0 uppercase">filter</span>
			<span class="ml-auto text-[10px] text-overlay1">lowpass · 24 dB</span>
		</header>
		<div class="flex justify-around">
			<Knob
				label="cutoff"
				value={p.filter.cutoff}
				min={50}
				max={12000}
				step={1}
				curve={3}
				size={56}
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
				size={56}
				onchange={(v) => audio.setFilter({ resonance: v })}
			/>
		</div>
	</section>

	<!-- Row 2 -->
	<section class="rounded-lg border border-surface0 bg-mantle/60 p-3 md:col-span-2">
		<Envelope />
	</section>

	<!-- LFO card -->
	<section class="flex flex-col gap-3 rounded-lg border border-surface0 bg-mantle/60 p-3">
		<header class="flex items-center gap-2">
			<input
				type="checkbox"
				checked={p.lfo.enabled}
				onchange={(e) => audio.setLFO({ enabled: e.currentTarget.checked })}
				class="accent-mauve"
				aria-label="enable lfo"
			/>
			<span class="text-xs tracking-widest text-subtext0 uppercase">lfo → cutoff</span>
		</header>
		<div class="flex justify-around" class:opacity-50={!p.lfo.enabled}>
			<Knob
				label="rate"
				value={p.lfo.rate}
				min={0.05}
				max={20}
				step={0.05}
				curve={2}
				size={56}
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
				size={56}
				unit=" Hz"
				format={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0))}
				onchange={(v) => audio.setLFO({ depth: v })}
			/>
		</div>
	</section>
</div>
