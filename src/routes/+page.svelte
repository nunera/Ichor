<script lang="ts">
	import { audio, type Waveform } from '$lib/audio/engine.svelte';
	import Keyboard from '$lib/ui/Keyboard.svelte';

	let waveform = $state<Waveform>('sine');
	let volume = $state(-12);

	$effect(() => {
		audio.setWaveform(waveform);
	});

	$effect(() => {
		audio.setVolume(volume);
	});
</script>

<main class="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 p-8 text-neutral-200">
	<header>
		<h1 class="text-3xl tracking-widest lowercase">ichor</h1>
		<p class="text-sm text-neutral-500">layer 0 — playable instrument</p>
	</header>

	<section class="flex flex-wrap items-center gap-6">
		<label class="flex items-center gap-2 text-sm">
			waveform
			<select
				bind:value={waveform}
				class="rounded bg-neutral-800 px-2 py-1 text-neutral-100"
			>
				<option value="sine">sine</option>
				<option value="square">square</option>
				<option value="sawtooth">saw</option>
				<option value="triangle">triangle</option>
			</select>
		</label>

		<label class="flex items-center gap-2 text-sm">
			volume
			<input type="range" min="-40" max="0" step="1" bind:value={volume} />
			<span class="w-12 text-right tabular-nums">{volume} dB</span>
		</label>
	</section>

	<Keyboard />

	<footer class="text-xs text-neutral-600">
		click a key or press <kbd>a w s e d f t g y h u j k</kbd>
	</footer>
</main>
