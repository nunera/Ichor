<script lang="ts">
	import { onMount } from 'svelte';
	import { session } from '$lib/audio/session.svelte';

	// Stale cursors get removed locally after this long with no update.
	const STALE_MS = 4000;
	let now = $state(Date.now());

	onMount(() => {
		// Track local pointer and broadcast normalized 0..1 coordinates.
		function onMove(e: PointerEvent) {
			session.sendCursor(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
		}
		window.addEventListener('pointermove', onMove);

		// Sweep for stale cursors a few times a second.
		const tick = setInterval(() => (now = Date.now()), 500);

		return () => {
			window.removeEventListener('pointermove', onMove);
			clearInterval(tick);
		};
	});
</script>

<!-- Render only when in a session AND there are remote cursors. -->
{#if session.connected && session.cursors.size > 0}
	<div class="pointer-events-none fixed inset-0 z-50">
		{#each [...session.cursors.entries()] as [id, c] (id)}
			{#if now - c.updatedAt < STALE_MS}
				<div
					class="absolute -translate-x-1 -translate-y-1 transition-[left,top] duration-100 ease-out"
					style:left="{c.x * 100}%"
					style:top="{c.y * 100}%"
				>
					<svg width="20" height="22" viewBox="0 0 20 22" fill="none">
						<path
							d="M2 2 L2 18 L7 14 L11 22 L14 20 L10 12 L17 12 Z"
							fill={c.color}
							stroke="var(--ctp-base)"
							stroke-width="1.2"
							stroke-linejoin="round"
						/>
					</svg>
				</div>
			{/if}
		{/each}
	</div>
{/if}
