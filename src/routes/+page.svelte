<script lang="ts">
	import { audio } from '$lib/audio/engine.svelte';
	import Keyboard from '$lib/ui/Keyboard.svelte';
	import SoundDesign from '$lib/ui/SoundDesign.svelte';
	import ThemeToggle from '$lib/ui/ThemeToggle.svelte';
	import Visualizer from '$lib/ui/Visualizer.svelte';
	import PatchEditor from '$lib/ui/PatchEditor.svelte';

	let volume = $state(-12);

	$effect(() => {
		audio.setVolume(volume);
	});
</script>

<PatchEditor />

<main class="mx-auto flex h-screen max-w-7xl flex-col gap-3 overflow-hidden p-4">
	<header class="flex items-end justify-between gap-4 pl-28">
		<div>
			<h1 class="text-2xl tracking-widest text-text lowercase">ichor</h1>
			<p class="text-xs text-subtext0">layer 1 — sound design</p>
		</div>

		<div class="flex items-center gap-6">
			<label class="flex items-center gap-2 text-xs text-subtext1">
				master
				<input type="range" min="-40" max="0" step="1" bind:value={volume} class="accent-mauve" />
				<span class="w-12 text-right text-overlay1 tabular-nums">{volume} dB</span>
			</label>
			<ThemeToggle />
		</div>
	</header>

	<!-- Sound design takes the remaining vertical space and lays out its
	     cards in a 4-col / 2-row grid so nothing has to scroll. -->
	<div class="min-h-0 flex-1">
		<SoundDesign />
	</div>

	<!-- Visualizer = horizontal strip above the keyboard. -->
	<div class="h-28 shrink-0">
		<Visualizer />
	</div>

	<Keyboard octaves={3} />

	<footer class="text-[10px] text-overlay1">
		<kbd class="rounded bg-surface0 px-1.5 py-0.5 text-text">a–j</kbd> /
		<kbd class="rounded bg-surface0 px-1.5 py-0.5 text-text">k–'</kbd> play notes ·
		<kbd class="rounded bg-surface0 px-1.5 py-0.5 text-text">z</kbd>
		<kbd class="rounded bg-surface0 px-1.5 py-0.5 text-text">x</kbd> shift octave
	</footer>
</main>
