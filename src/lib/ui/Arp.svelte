<script lang="ts">
	import { arp, type ArpPattern } from '$lib/audio/arp.svelte';
	import { strudel } from '$lib/audio/strudel.svelte';
	import Knob from './Knob.svelte';
	import { ArrowUpRight } from 'lucide-svelte';

	const patterns: { id: ArpPattern; label: string; title: string }[] = [
		{ id: 'up', label: '↑', title: 'Up' },
		{ id: 'down', label: '↓', title: 'Down' },
		{ id: 'updown', label: '↕', title: 'Up + down' },
		{ id: 'random', label: '?', title: 'Random' }
	];

	function sendToStrudel() {
		const code = arp.toStrudel();
		strudel.code = code;
	}
</script>

<section
	class="flex h-full min-h-0 flex-col gap-1.5 overflow-hidden rounded-lg border border-surface0 bg-mantle/60 p-2"
>
	<header class="flex shrink-0 items-center gap-1.5">
		<button
			class="h-2 w-2 shrink-0 rounded-full transition-colors"
			class:bg-mauve={arp.enabled}
			class:bg-overlay0={!arp.enabled}
			onclick={() => arp.setEnabled(!arp.enabled)}
			aria-label="toggle arpeggiator"
			title="toggle arpeggiator"
		></button>
		<span class="text-[10px] tracking-widest text-subtext0 uppercase">arp</span>
		<button
			class="ml-auto flex items-center gap-0.5 rounded px-1 py-0.5 text-[9px] tracking-wide text-overlay1 uppercase transition-colors hover:bg-surface0 hover:text-text"
			onclick={sendToStrudel}
			title="send current arp pattern to strudel drawer"
		>
			<ArrowUpRight size={10} />
			str
		</button>
	</header>

	<!-- Pattern buttons: 4-up row -->
	<div class="grid shrink-0 grid-cols-4 gap-1" class:opacity-40={!arp.enabled}>
		{#each patterns as p (p.id)}
			<button
				class="rounded py-0.5 text-[11px] font-medium transition-colors"
				class:bg-mauve={arp.pattern === p.id}
				class:text-base={arp.pattern === p.id}
				class:bg-surface0={arp.pattern !== p.id}
				class:text-overlay1={arp.pattern !== p.id}
				onclick={() => arp.setPattern(p.id)}
				title={p.title}>{p.label}</button
			>
		{/each}
	</div>

	<!-- Rate selector: compact pill row -->
	<div class="flex shrink-0 gap-0.5" class:opacity-40={!arp.enabled}>
		{#each arp.RATES as r (r)}
			<button
				class="flex-1 rounded py-0.5 text-[9px] tracking-wide transition-colors"
				class:bg-mauve={arp.rate === r}
				class:text-base={arp.rate === r}
				class:bg-surface0={arp.rate !== r}
				class:text-overlay1={arp.rate !== r}
				onclick={() => arp.setRate(r)}
				title="rate {arp.RATE_LABEL[r]}">{arp.RATE_LABEL[r]}</button
			>
		{/each}
	</div>

	<!-- Bottom row: octaves stepper · gate knob · latch toggle -->
	<div
		class="flex min-h-0 flex-1 items-center justify-between gap-2 pt-1"
		class:opacity-40={!arp.enabled}
	>
		<div class="flex flex-col items-center gap-0.5">
			<div class="flex items-center gap-0.5">
				<button
					class="rounded bg-surface0 px-1 text-[10px] text-text hover:bg-surface1"
					onclick={() => arp.setOctaves(arp.octaves - 1)}
					aria-label="fewer octaves">−</button
				>
				<span class="w-3 text-center text-[10px] text-text tabular-nums">{arp.octaves}</span>
				<button
					class="rounded bg-surface0 px-1 text-[10px] text-text hover:bg-surface1"
					onclick={() => arp.setOctaves(arp.octaves + 1)}
					aria-label="more octaves">+</button
				>
			</div>
			<span class="text-[9px] tracking-wide text-subtext0 lowercase">oct</span>
		</div>

		<div class="flex items-center gap-2">
			<Knob
				label=""
				value={arp.gate}
				min={0.05}
				max={1}
				step={0.01}
				size={32}
				unit=""
				format={() => ''}
				onchange={(v) => arp.setGate(v)}
			/>
			<div class="flex flex-col leading-tight">
				<span class="text-[10px] tracking-wide text-subtext0 lowercase">gate</span>
				<span class="text-[10px] text-overlay1 tabular-nums">{arp.gate.toFixed(2)}</span>
			</div>
		</div>

		<div class="flex flex-col items-center gap-0.5">
			<button
				class="rounded px-1.5 py-0.5 text-[10px] font-medium tracking-wide transition-colors"
				class:bg-mauve={arp.latch}
				class:text-base={arp.latch}
				class:bg-surface0={!arp.latch}
				class:text-overlay1={!arp.latch}
				onclick={() => arp.setLatch(!arp.latch)}
				title="hold pattern after release">LCH</button
			>
			<span class="text-[9px] tracking-wide text-subtext0 lowercase">latch</span>
		</div>
	</div>
</section>
