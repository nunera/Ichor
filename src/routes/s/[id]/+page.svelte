<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { session } from '$lib/audio/session.svelte';
	import Page from '../../+page.svelte';

	onMount(() => {
		session.connect(page.params.id);
		return () => session.disconnect();
	});
</script>

<Page />
