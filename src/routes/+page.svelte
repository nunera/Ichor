<script lang="ts">
	import { audio } from '$lib/audio/engine.svelte';
	import Keyboard from '$lib/ui/Keyboard.svelte';
	import Wheels from '$lib/ui/Wheels.svelte';
	import Voicing from '$lib/ui/Voicing.svelte';
	import Arp from '$lib/ui/Arp.svelte';
	import SoundDesign from '$lib/ui/SoundDesign.svelte';
	import { keyboardState } from '$lib/ui/keyboard.svelte';
	import ThemeToggle from '$lib/ui/ThemeToggle.svelte';
	import Visualizer from '$lib/ui/Visualizer.svelte';
	import PatchEditor from '$lib/ui/PatchEditor.svelte';
	import SessionBadge from '$lib/ui/SessionBadge.svelte';
	import BrowseSessions from '$lib/ui/BrowseSessions.svelte';
	import StrudelDrawer from '$lib/ui/StrudelDrawer.svelte';
	import EffectsDrawer from '$lib/ui/EffectsDrawer.svelte';
	import ModulationDrawer from '$lib/ui/ModulationDrawer.svelte';
	import MIDIIndicator from '$lib/ui/MIDIIndicator.svelte';
	import Guide from '$lib/ui/Guide.svelte';
	import CursorLayer from '$lib/ui/CursorLayer.svelte';
	import Cable from '$lib/ui/Cable.svelte';
	import { dragMod } from '$lib/ui/dragMod.svelte';

	let volume = $state(-12);
	let vizMode = $state<'scope' | 'spectrum'>('scope');

	$effect(() => {
		audio.setVolume(volume);
	});
</script>

<PatchEditor />
<StrudelDrawer />
<EffectsDrawer />
<ModulationDrawer />
<CursorLayer />

{#if dragMod.source}
	<Cable anchor={dragMod.source.anchor} cursor={dragMod.cursor} hot={!!dragMod.hoveredTarget} />
{/if}

<main class="flex h-screen flex-col gap-3 overflow-hidden">
	<!--
	  Header is full-page-width: the visualizer canvas spans edge-to-edge
	  behind the title and controls. Pointer events fall through the canvas
	  to the toggle below.
	-->
	<header
		class="relative flex h-20 shrink-0 items-end justify-between gap-4 overflow-hidden px-6 pl-32"
	>
		<Visualizer mode={vizMode} ambient class="absolute inset-0 h-full w-full" />

		<div class="relative flex items-end gap-4">
			<div class="pb-4.5">
				<h1
					class="border border-mauve/60 bg-base px-3 py-1 text-2xl tracking-[0.15em] text-text"
					style="font-family: 'Oxanium', sans-serif; font-weight: 300;"
				>
					ICHOR
				</h1>
			</div>

			<button
				class="group ml-2 flex items-center gap-1 rounded-full border border-surface1 bg-base/70 px-2 py-1 backdrop-blur-sm transition-colors hover:border-mauve"
				onclick={() => (vizMode = vizMode === 'scope' ? 'spectrum' : 'scope')}
				aria-label="toggle visualizer mode"
				title="toggle scope / spectrum"
			>
				<svg viewBox="0 0 24 8" class="h-2 w-6">
					{#if vizMode === 'scope'}
						<path
							d="M0 4 Q3 0 6 4 T12 4 T18 4 T24 4"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							class="text-mauve"
						/>
					{:else}
						<g class="fill-mauve">
							<rect x="1" y="5" width="2" height="3" />
							<rect x="5" y="2" width="2" height="6" />
							<rect x="9" y="4" width="2" height="4" />
							<rect x="13" y="1" width="2" height="7" />
							<rect x="17" y="3" width="2" height="5" />
							<rect x="21" y="6" width="2" height="2" />
						</g>
					{/if}
				</svg>
				<span class="text-[10px] text-subtext0 group-hover:text-text">{vizMode}</span>
			</button>
		</div>

		<div class="relative flex items-center gap-3 pr-8">
			<Guide />
			<MIDIIndicator />
			<BrowseSessions />
			<SessionBadge />
			<label class="flex items-center gap-2 text-xs text-subtext1">
				master
				<input type="range" min="-40" max="0" step="1" bind:value={volume} class="accent-mauve" />
				<span class="w-12 text-right text-overlay1 tabular-nums">{volume} dB</span>
			</label>
			<ThemeToggle />
		</div>
	</header>

	<!-- Content below the header is centred & capped. -->
	<div class="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col gap-3 px-4 pb-4">
		<div class="min-h-0 flex-1">
			<SoundDesign />
		</div>

		<!-- Performance row: pitch/mod wheels | keyboard | (arp + voicing stacked).
		     All blocks share the keyboard's height (h-32). -->
		<div class="flex items-end gap-3">
			<div class="h-32 shrink-0">
				<Wheels />
			</div>
			<div class="h-32 w-[34rem] min-w-0 shrink-0">
				<Keyboard octaves={2} />
			</div>
			<div class="flex h-32 min-w-0 flex-1 items-stretch gap-3">
				<div class="min-w-0 flex-1">
					<Arp />
				</div>
				<div class="min-w-0 flex-1">
					<Voicing />
				</div>
			</div>
		</div>

		<!-- Footer row: octave shifter inline with the keybind hints. -->
		<footer class="flex items-center gap-3 text-[10px] text-overlay1">
			<div class="flex items-center gap-1.5 text-subtext0">
				<button
					class="rounded border border-surface1 bg-surface0 px-2 py-0.5 text-text hover:bg-surface1"
					onclick={() => keyboardState.shift(-1)}
					aria-label="octave down"
				>
					−
				</button>
				<span class="text-text tabular-nums">
					C{keyboardState.octaveBase} – B{keyboardState.octaveBase + 1}
				</span>
				<button
					class="rounded border border-surface1 bg-surface0 px-2 py-0.5 text-text hover:bg-surface1"
					onclick={() => keyboardState.shift(+1)}
					aria-label="octave up"
				>
					+
				</button>
			</div>

			<span>
				<kbd class="rounded bg-surface0 px-1.5 py-0.5 text-text">a–j</kbd> /
				<kbd class="rounded bg-surface0 px-1.5 py-0.5 text-text">k–'</kbd> play notes ·
				<kbd class="rounded bg-surface0 px-1.5 py-0.5 text-text">z</kbd>
				<kbd class="rounded bg-surface0 px-1.5 py-0.5 text-text">x</kbd> shift octave
			</span>
		</footer>
	</div>
</main>
