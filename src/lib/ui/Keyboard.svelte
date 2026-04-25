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

	// Notes currently lit in the UI (one entry per held source: keyboard or pointer).
	const held = new SvelteSet<string>();
	// Maps a pointerId to the note it is currently sounding, for glissando.
	const pointerNote = new Map<number, string>();

	function press(note: string) {
		held.add(note);
		audio.attack(note);
	}

	function release(note: string) {
		// Only remove the visual highlight if no other source still holds the note.
		const stillHeldByPointer = [...pointerNote.values()].includes(note);
		if (!stillHeldByPointer) held.delete(note);
		audio.release(note);
	}

	function noteAt(x: number, y: number): string | null {
		const el = document.elementFromPoint(x, y);
		const keyEl = el?.closest<HTMLElement>('[data-note]');
		return keyEl?.dataset.note ?? null;
	}

	async function onPointerDown(e: PointerEvent) {
		await audio.start();
		const note = noteAt(e.clientX, e.clientY);
		if (!note) return;
		(e.target as Element).setPointerCapture?.(e.pointerId);
		pointerNote.set(e.pointerId, note);
		press(note);
	}

	function onPointerMove(e: PointerEvent) {
		if (!pointerNote.has(e.pointerId)) return;
		const next = noteAt(e.clientX, e.clientY);
		const prev = pointerNote.get(e.pointerId)!;
		if (next === prev) return;
		// Update the map FIRST so `release(prev)` sees the new state
		// when it checks whether any other pointer still holds the note.
		if (next) pointerNote.set(e.pointerId, next);
		else pointerNote.delete(e.pointerId);
		release(prev);
		if (next) press(next);
	}

	function onPointerUp(e: PointerEvent) {
		const note = pointerNote.get(e.pointerId);
		if (!note) return;
		pointerNote.delete(e.pointerId);
		release(note);
	}

	async function onKeyDown(e: KeyboardEvent) {
		if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
		const k = keys.find((x) => x.key === e.key.toLowerCase());
		if (!k) return;
		e.preventDefault();
		await audio.start();
		press(k.note);
	}

	function onKeyUp(e: KeyboardEvent) {
		const k = keys.find((x) => x.key === e.key.toLowerCase());
		if (k) release(k.note);
	}

	function panic() {
		held.clear();
		pointerNote.clear();
		audio.releaseAll();
	}

	function onVisibility() {
		if (document.visibilityState === 'hidden') panic();
	}
</script>

<svelte:window
	onkeydown={onKeyDown}
	onkeyup={onKeyUp}
	onblur={panic}
	onvisibilitychange={onVisibility}
/>

<div
	class="relative flex h-48 w-full touch-none select-none"
	onpointerdown={onPointerDown}
	onpointermove={onPointerMove}
	onpointerup={onPointerUp}
	onpointercancel={onPointerUp}
>
	{#each whites as k (k.note)}
		{@const active = held.has(k.note)}
		<div
			data-note={k.note}
			class="relative flex flex-1 flex-col justify-end rounded-b-lg border border-neutral-700 pb-3 text-center text-xs text-neutral-900 shadow-md transition-colors"
			class:bg-neutral-100={!active}
			class:bg-amber-300={active}
		>
			<div class="font-semibold">{k.note}</div>
			<div class="text-neutral-500">{k.key}</div>
		</div>
	{/each}

	{#each blacks as k (k.note)}
		{@const active = held.has(k.note)}
		{@const leftPct = (k.offset! / whites.length) * 100}
		{@const widthPct = (1 / whites.length) * 0.6 * 100}
		<div
			data-note={k.note}
			class="absolute top-0 flex h-2/3 -translate-x-1/2 flex-col justify-end rounded-b-md border border-black pb-2 text-center text-[10px] shadow-lg transition-colors"
			class:bg-neutral-900={!active}
			class:bg-amber-600={active}
			class:text-neutral-400={!active}
			class:text-neutral-100={active}
			style:left="{leftPct}%"
			style:width="{widthPct}%"
		>
			<div>{k.key}</div>
		</div>
	{/each}
</div>
