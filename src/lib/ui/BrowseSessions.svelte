<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	type Listing = { id: string; name?: string; peers: number; updatedAt: number };

	let open = $state(false);
	let loading = $state(false);
	let sessions = $state<Listing[]>([]);
	let error = $state<string | null>(null);
	let pollTimer: ReturnType<typeof setInterval> | null = null;

	async function load() {
		loading = true;
		error = null;
		try {
			const res = await fetch('/api/sessions');
			if (!res.ok) throw new Error('failed');
			sessions = (await res.json()) as Listing[];
		} catch {
			error = 'could not load sessions';
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		if (open) {
			load();
			pollTimer = setInterval(load, 5_000);
		} else {
			if (pollTimer) clearInterval(pollTimer);
			pollTimer = null;
		}
	});

	onMount(() => () => {
		if (pollTimer) clearInterval(pollTimer);
	});

	async function join(id: string) {
		open = false;
		await goto(`/s/${id}`);
	}

	function ago(ts: number): string {
		const d = Math.max(0, Date.now() - ts);
		if (d < 60_000) return `${Math.floor(d / 1000)}s`;
		if (d < 3_600_000) return `${Math.floor(d / 60_000)}m`;
		return `${Math.floor(d / 3_600_000)}h`;
	}
</script>

<button
	class="rounded-full border border-surface1 bg-base/70 px-3 py-1 text-[10px] text-subtext1 backdrop-blur-sm transition-colors hover:border-mauve hover:text-text"
	onclick={() => (open = !open)}
	aria-expanded={open}
>
	browse
</button>

{#if open}
	<div
		class="fixed inset-0 z-40 flex items-start justify-center bg-crust/60 p-8 pt-24 backdrop-blur-sm"
		role="presentation"
		onclick={() => (open = false)}
		transition:fade={{ duration: 200, easing: cubicOut }}
	>
		<div
			class="w-full max-w-md rounded-lg border border-surface1 bg-mantle p-4 shadow-2xl"
			role="dialog"
			aria-label="browse sessions"
			onclick={(e) => e.stopPropagation()}
			transition:scale={{ duration: 220, start: 0.95, easing: cubicOut }}
		>
			<header class="mb-3 flex items-baseline justify-between">
				<h2 class="text-xs tracking-widest text-subtext0 uppercase">live sessions</h2>
				<button
					class="text-[10px] text-subtext1 transition-colors hover:text-text"
					onclick={load}
					disabled={loading}
				>
					{loading ? 'loading…' : 'refresh'}
				</button>
			</header>

			{#if error}
				<p class="text-[11px] text-red">{error}</p>
			{:else if sessions.length === 0}
				<p class="text-[11px] text-overlay1">
					no public sessions right now. start one and broadcast it to appear here.
				</p>
			{:else}
				<ul class="flex flex-col gap-1">
					{#each sessions as s (s.id)}
						<li>
							<button
								class="flex w-full items-center justify-between rounded border border-transparent bg-surface0 px-3 py-2 text-left text-xs transition-colors hover:border-mauve hover:bg-surface1"
								onclick={() => join(s.id)}
							>
								<span class="flex flex-col">
									<span class="text-text">{s.name ?? s.id}</span>
									<span class="text-[10px] text-overlay1">
										{s.id} · updated {ago(s.updatedAt)} ago
									</span>
								</span>
								<span class="flex items-center gap-1 text-[10px] text-subtext1">
									<span class="h-1.5 w-1.5 rounded-full bg-green"></span>
									{s.peers}
								</span>
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
{/if}
