<script lang="ts">
	import { audio } from '$lib/audio/engine.svelte';
	import { arp } from '$lib/audio/arp.svelte';
	import { keyboardState } from './keyboard.svelte';
	import { SvelteSet } from 'svelte/reactivity';

	type Props = { octaves?: number };
	let { octaves = 2 }: Props = $props();

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

	const octaveBase = $derived(keyboardState.octaveBase);

	type Key = { note: string; midi: number; key: string; black: boolean; white: number };

	const keys = $derived.by<Key[]>(() => {
		const out: Key[] = [];
		for (let o = 0; o < octaves; o++) {
			const oct = octaveBase + o; // visible octave number
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
		arp.hold(note);
	}

	function release(note: string) {
		const stillHeldByPointer = [...pointerNote.values()].includes(note);
		if (!stillHeldByPointer) held.delete(note);
		arp.unhold(note);
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
		keyboardState.shift(delta);
	}

	function isTextTarget(t: EventTarget | null): boolean {
		const el = t as HTMLElement | null;
		if (!el) return false;
		const tag = el.tagName;
		return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable === true;
	}

	async function onKeyDown(e: KeyboardEvent) {
		if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
		if (isTextTarget(e.target)) return;
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
		// Don't gate keyup on isTextTarget — if the user clicks a checkbox or
		// input while holding a key, focus moves to that element and the keyup
		// would otherwise be ignored, leaving the note stuck. We always want
		// to process keyup for any binding we know about.
		const k = keys.find((x) => x.key === e.key.toLowerCase());
		if (k) release(k.note);
	}

	function panic() {
		held.clear();
		pointerNote.clear();
		arp.panic();
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
	<div class="flex items-center gap-2" style="font-size: 10px; color: rgba(255,255,255,0.3);">
		<button class="kbd-btn" onclick={() => shift(-1)} aria-label="octave down">−</button>
		<span style="font-family: 'Fira Code', ui-monospace, monospace; color: rgba(255,255,255,0.5);">
			C{octaveBase} – B{octaveBase + octaves - 1}
		</span>
		<button class="kbd-btn" onclick={() => shift(+1)} aria-label="octave up">+</button>
		<span class="ml-2" style="letter-spacing: 1px;"> z / x to shift </span>
	</div>

	<div
		class="relative flex h-full w-full touch-none select-none"
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointercancel={onPointerUp}
	>
		{#each whites as k (k.note)}
			{@const active = held.has(k.note)}
			<div
				data-note={k.note}
				class="key-natural relative flex flex-1 flex-col justify-end rounded-b-md pb-3 text-center text-[10px]"
				class:active={active}
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
				class="absolute top-0 flex h-2/3 -translate-x-1/2 flex-col justify-end rounded-b-md border border-key-black pb-2 text-center text-[9px] shadow-lg transition-colors"
				class:bg-key-black={!active}
				class:text-key-black-text={!active}
				class:bg-lavender={active}
				class:text-key-black={active}
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

<style>
	/* Octave shift buttons */
	.kbd-btn {
		background: linear-gradient(180deg, #2a2a32 0%, #1e1e24 100%);
		box-shadow:
			inset 0 1px 1px rgba(255, 255, 255, 0.07),
			0 2px 3px rgba(0, 0, 0, 0.5);
		border: 1px solid rgba(0, 0, 0, 0.5);
		border-radius: 4px;
		padding: 2px 8px;
		color: rgba(255, 255, 255, 0.5);
		font-size: 12px;
		cursor: pointer;
		transition: background 0.08s;
	}

	.kbd-btn:hover {
		background: linear-gradient(180deg, #33333b 0%, #26262c 100%);
		color: rgba(255, 255, 255, 0.8);
	}

	/* Natural (formerly white) keys — stealth matte dark */
	.key-natural {
		background: linear-gradient(180deg, #2a2a30 0%, #1e1e24 100%);
		box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.05);
		border-right: 1px solid rgba(0, 0, 0, 0.6);
		border-bottom: 1px solid rgba(0, 0, 0, 0.4);
		color: rgba(255, 255, 255, 0.25);
		transition:
			box-shadow 0.05s,
			border-color 0.05s,
			color 0.05s;
	}

	.key-natural.active {
		border-bottom: 2px solid #a855f7;
		box-shadow:
			inset 0 1px 1px rgba(255, 255, 255, 0.05),
			inset 0 -15px 25px rgba(168, 85, 247, 0.25);
		color: rgba(255, 255, 255, 0.7);
	}

	/* Accidental (formerly black) keys — matte carbon black */
	.key-accidental {
		background: linear-gradient(180deg, #111114 0%, #050505 100%);
		box-shadow:
			0 5px 12px rgba(0, 0, 0, 0.9),
			inset 0 1px 1px rgba(255, 255, 255, 0.02);
		color: rgba(255, 255, 255, 0.15);
		z-index: 10;
		transition:
			box-shadow 0.05s,
			border-color 0.05s,
			color 0.05s;
	}

	.key-accidental.active {
		border-bottom: 2px solid #a855f7;
		box-shadow:
			0 5px 12px rgba(0, 0, 0, 0.9),
			inset 0 -15px 25px rgba(168, 85, 247, 0.25);
		color: rgba(255, 255, 255, 0.6);
	}
</style>
