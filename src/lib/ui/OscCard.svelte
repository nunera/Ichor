<script lang="ts">
	import { audio, type Waveform } from '$lib/audio/engine.svelte';
	import Knob from './Knob.svelte';
	import Waveform_ from './Waveform.svelte';

	type Props = { which: 'osc1' | 'osc2' };
	let { which }: Props = $props();

	const waves: Waveform[] = ['sine', 'square', 'sawtooth', 'triangle', 'pulse'];
	const synthTypes = [
		{ id: 'basic', label: 'BASIC', title: 'Subtractive (oscillator + filter)' },
		{ id: 'fm', label: 'FM', title: 'Frequency modulation (DX-style)' },
		{ id: 'am', label: 'AM', title: 'Amplitude modulation (bell-like)' },
		{ id: 'pluck', label: 'PLUCK', title: 'Karplus-Strong physical string' }
	] as const;

	const osc = $derived(audio.patch[which]);
	const title = $derived(which === 'osc1' ? 'osc 1' : 'osc 2');
	const isPluck = $derived(osc.synthType === 'pluck');
	const isFM = $derived(osc.synthType === 'fm');
	const isAM = $derived(osc.synthType === 'am');
	const usesCarrier = $derived(osc.synthType === 'basic' || isFM || isAM);

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
	class="flex h-full min-h-0 flex-col gap-1 overflow-hidden rounded-lg border border-surface0 bg-mantle/60 p-2"
	class:opacity-50={!osc.enabled}
