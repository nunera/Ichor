<script lang="ts">
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { strudel } from '$lib/audio/strudel.svelte';

	// Use dynamic import for CodeMirror to prevent SSR issues
	import { onMount } from 'svelte';

	let open = $state(false);
	let CodeMirror: any = $state(null);
	let javascript: any = $state(null);
	let catppuccinTheme: any = $state(null);

	onMount(async () => {
		const [cmModule, jsModule, languageModule, highlightModule] = await Promise.all([
			import('svelte-codemirror-editor'),
			import('@codemirror/lang-javascript'),
			import('@codemirror/language'),
			import('@lezer/highlight')
		]);
		CodeMirror = cmModule.default;
		javascript = jsModule.javascript;

		const { tags: t } = highlightModule;
		catppuccinTheme = languageModule.HighlightStyle.define([
			{ tag: t.propertyName, color: 'var(--ctp-mauve)' },
			{ tag: t.variableName, color: 'var(--ctp-text)' },
			{ tag: [t.string, t.special(t.brace)], color: 'var(--ctp-teal)' },
			{ tag: t.number, color: 'var(--ctp-blue)' },
			{ tag: t.bool, color: 'var(--ctp-blue)' },
			{ tag: t.punctuation, color: 'var(--ctp-subtext0)' },
			{ tag: t.bracket, color: 'var(--ctp-text)' },
			{ tag: t.keyword, color: 'var(--ctp-mauve)' }
		]);
	});

	async function play() {
		await strudel.play();
	}
	function pause() {
		strudel.pause();
	}
	function stop() {
		strudel.stop();
	}
</script>

<!-- Backdrop fades; clicking it closes the drawer. -->
{#if open}
	<div
		class="fixed inset-0 z-20 bg-crust/60 backdrop-blur-sm transition-[opacity,backdrop-filter] duration-300"
		role="presentation"
		onclick={() => (open = false)}
		transition:fade={{ duration: 250, easing: cubicOut }}
	></div>
{/if}

<!--
  Mirror of the patch drawer on the right edge. Anchored to the right side
  and slides in by translating positive-X off-screen → 0.
-->
<div
	class="fixed top-0 right-0 z-30 flex h-full w-[min(32rem,90vw)] translate-x-full transition-transform duration-[450ms]"
	class:!translate-x-0={open}
	style:transition-timing-function="cubic-bezier(0.22, 1, 0.36, 1)"
>
	<!-- Flag on the LEFT edge of this container (its outer-facing edge),
	     so it's flush with the screen edge when the drawer is closed. -->
	<button
		class="absolute top-4 right-full flex h-24 w-8 cursor-pointer items-center justify-center text-[11px] tracking-widest uppercase transition-colors"
		style:clip-path="polygon(100% 0, 0 15%, 0 85%, 100% 100%)"
		class:bg-mauve={open}
		class:text-base={open}
		class:bg-surface1={!open}
		class:text-subtext1={!open}
		onclick={() => (open = !open)}
		aria-label="toggle strudel"
		aria-expanded={open}
	>
		<span style:writing-mode="vertical-rl">strudel</span>
	</button>

	<aside
		class="flex h-full w-full flex-col gap-2 border-l border-surface1 bg-mantle p-4 shadow-2xl"
		role="dialog"
		aria-label="strudel"
		aria-hidden={!open}
	>
		<header class="flex items-center justify-between">
			<h2 class="text-xs tracking-widest text-subtext0 uppercase">strudel</h2>

			<div class="flex items-center gap-1 text-[11px]">
				<button
					class="rounded bg-mauve px-3 py-1 text-base transition-opacity hover:opacity-90"
					onclick={play}
					title="play"
				>
					▶ play
				</button>
				<button
					class="rounded border border-surface1 bg-surface0 px-2 py-1 text-subtext1 transition-colors hover:bg-surface1 hover:text-text"
					onclick={pause}
					disabled={!strudel.playing}
					title="pause"
				>
					⏸
				</button>
				<button
					class="rounded border border-surface1 bg-surface0 px-2 py-1 text-subtext1 transition-colors hover:bg-surface1 hover:text-red"
					onclick={stop}
					title="stop"
				>
					⏹
				</button>
			</div>
		</header>

		<div class="flex items-center gap-2 text-[10px] text-overlay1">
			<span class="relative flex h-2 w-2">
				{#if strudel.playing}
					<span
						class="absolute inline-flex h-full w-full animate-ping rounded-full bg-mauve opacity-60"
					></span>
				{/if}
				<span
					class="relative inline-flex h-2 w-2 rounded-full"
					class:bg-mauve={strudel.playing}
					class:bg-overlay0={!strudel.playing}
				></span>
			</span>
			{strudel.playing ? 'playing' : strudel.loaded ? 'idle' : 'not loaded'}
			<span class="ml-auto text-overlay1"
				>uses <code class="text-text">.s("ichor")</code> to play through this synth</span
			>
		</div>

		<div
			class="flex-1 overflow-hidden rounded-md border border-surface1 bg-base text-[12px] focus-within:border-mauve focus-within:ring-1 focus-within:ring-mauve [&_.cm-editor]:h-full [&_.cm-scroller]:h-full [&>div]:h-full"
			onkeydown={(e) => {
				if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
					e.preventDefault();
					play();
				}
			}}
			role="textbox"
			tabindex="0"
		>
			{#if CodeMirror && javascript && catppuccinTheme}
				<CodeMirror
					bind:value={strudel.code}
					lang={javascript()}
					syntaxHighlighting={{ highlighter: catppuccinTheme, fallback: true }}
					styles={{
						'&': {
							backgroundColor: 'transparent',
							color: 'var(--ctp-text)'
						},
						'.cm-scroller': {
							fontFamily: 'var(--font-mono, monospace)',
							overflow: 'auto'
						},
						'.cm-content': {
							minHeight: '100%',
							caretColor: 'var(--ctp-mauve)'
						},
						'.cm-gutters': {
							backgroundColor: 'transparent',
							color: 'var(--ctp-subtext0)',
							borderRight: '1px solid var(--ctp-surface1)'
						},
						'.cm-activeLine, .cm-activeLineGutter': {
							backgroundColor: 'var(--ctp-surface0) !important'
						},
						'.cm-cursor, .cm-dropCursor': {
							borderLeftColor: 'var(--ctp-mauve) !important'
						},
						'.cm-selectionMatch': {
							backgroundColor: 'var(--ctp-surface1) !important'
						}
					}}
				/>
			{:else}
				<textarea
					bind:value={strudel.code}
					oninput={(e) => strudel.setCode(e.currentTarget.value)}
					class="h-full w-full resize-none bg-transparent p-3 font-mono outline-none"
				></textarea>
			{/if}
		</div>

		{#if strudel.error}
			<pre
				class="max-h-32 overflow-auto rounded-md bg-base p-2 text-[10px] whitespace-pre-wrap text-red">{strudel.error}</pre>
		{:else}
			<p class="text-[10px] text-overlay1">
				edit & press <kbd class="rounded bg-surface0 px-1 text-text">play</kbd>. patterns trigger
				notes through the active patch.
			</p>
		{/if}
	</aside>
</div>
