<script lang="ts">
	import { audio, type Waveform } from '$lib/audio/engine.svelte';
	import Knob from './Knob.svelte';
	import Waveform_ from './Waveform.svelte';

	type Props = { which: 'osc1' | 'osc2' };
	let { which }: Props = $props();

	const waves: Waveform[] = ['sine', 'square', 'sawtooth', 'triangle'];
	const osc = $derived(audio.patch[which]);
	const enabled = $derived(which === 'osc1' ? true : audio.patch.osc2.enabled);
	const title = $derived(which === 'osc1' ? 'osc 1' : 'osc 2');

	function set(p: Record<string, unknown>) {
		if (which === 'osc1') audio.setOsc1(p);
		else audio.setOsc2(p);
	}

	function cycleWave(dir: 1 | -1) {
		const i = waves.indexOf(osc.type);
		const next = waves[(i + dir + waves.length) % waves.length];
		set({ type: next });
	}
</script>

<section
	class="flex flex-col gap-3 rounded-lg border border-surface0 bg-mantle/60 p-3"
	class:opacity-50={!enabled}
>
	<header class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			{#if which === 'osc2'}
				<input
					type="checkbox"
					checked={audio.patch.osc2.enabled}
					onchange={(e) => audio.setOsc2({ enabled: e.currentTarget.checked })}
					class="accent-mauve"
					aria-label="enable osc 2"
				/>
			{:else}
				<span class="h-2 w-2 rounded-full bg-mauve"></span>
			{/if}
			<span class="text-xs tracking-widest text-subtext0 uppercase">{title}</span>
		</div>
	</header>

	<!-- Waveform display + selector -->
	<div class="flex items-center gap-2 rounded-md bg-base/60 p-2">
		<button
			class="rounded px-1 text-overlay1 hover:text-text"
			onclick={() => cycleWave(-1)}
			aria-label="previous waveform">‹</button
		>
		<div class="flex flex-1 flex-col items-center">
			<Waveform_ type={osc.type} class="h-10 w-full" />
			<span class="mt-1 text-[10px] tracking-wide text-subtext0 lowercase">{osc.type}</span>
		</div>
		<button
			class="rounded px-1 text-overlay1 hover:text-text"
			onclick={() => cycleWave(1)}
			aria-label="next waveform">›</button
		>
	</div>

	<!-- Knobs row -->
	<div class="flex justify-around">
		<Knob
			label="level"
			value={osc.level}
			min={-40}
			max={6}
			step={1}
			unit=" dB"
			onchange={(v) => set({ level: v })}
		/>
		{#if which === 'osc2'}
			<Knob
				label="detune"
				value={audio.patch.osc2.detune}
				min={-50}
				max={50}
				step={1}
				unit=" ct"
				onchange={(v) => audio.setOsc2({ detune: v })}
			/>
		{/if}
	</div>
</section>
