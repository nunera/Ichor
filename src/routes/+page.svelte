<script lang="ts">
	import { audio } from '$lib/audio/engine.svelte';
	import Keyboard from '$lib/ui/Keyboard.svelte';
	import SoundDesign from '$lib/ui/SoundDesign.svelte';
	import ThemeToggle from '$lib/ui/ThemeToggle.svelte';

	let volume = $state(-12);

	$effect(() => {
		audio.setVolume(volume);
	});
</script>

<main class="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 p-8">
	<header class="flex items-end justify-between gap-4">
		<div>
			<h1 class="text-3xl tracking-widest text-text lowercase">ichor</h1>
			<p class="text-sm text-subtext0">layer 1 — sound design</p>
		</div>

		<div class="flex items-center gap-6">
			<label class="flex items-center gap-2 text-sm text-subtext1">
				master
				<input type="range" min="-40" max="0" step="1" bind:value={volume} class="accent-mauve" />
				<span class="w-14 text-right text-overlay1 tabular-nums">{volume} dB</span>
			</label>
			<ThemeToggle />
		</div>
	</header>

	<SoundDesign />

	<Keyboard />

	<footer class="text-xs text-overlay1">
		click/drag a key, or press
		<kbd class="rounded bg-surface0 px-1.5 py-0.5 text-text">a w s e d f t g y h u j k</kbd>
	</footer>
</main>
