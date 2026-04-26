<script lang="ts">
	import { audio } from '$lib/audio/engine.svelte';
	import { safeValidatePatch } from '$lib/audio/patch';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import PresetCloud from './PresetCloud.svelte';

	// Dynamic CodeMirror import
	let CodeMirror: any = $state(null);
	let jsonLang: any = $state(null);
	let catppuccinTheme: any = $state(null);

	let open = $state(false);
	let text = $state('');
	let error = $state<string | null>(null);
	let dirty = $state(false);

	function format(p: unknown) {
		return JSON.stringify(p, null, 2);
	}

	// Keep the textarea in sync with the patch UNLESS the user is editing.
	// We use an effect to track audio.patch reactively, removing the need for
	// manual subscription management in onMount.
	$effect(() => {
		const currentPatch = audio.patch;
		if (!dirty) {
			const newText = format(currentPatch);
			if (text !== newText) {
				text = newText;
				error = null;
			}
		}
	});

	onMount(() => {
		Promise.all([
			import('svelte-codemirror-editor'),
			import('@codemirror/lang-json'),
			import('@codemirror/language'),
			import('@lezer/highlight')
		]).then(([cmModule, jsModule, languageModule, highlightModule]) => {
			CodeMirror = cmModule.default;
			jsonLang = jsModule.json;

			// Define a strict highlight style using Catppuccin CSS variables
			const { tags: t } = highlightModule;
			catppuccinTheme = languageModule.HighlightStyle.define([
				{ tag: t.propertyName, color: 'var(--ctp-mauve)' },
				{ tag: [t.string, t.special(t.brace)], color: 'var(--ctp-teal)' },
				{ tag: t.number, color: 'var(--ctp-blue)' },
				{ tag: t.bool, color: 'var(--ctp-blue)' },
				{ tag: t.punctuation, color: 'var(--ctp-subtext0)' },
				{ tag: t.bracket, color: 'var(--ctp-text)' },
				{ tag: t.keyword, color: 'var(--ctp-mauve)' }
			]);
		});
	});

	function onInput(val: string) {
		text = val;
		dirty = true;
		// Live-validate so the error indicator reflects current text.
		try {
			const parsed = JSON.parse(text);
			const r = safeValidatePatch(parsed);
			error = r.ok
				? null
				: r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n');
		} catch (err) {
			error = (err as Error).message;
		}
	}

	function apply() {
		try {
			const parsed = JSON.parse(text);
			audio.loadPatch(parsed, 'editor');
			error = null;
			dirty = false;
			text = format(audio.patch);
		} catch (err) {
			if (err instanceof Error) error = err.message;
			else error = String(err);
		}
	}

	function revert() {
		text = format(audio.patch);
		dirty = false;
		error = null;
	}

	function onKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 's') {
			e.preventDefault();
			apply();
		}
	}
</script>

<!-- Backdrop fades in/out independently of the drawer. The preset cloud
     lives inside it so the floating nodes appear in the blurred space. -->
{#if open}
	<div
		class="fixed inset-0 z-20 bg-crust/60 backdrop-blur-sm transition-[opacity,backdrop-filter] duration-300"
		role="presentation"
		onclick={() => (open = false)}
		transition:fade={{ duration: 250, easing: cubicOut }}
	>
		<!-- Cloud lives offset to the right of the drawer. The cloud's nodes
		     stop their own bubbling internally so dragging them doesn't close
		     the drawer; clicking empty space here still hits the backdrop. -->
		<div class="absolute inset-0 left-[min(28rem,90vw)]" role="presentation">
			<PresetCloud active={open} />
		</div>
	</div>
{/if}

<!--
  Drawer + flag move as one unit. The container is anchored to the left edge
  and translated by the drawer width when open. The flag sits at right:0 of
  the container so it's always flush against the drawer's right edge —
  visible at the screen edge when closed, riding the drawer when open.
-->
<div
	class="fixed top-0 left-0 z-30 flex h-full w-[min(28rem,90vw)] -translate-x-full transition-transform duration-[450ms]"
	class:!translate-x-0={open}
	style:transition-timing-function="cubic-bezier(0.22, 1, 0.36, 1)"
>
	<aside
		class="flex h-full w-full flex-col gap-2 border-r border-surface1 bg-mantle p-4 shadow-2xl"
		role="dialog"
		aria-label="patch editor"
		aria-hidden={!open}
	>
		<header class="flex items-center justify-between">
			<h2 class="text-xs tracking-widest text-subtext0 uppercase">patch · json</h2>
			<div class="flex gap-2 text-[11px]">
				<button
					class="rounded border border-surface1 bg-surface0 px-2 py-1 text-subtext1 hover:bg-surface1 hover:text-text disabled:opacity-40"
					disabled={!dirty}
					onclick={revert}
				>
					revert
				</button>
				<button
					class="rounded bg-mauve px-2 py-1 text-base hover:opacity-90 disabled:opacity-40"
					disabled={!dirty || !!error}
					onclick={apply}
				>
					apply
				</button>
			</div>
		</header>

		<div
			class="flex-1 overflow-hidden rounded-md border bg-base text-[11px] focus-within:ring-1 [&_.cm-editor]:h-full [&_.cm-scroller]:h-full [&>div]:h-full"
			class:border-surface1={!error}
			class:focus-within:border-mauve={!error}
			class:focus-within:ring-mauve={!error}
			class:border-red={!!error}
			class:focus-within:border-red={!!error}
			class:focus-within:ring-red={!!error}
			onkeydown={onKeydown}
			role="textbox"
			tabindex="0"
		>
			{#if CodeMirror && jsonLang && catppuccinTheme}
				<CodeMirror
					value={text}
					on:change={(e: any) => onInput(e.detail)}
					lang={jsonLang()}
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
							backgroundColor: 'var(--ctp-surface1)'
						}
					}}
				/>
			{:else}
				<textarea
					value={text}
					oninput={(e) => onInput(e.currentTarget.value)}
					class="h-full w-full resize-none bg-transparent p-3 font-mono outline-none"
				></textarea>
			{/if}
		</div>

		{#if error}
			<pre
				class="max-h-32 overflow-auto rounded-md bg-base p-2 text-[10px] whitespace-pre-wrap text-red">{error}</pre>
		{:else}
			<p class="text-[10px] text-overlay1">
				edit & press <kbd class="rounded bg-surface0 px-1 text-text">⌘/ctrl+s</kbd> to apply
			</p>
		{/if}
	</aside>

	<!-- Flag sits flush against the drawer's right edge; rides with it. -->
	<button
		class="absolute top-4 left-full flex h-24 w-8 cursor-pointer items-center justify-center text-[11px] tracking-widest uppercase transition-colors"
		style:clip-path="polygon(0 0, 100% 15%, 100% 85%, 0 100%)"
		class:bg-mauve={open}
		class:text-base={open}
		class:bg-surface1={!open}
		class:text-subtext1={!open}
		onclick={() => (open = !open)}
		aria-label="toggle patch editor"
		aria-expanded={open}
	>
		<span style:writing-mode="vertical-rl" style:transform="rotate(180deg)">patch</span>
	</button>
</div>
