<script lang="ts">
	import { audio } from '$lib/audio/engine.svelte';
	import { dragMod } from './dragMod.svelte';
	import { modTargets } from '$lib/audio/modTargets';
	import LFOWave from './LFOWave.svelte';
	import Knob from './Knob.svelte';
	import { X } from 'lucide-svelte';

	type Props = { which: 'lfo1' | 'lfo2' };
	let { which }: Props = $props();

	const lfo = $derived(audio.patch[which]);
	const label = $derived(which === 'lfo1' ? 'lfo 1' : 'lfo 2');

	const shapes = ['sine', 'square', 'triangle', 'sawtooth'] as const;
	const shapeLabels: Record<string, string> = {
		sine: '∿',
		square: '⊓',
		triangle: '△',
		sawtooth: '⊿'
	};

	function set(p: Parameters<typeof audio.setLFO1>[0]) {
		if (which === 'lfo1') audio.setLFO1(p);
		else audio.setLFO2(p);
	}

	let titleEl: HTMLElement | null = $state(null);

	/* ---- Title-handle drag → arms cable + dragMod ---- */
	function onTitlePointerDown(e: PointerEvent) {
		// Begin a drag from the centre of the title element.
		const rect = titleEl?.getBoundingClientRect();
		if (!rect) return;
		const anchor = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
		const cursor = { x: e.clientX, y: e.clientY };
		dragMod.begin(which, anchor, cursor);
		e.preventDefault();
		// Capture pointer on body so we keep tracking even outside the title.
		window.addEventListener('pointermove', onWinMove);
		window.addEventListener('pointerup', onWinUp, { once: true });
	}

	function onWinMove(e: PointerEvent) {
		dragMod.move({ x: e.clientX, y: e.clientY });
	}

	function onWinUp() {
		window.removeEventListener('pointermove', onWinMove);
		const result = dragMod.end();
		if (result) audio.addRoute(result.lfo, result.target);
	}

	function targetLabel(id: string): string {
		const t = modTargets.get(id);
		return t ? `${t.group} · ${t.label}` : id;
	}
</script>

<section
	class="flex h-full min-h-0 flex-col gap-1.5 overflow-hidden rounded-lg border border-surface0 bg-mantle/60 p-2"
>
	<!-- Header: enable + draggable title + shape pickers -->
	<header class="flex items-center gap-1.5">
		<input
			type="checkbox"
			checked={lfo.enabled}
			onchange={(e) => set({ enabled: e.currentTarget.checked })}
			class="accent-mauve"
			aria-label="enable {label}"
		/>
		<button
			bind:this={titleEl}
			onpointerdown={onTitlePointerDown}
			class="cursor-grab rounded px-1 text-[11px] tracking-widest text-text uppercase select-none active:cursor-grabbing"
			class:bg-mauve={dragMod.source?.lfo === which}
			class:text-base={dragMod.source?.lfo === which}
			title="drag onto a knob to route this LFO"
		>
			{label}
		</button>
		<div class="ml-auto flex gap-0.5">
			{#each shapes as shape (shape)}
				<button
					class="rounded px-1 py-0.5 text-sm transition-colors"
					class:bg-mauve={lfo.shape === shape}
					class:text-base={lfo.shape === shape}
					class:bg-surface0={lfo.shape !== shape}
					class:text-overlay1={lfo.shape !== shape}
					onclick={() => set({ shape })}
					title={shape}>{shapeLabels[shape]}</button
				>
			{/each}
		</div>
	</header>

	<div class="h-8 shrink-0">
		<LFOWave {which} />
	</div>

	<div class="flex shrink-0 items-center gap-2" class:opacity-50={!lfo.enabled}>
		<Knob
			label="rate"
			value={lfo.rate}
			min={0.05}
			max={20}
			step={0.05}
			curve={2}
			size={28}
			unit=" Hz"
			onchange={(v) => set({ rate: v })}
		/>
		<div class="min-w-0 flex-1">
			{#if lfo.routes.length === 0}
				<p class="truncate text-[9px] leading-tight text-overlay1">
					drag the title onto a knob to route
				</p>
			{:else}
				<p class="text-[9px] tracking-wide text-subtext0 uppercase">routes</p>
			{/if}
		</div>
	</div>

	<!-- Routes list (scrolls if many) -->
	{#if lfo.routes.length > 0}
		<div class="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto pr-0.5">
			{#each lfo.routes as r (r.target)}
				{@const t = modTargets.get(r.target)}
				{@const range = t ? t.max - t.min : 1}
				<div class="flex items-center gap-1 rounded bg-base/50 px-1.5 py-1">
					<div class="min-w-0 flex-1">
						<div class="truncate text-[10px] text-text">{targetLabel(r.target)}</div>
						<div class="flex items-center gap-1">
							<label class="flex items-center gap-1 text-[9px] text-overlay1">
								amt
								<input
									type="range"
									min={-range}
									max={range}
									step={range / 200}
									value={r.amount}
									oninput={(e) =>
										audio.updateRoute(which, r.target, {
											amount: e.currentTarget.valueAsNumber
										})}
									class="w-12 accent-yellow"
								/>
							</label>
							<label class="flex items-center gap-1 text-[9px] text-overlay1">
								off
								<input
									type="range"
									min={-range / 2}
									max={range / 2}
									step={range / 200}
									value={r.offset}
									oninput={(e) =>
										audio.updateRoute(which, r.target, {
											offset: e.currentTarget.valueAsNumber
										})}
									class="w-10 accent-blue"
								/>
							</label>
						</div>
					</div>
					<button
						onclick={() => audio.removeRoute(which, r.target)}
						class="rounded p-0.5 text-overlay1 transition-colors hover:bg-surface0 hover:text-red"
						title="remove route"
						aria-label="remove route"
					>
						<X size={10} />
					</button>
				</div>
			{/each}
		</div>
	{/if}
</section>