>
	<header class="flex shrink-0 items-center gap-2">
		<input
			type="checkbox"
			checked={osc.enabled}
			onchange={(e) => set({ enabled: e.currentTarget.checked })}
			class="accent-mauve"
			aria-label="enable {title}"
		/>
		<span class="text-xs tracking-widest text-subtext0 uppercase">{title}</span>

		<!-- Synth engine selector -->
		<div class="ml-auto flex gap-0.5">
			{#each synthTypes as st}
				<button
					class="rounded px-1.5 py-0.5 text-[9px] font-medium tracking-wide uppercase transition-colors"
					class:bg-mauve={osc.synthType === st.id}
					class:text-base={osc.synthType === st.id}
					class:bg-surface0={osc.synthType !== st.id}
					class:text-overlay1={osc.synthType !== st.id}
					onclick={() => set({ synthType: st.id })}
					title={st.title}>{st.label}</button
				>
			{/each}
		</div>
	</header>

	<!-- Waveform display + selector. For Pluck we replace with a string visual. -->
	<div class="flex shrink-0 items-center gap-2 rounded-md bg-base/60 p-1.5">
		{#if usesCarrier}
			<button
				class="rounded px-1 text-overlay1 hover:text-text"
				onclick={() => cycleWave(-1)}
				aria-label="previous waveform">‹</button
			>
			<div class="flex flex-1 flex-col items-center">
				<Waveform_ type={osc.type} width={osc.width} class="h-8 w-full" />
				<span class="mt-0.5 text-[10px] tracking-wide text-subtext0 lowercase">
					{#if isFM}fm carrier — {osc.type}
					{:else if isAM}am carrier — {osc.type}
					{:else}{osc.type}{/if}
				</span>
			</div>
			<button
				class="rounded px-1 text-overlay1 hover:text-text"
				onclick={() => cycleWave(1)}
				aria-label="next waveform">›</button
			>
		{:else if isPluck}
			<!-- Stylised string for pluck mode: a wavy line that quickly damps. -->
			<div class="flex flex-1 flex-col items-center">
				<svg viewBox="0 0 120 40" preserveAspectRatio="none" class="h-8 w-full">
					<path
						d="M 0 20 Q 15 4 30 20 T 60 20 T 90 20 T 120 20"
						class="stroke-mauve"
						stroke-width="1.5"
						fill="none"
						opacity={(1 - osc.pluckAttack) * 0.4 + 0.4}
					/>
					<line x1="0" y1="20" x2="120" y2="20" class="stroke-surface1" stroke-width="0.5" />
				</svg>
				<span class="mt-0.5 text-[10px] tracking-wide text-subtext0 lowercase">karplus-strong</span>
			</div>
		{/if}
	</div>

	{#if osc.synthType === 'basic'}
		<!-- BASIC: full subtractive controls -->
		<div class="flex shrink-0 items-end justify-around gap-1">
			<Knob
				label="oct"
				value={osc.octave}
				min={-3}
				max={3}
				step={1}
				size={28}
				format={(v) => (v > 0 ? `+${v}` : `${v}`)}
				onchange={(v) => set({ octave: v })}
			/>
			<Knob
				label="semi"
				value={osc.semi}
				min={-12}
				max={12}
				step={1}
				size={28}
				format={(v) => (v > 0 ? `+${v}` : `${v}`)}
				onchange={(v) => set({ semi: v })}
			/>
			<Knob
				label="level"
				value={osc.level}
				min={-40}
				max={6}
				step={1}
				size={28}
				unit=" dB"
				onchange={(v) => set({ level: v })}
			/>
			<Knob
				label="uni"
				value={osc.unison}
				min={1}
				max={8}
				step={1}
				size={28}
				format={(v) => `${v}v`}
				onchange={(v) => set({ unison: v })}
			/>
		</div>
		<div class="flex shrink-0 items-end justify-around gap-1">
			<Knob
				label="fine"
				value={osc.fine}
				min={-50}
				max={50}
				step={1}
				size={28}
				unit=" ct"
				onchange={(v) => set({ fine: v })}
			/>
			<div class:opacity-30={osc.unison <= 1 || osc.type === 'pulse'}>
				<Knob
					label="spread"
					value={osc.spread}
					min={0}
					max={200}
					step={1}
					size={28}
					unit=" ct"
					onchange={(v) => set({ spread: v })}
				/>
			</div>
			<div class:opacity-30={osc.type !== 'pulse'}>
				<Knob
					label="width"
					value={osc.width}
					min={0}
					max={1}
					step={0.01}
					size={28}
					format={(v) => `${Math.round(v * 100)}%`}
					onchange={(v) => set({ width: v })}
				/>
			</div>
		</div>
	{:else if isFM || isAM}
		<!-- FM / AM: pitch + level + harmonicity (+ modIndex for FM) -->
		<div class="flex shrink-0 items-end justify-around gap-1">
			<Knob
				label="oct"
				value={osc.octave}
				min={-3}
				max={3}
				step={1}
				size={28}
				format={(v) => (v > 0 ? `+${v}` : `${v}`)}
				onchange={(v) => set({ octave: v })}
			/>
			<Knob
				label="semi"
				value={osc.semi}
				min={-12}
				max={12}
				step={1}
				size={28}
				format={(v) => (v > 0 ? `+${v}` : `${v}`)}
				onchange={(v) => set({ semi: v })}
			/>
			<Knob
				label="level"
				value={osc.level}
				min={-40}
				max={6}
				step={1}
				size={28}
				unit=" dB"
				onchange={(v) => set({ level: v })}
			/>
			<Knob
				label="fine"
				value={osc.fine}
				min={-50}
				max={50}
				step={1}
				size={28}
				unit=" ct"
				onchange={(v) => set({ fine: v })}
			/>
		</div>
		<div class="flex shrink-0 items-end justify-around gap-1">
			<Knob
				label="harm"
				value={osc.harmonicity}
				min={0.1}
				max={20}
				step={0.01}
				curve={2}
				size={28}
				format={(v) => v.toFixed(2)}
				onchange={(v) => set({ harmonicity: v })}
			/>
			{#if isFM}
				<Knob
					label="index"
					value={osc.modIndex}
					min={0}
					max={50}
					step={0.1}
					curve={2}
					size={28}
					format={(v) => v.toFixed(1)}
					onchange={(v) => set({ modIndex: v })}
				/>
			{/if}
		</div>
	{:else if isPluck}
		<!-- PLUCK: pitch + level + attack noise + dampening -->
		<div class="flex shrink-0 items-end justify-around gap-1">
			<Knob
				label="oct"
				value={osc.octave}
				min={-3}
				max={3}
				step={1}
				size={28}
				format={(v) => (v > 0 ? `+${v}` : `${v}`)}
				onchange={(v) => set({ octave: v })}
			/>
			<Knob
				label="semi"
				value={osc.semi}
				min={-12}
				max={12}
				step={1}
				size={28}
				format={(v) => (v > 0 ? `+${v}` : `${v}`)}
				onchange={(v) => set({ semi: v })}
			/>
			<Knob
				label="level"
				value={osc.level}
				min={-40}
				max={6}
				step={1}
				size={28}
				unit=" dB"
				onchange={(v) => set({ level: v })}
			/>
			<Knob
				label="fine"
				value={osc.fine}
				min={-50}
				max={50}
				step={1}
				size={28}
				unit=" ct"
				onchange={(v) => set({ fine: v })}
			/>
		</div>
		<div class="flex shrink-0 items-end justify-around gap-1">
			<Knob
				label="pluck"
				value={osc.pluckAttack}
				min={0}
				max={1}
				step={0.01}
				size={28}
				format={(v) => `${Math.round(v * 100)}%`}
				onchange={(v) => set({ pluckAttack: v })}
			/>
			<Knob
				label="damp"
				value={osc.pluckDamp}
				min={500}
				max={7000}
				step={10}
				curve={2}
				size={28}
				unit=" Hz"
				format={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${Math.round(v)}`)}
				onchange={(v) => set({ pluckDamp: v })}
			/>
			<Knob
				label="reso"
				value={osc.pluckResonance}
				min={0}
				max={0.99}
				step={0.01}
				size={28}
				format={(v) => `${Math.round(v * 100)}%`}
				onchange={(v) => set({ pluckResonance: v })}
			/>
		</div>
	{/if}
</section>
