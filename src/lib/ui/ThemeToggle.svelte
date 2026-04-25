<script lang="ts">
	import { onMount } from 'svelte';

	let theme = $state<'light' | 'dark'>('dark');

	onMount(() => {
		const stored = localStorage.getItem('ichor-theme') as 'light' | 'dark' | null;
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		theme = stored ?? (prefersDark ? 'dark' : 'light');
	});

	$effect(() => {
		if (typeof document === 'undefined') return;
		document.documentElement.classList.toggle('dark', theme === 'dark');
		try {
			localStorage.setItem('ichor-theme', theme);
		} catch {
			/* ignore */
		}
	});

	function toggle() {
		theme = theme === 'dark' ? 'light' : 'dark';
	}
</script>

<button
	onclick={toggle}
	aria-label="Toggle theme"
	class="rounded-md border border-surface1 bg-surface0 px-3 py-1.5 text-xs text-subtext0 transition-colors hover:bg-surface1 hover:text-text"
>
	{theme === 'dark' ? 'mocha' : 'latte'}
</button>
