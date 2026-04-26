<script lang="ts">
	import { onMount } from 'svelte';

	type Theme = 'latte' | 'mocha' | 'sky';
	const themes: Theme[] = ['latte', 'mocha', 'sky'];

	let theme = $state<Theme>('mocha');

	onMount(() => {
		const stored = localStorage.getItem('ichor-theme') as Theme | null;
		if (stored && themes.includes(stored)) {
			theme = stored;
		} else {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			theme = prefersDark ? 'mocha' : 'latte';
		}
	});

	$effect(() => {
		if (typeof document === 'undefined') return;
		const cl = document.documentElement.classList;
		// "dark" enables the dark Catppuccin palette; "sky" additionally
		// remaps the accent. Keep both in sync with `theme`.
		cl.toggle('dark', theme === 'mocha' || theme === 'sky');
		cl.toggle('sky', theme === 'sky');
		try {
			localStorage.setItem('ichor-theme', theme);
		} catch {
			/* ignore */
		}
	});
</script>

<label class="flex items-center gap-2 text-xs text-subtext1">
	theme
	<select
		bind:value={theme}
		class="rounded-md border border-surface1 bg-surface0 px-2 py-1 text-text outline-none focus:border-mauve"
	>
		{#each themes as t (t)}
			<option value={t}>{t}</option>
		{/each}
	</select>
</label>
