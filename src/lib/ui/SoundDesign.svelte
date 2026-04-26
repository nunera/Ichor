<script lang="ts">
	import { audio } from '$lib/audio/engine.svelte';
	import Knob from './Knob.svelte';
	import Envelope from './Envelope.svelte';
	import OscCard from './OscCard.svelte';

	const p = audio.patch;
</script>

<!--
  Three-column horizontal layout, single row, full available height:
    Left   : OSC 1 stacked over OSC 2  (sources)
    Center : ENVELOPE (gets the most width — visual editor benefits from it)
    Right  : FILTER stacked over LFO   (shaping & modulation)

  Every column fills available height so nothing has to scroll.
-->
<div class="grid h-full min-h-0 grid-cols-[16rem_1fr_14rem] gap-3">
	<!-- LEFT: oscillators -->
	<div class="flex min-h-0 flex-col gap-3">
		<div class="min-h-0 flex-1">
			<OscCard which="osc1" />
		</div>
		<div class="min-h-0 flex-1">
			<OscCard which="osc2" />
		</div>
	</div>

	<!-- CENTER: envelope -->
	<section class="flex min-h-0 flex-col rounded-lg border border-surface0 bg-mantle/60 p-3">
		<Envelope />
	</section>

	<!-- RIGHT: filter + lfo -->
	<div class="flex min-h-0 flex-col gap-3">
		<section
			class="flex min-h-0 flex-1 flex-col gap-2 rounded-lg border border-surface0 bg-mantle/60 p-3"
		>
			<header class="flex items-center gap-2">
				<span class="h-2 w-2 rounded-full bg-blue"></span>
				<span class="text-xs tracking-widest text-subtext0 uppercase">filter</span>
			</header>
			<div class="flex flex-1 items-center justify-around gap-1">
				<Knob
					label="cutoff"
					value={p.filter.cutoff}
					min={50}
					max={12000}
					step={1}
					curve={3}
					size={48}
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
					size={48}
					onchange={(v) => audio.setFilter({ resonance: v })}
				/>
			</div>
		</section>

		<section
			class="flex min-h-0 flex-1 flex-col gap-2 rounded-lg border border-surface0 bg-mantle/60 p-3"
		>
			<header class="flex items-center gap-2">
				<input
					type="checkbox"
					checked={p.lfo.enabled}
					onchange={(e) => audio.setLFO({ enabled: e.currentTarget.checked })}
					class="accent-mauve"
					aria-label="enable lfo"
				/>
				<span class="text-xs tracking-widest text-subtext0 uppercase">lfo</span>
			</header>
			<div class="flex flex-1 items-center justify-around gap-1" class:opacity-50={!p.lfo.enabled}>
				<Knob
					label="rate"
					value={p.lfo.rate}
					min={0.05}
					max={20}
					step={0.05}
					curve={2}
					size={48}
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
					size={48}
					unit=" Hz"
					format={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0))}
					onchange={(v) => audio.setLFO({ depth: v })}
				/>
			</div>
		</section>
	</div>
</div>
