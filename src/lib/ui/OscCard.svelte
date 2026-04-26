<script lang="ts">
	import { audio, type Waveform } from '$lib/audio/engine.svelte';
	import Knob from './Knob.svelte';
	import Waveform_ from './Waveform.svelte';

	type Props = { which: 'osc1' | 'osc2' };
	let { which }: Props = $props();

	const waves: Waveform[] = ['sine', 'square', 'sawtooth', 'triangle'];
	const osc = $derived(audio.patch[which]);
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
	class="flex h-full min-h-0 flex-col gap-2 rounded-lg border border-surface0 bg-mantle/60 p-3"
	class:opacity-50={!osc.enabled}
>
	<header class="flex items-center gap-2">
		<input
			type="checkbox"
			checked={osc.enabled}
			onchange={(e) => set({ enabled: e.currentTarget.checked })}
			class="accent-mauve"
			aria-label="enable {title}"
		/>
		<span class="text-xs tracking-widest text-subtext0 uppercase">{title}</span>
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

	<!-- All four knobs on one row -->
	<div class="flex items-end justify-around gap-1">
		<Knob
			label="oct"
			value={osc.octave}
			min={-3}
			max={3}
			step={1}
			size={36}
			format={(v) => (v > 0 ? `+${v}` : `${v}`)}
			onchange={(v) => set({ octave: v })}
		/>
		<Knob
			label="semi"
			value={osc.semi}
			min={-12}
			max={12}
			step={1}
			size={36}
			format={(v) => (v > 0 ? `+${v}` : `${v}`)}
			onchange={(v) => set({ semi: v })}
		/>
		<Knob
			label="fine"
			value={osc.fine}
			min={-50}
			max={50}
			step={1}
			size={36}
			unit=" ct"
			onchange={(v) => set({ fine: v })}
		/>
		<Knob
			label="level"
			value={osc.level}
			min={-40}
			max={6}
			step={1}
			size={36}
			unit=" dB"
			onchange={(v) => set({ level: v })}
		/>
	</div>
</section>
