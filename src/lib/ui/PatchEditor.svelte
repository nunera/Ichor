<script lang="ts">
	import { audio } from '$lib/audio/engine.svelte';
	import { safeValidatePatch } from '$lib/audio/patch';
	import { onMount } from 'svelte';

	let open = $state(false);
	let text = $state('');
	let error = $state<string | null>(null);
	let dirty = $state(false);

	function format(p: unknown) {
		return JSON.stringify(p, null, 2);
	}

	// Keep the textarea in sync with the patch UNLESS the user is editing.
	// Subscribed to all writes; ignores 'editor' so we never clobber typing.
	onMount(() => {
		text = format(audio.patch);
		const off = audio.subscribe((e) => {
			if (e.source === 'editor') return;
			if (dirty) return; // user has unsaved local edits, don't overwrite
			text = format(audio.patch);
		});
		return off;
	});

	function onInput(e: Event) {
		text = (e.currentTarget as HTMLTextAreaElement).value;
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

<!-- Trapezoid flag pinned to the left edge: tall side flush against the
     screen edge, narrower side into the page. Text rotated 90° so it
     reads vertically along the long edge. -->
<button
	class="fixed top-4 left-0 z-30 flex h-24 w-8 cursor-pointer items-center justify-center text-[11px] tracking-widest uppercase transition-colors"
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

{#if open}
	<!-- Backdrop click closes -->
	<div
		class="fixed inset-0 z-20 bg-crust/60 backdrop-blur-sm"
		role="presentation"
		onclick={() => (open = false)}
	></div>

	<aside
		class="fixed top-0 left-0 z-30 flex h-full w-[min(28rem,90vw)] flex-col gap-2 border-r border-surface1 bg-mantle p-4 pt-16 shadow-2xl"
		role="dialog"
		aria-label="patch editor"
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

		<textarea
			value={text}
			oninput={onInput}
			onkeydown={onKeydown}
			spellcheck="false"
			class="flex-1 resize-none rounded-md border bg-base p-3 font-mono text-[11px] leading-relaxed text-text outline-none focus:ring-1"
			class:border-surface1={!error}
			class:focus:ring-mauve={!error}
			class:border-red={!!error}
			class:focus:ring-red={!!error}
		></textarea>

		{#if error}
			<pre
				class="max-h-32 overflow-auto rounded-md bg-base p-2 text-[10px] whitespace-pre-wrap text-red">{error}</pre>
		{:else}
			<p class="text-[10px] text-overlay1">
				edit & press <kbd class="rounded bg-surface0 px-1 text-text">⌘/ctrl+s</kbd> to apply
			</p>
		{/if}
	</aside>
{/if}
