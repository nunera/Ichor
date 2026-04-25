<script lang="ts">
	import { audio } from '$lib/audio/engine.svelte';
	import { SvelteSet } from 'svelte/reactivity';

	type Props = { octaves?: number };
	let { octaves = 3 }: Props = $props();

	// 12-note row mapped to home-row + qwerty-top-row keybinds. Repeats one
	// octave higher for an upper row of bindings, so two octaves are playable
	// from the keyboard at any time around `octaveBase`.
	const PITCH_CLASSES: { name: string; black: boolean; white: number }[] = [
		{ name: 'C', black: false, white: 0 },
		{ name: 'C#', black: true, white: 1 },
		{ name: 'D', black: false, white: 1 },
		{ name: 'D#', black: true, white: 2 },
		{ name: 'E', black: false, white: 2 },
		{ name: 'F', black: false, white: 3 },
		{ name: 'F#', black: true, white: 4 },
		{ name: 'G', black: false, white: 4 },
		{ name: 'G#', black: true, white: 5 },
		{ name: 'A', black: false, white: 5 },
		{ name: 'A#', black: true, white: 6 },
		{ name: 'B', black: false, white: 6 }
	];

	// Lower row (home + black keys above): C..B at octaveBase
	const LOWER_BIND = ['a', 'w', 's', 'e', 'd', 'f', 't', 'g', 'y', 'h', 'u', 'j'];
	// Upper row: C..B at octaveBase+1
	const UPPER_BIND = ['k', 'o', 'l', 'p', ';', "'", ']', '\\', '', '', '', ''];

	let octaveBase = $state(3); // C3 row + C4 row by default

	type Key = { note: string; midi: number; key: string; black: boolean; white: number };

	const keys = $derived.by<Key[]>(() => {
		const out: Key[] = [];
		for (let o = 0; o < octaves; o++) {
			const oct = (octaveBase ?? 3) + o; // visible octave number
			for (let i = 0; i < 12; i++) {
				const pc = PITCH_CLASSES[i];
				const note = `${pc.name}${oct}`;
				const midi = (oct + 1) * 12 + i;
				const bindArr = o === 0 ? LOWER_BIND : o === 1 ? UPPER_BIND : [];
				const key = bindArr[i] ?? '';
				out.push({
					note,
					midi,
					key,
					black: pc.black,
					white: o * 7 + pc.white
				});
			}
		}
		return out;
	});

	const totalWhites = $derived(octaves * 7);
	const whites = $derived(keys.filter((k) => !k.black));
	const blacks = $derived(keys.filter((k) => k.black));

	// Visual highlights and per-pointer note tracking for glissando.
	const held = new SvelteSet<string>();
	const pointerNote = new Map<number, string>();

	function press(note: string) {
		held.add(note);
		audio.attack(note);
	}

	function release(note: string) {
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

	function shift(delta: number) {
		// Release whatever is currently held by the keyboard binding before
		// shifting, so we never strand a sustaining note.
		panic();
		octaveBase = clamp(octaveBase + delta, 0, 8);
	}

	function clamp(v: number, lo: number, hi: number) {
		return Math.max(lo, Math.min(hi, v));
	}

	async function onKeyDown(e: KeyboardEvent) {
		if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
		if (e.key === 'z') {
			e.preventDefault();
			shift(-1);
			return;
		}
		if (e.key === 'x') {
			e.preventDefault();
			shift(+1);
			return;
		}
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

<div class="flex flex-col gap-2">
	<div class="flex items-center gap-2 text-xs text-subtext0">
		<button
			class="rounded border border-surface1 bg-surface0 px-2 py-1 text-text hover:bg-surface1"
			onclick={() => shift(-1)}
			aria-label="octave down"
		>
			−
		</button>
		<span class="tabular-nums">
			C{octaveBase} – B{octaveBase + octaves - 1}
		</span>
		<button
			class="rounded border border-surface1 bg-surface0 px-2 py-1 text-text hover:bg-surface1"
			onclick={() => shift(+1)}
			aria-label="octave up"
		>
			+
		</button>
		<span class="ml-2 text-overlay1"> z / x to shift </span>
	</div>

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
				class="relative flex flex-1 flex-col justify-end rounded-b-lg border border-surface1 pb-3 text-center text-[10px] shadow-md transition-colors"
				class:bg-base={!active}
				class:text-subtext0={!active}
				class:bg-mauve={active}
				class:text-base={active}
			>
				{#if k.note.startsWith('C')}
					<div class="font-semibold">{k.note}</div>
				{/if}
				{#if k.key}
					<div class="opacity-60">{k.key}</div>
				{/if}
			</div>
		{/each}

		{#each blacks as k (k.note)}
			{@const active = held.has(k.note)}
			{@const leftPct = (k.white / totalWhites) * 100}
			{@const widthPct = (1 / totalWhites) * 0.6 * 100}
			<div
				data-note={k.note}
				class="absolute top-0 flex h-2/3 -translate-x-1/2 flex-col justify-end rounded-b-md border border-crust pb-2 text-center text-[9px] shadow-lg transition-colors"
				class:bg-crust={!active}
				class:text-subtext0={!active}
				class:bg-lavender={active}
				class:text-crust={active}
				style:left="{leftPct}%"
				style:width="{widthPct}%"
			>
				{#if k.key}
					<div>{k.key}</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
