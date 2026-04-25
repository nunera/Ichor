<script lang="ts">
	import { audio } from '$lib/audio/engine.svelte';
	import { SvelteSet } from 'svelte/reactivity';

	type Key = { note: string; key: string; black?: boolean; offset?: number };

	// One octave, C4–C5. White keys laid out in flow; black keys absolutely
	// positioned via `offset` (in white-key units from the left edge).
	const keys: Key[] = [
		{ note: 'C4', key: 'a' },
		{ note: 'C#4', key: 'w', black: true, offset: 1 },
		{ note: 'D4', key: 's' },
		{ note: 'D#4', key: 'e', black: true, offset: 2 },
		{ note: 'E4', key: 'd' },
		{ note: 'F4', key: 'f' },
		{ note: 'F#4', key: 't', black: true, offset: 4 },
		{ note: 'G4', key: 'g' },
		{ note: 'G#4', key: 'y', black: true, offset: 5 },
		{ note: 'A4', key: 'h' },
		{ note: 'A#4', key: 'u', black: true, offset: 6 },
		{ note: 'B4', key: 'j' },
		{ note: 'C5', key: 'k' }
	];

	const whites = keys.filter((k) => !k.black);
	const blacks = keys.filter((k) => k.black);

	const held = new SvelteSet<string>();

	async function press(note: string) {
		await audio.start();
		if (held.has(note)) return;
		held.add(note);
		audio.attack(note);
	}

	function release(note: string) {
		if (!held.delete(note)) return;
		audio.release(note);
	}

	function onKeyDown(e: KeyboardEvent) {
		if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
		const k = keys.find((x) => x.key === e.key.toLowerCase());
		if (k) {
			e.preventDefault();
			press(k.note);
		}
	}

	function onKeyUp(e: KeyboardEvent) {
		const k = keys.find((x) => x.key === e.key.toLowerCase());
		if (k) release(k.note);
	}
</script>

<svelte:window onkeydown={onKeyDown} onkeyup={onKeyUp} />

<div class="relative flex h-48 w-full select-none">
	{#each whites as k (k.note)}
		{@const active = held.has(k.note)}
		<button
			class="relative flex flex-1 flex-col justify-end rounded-b-lg border border-neutral-700 pb-3 text-center text-xs text-neutral-900 shadow-md transition-colors"
			class:bg-neutral-100={!active}
			class:bg-amber-300={active}
			onpointerdown={(e) => {
				e.currentTarget.setPointerCapture(e.pointerId);
				press(k.note);
			}}
			onpointerup={() => release(k.note)}
			onpointercancel={() => release(k.note)}
			onpointerleave={() => release(k.note)}
		>
			<div class="font-semibold">{k.note}</div>
			<div class="text-neutral-500">{k.key}</div>
		</button>
	{/each}

	{#each blacks as k (k.note)}
		{@const active = held.has(k.note)}
		{@const leftPct = (k.offset! / whites.length) * 100}
		{@const widthPct = (1 / whites.length) * 0.6 * 100}
		<button
			class="absolute top-0 flex h-2/3 -translate-x-1/2 flex-col justify-end rounded-b-md border border-black pb-2 text-center text-[10px] shadow-lg transition-colors"
			class:bg-neutral-900={!active}
			class:bg-amber-600={active}
			class:text-neutral-400={!active}
			class:text-neutral-100={active}
			style:left="{leftPct}%"
			style:width="{widthPct}%"
			onpointerdown={(e) => {
				e.currentTarget.setPointerCapture(e.pointerId);
				press(k.note);
			}}
			onpointerup={() => release(k.note)}
			onpointercancel={() => release(k.note)}
			onpointerleave={() => release(k.note)}
		>
			<div>{k.key}</div>
		</button>
	{/each}
</div>
