<script lang="ts">
	import { goto } from '$app/navigation';
	import { session, newSessionId } from '$lib/audio/session.svelte';

	let copied = $state(false);
	let editingName = $state(false);
	let nameInput = $state('');

	async function startSession() {
		const id = newSessionId();
		await goto(`/s/${id}`);
	}

	async function copyLink() {
		try {
			await navigator.clipboard.writeText(location.href);
			copied = true;
			setTimeout(() => (copied = false), 1500);
		} catch {
			/* ignore */
		}
	}

	async function leave() {
		session.disconnect();
		await goto('/');
	}

	function toggleBroadcast() {
		if (session.broadcasting) {
			session.unbroadcast();
		} else {
			editingName = true;
			nameInput = session.broadcastName ?? '';
		}
	}

	function confirmBroadcast(e: Event) {
		e.preventDefault();
		session.broadcast(nameInput.trim() || undefined);
		editingName = false;
	}

	function cancelBroadcast() {
		editingName = false;
	}
</script>

{#if session.connected}
	<div
		class="flex items-center gap-2 rounded-full border border-surface1 bg-base/70 px-2 py-1 text-[10px] backdrop-blur-sm"
	>
		<span class="relative flex h-2 w-2" aria-label="connected">
			<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-60"
			></span>
			<span class="relative inline-flex h-2 w-2 rounded-full bg-green"></span>
		</span>
		<span class="text-subtext0" title="people connected">{session.peers}</span>

		{#if editingName}
			<form class="flex items-center gap-1" onsubmit={confirmBroadcast}>
				<!-- svelte-ignore a11y_autofocus -->
				<input
					type="text"
					bind:value={nameInput}
					placeholder="session name"
					maxlength="64"
					class="w-28 rounded bg-surface0 px-1.5 py-0.5 text-text outline-none focus:ring-1 focus:ring-mauve"
					autofocus
				/>
				<button type="submit" class="text-mauve transition-colors hover:opacity-80">go</button>
				<button
					type="button"
					class="text-subtext1 transition-colors hover:text-text"
					onclick={cancelBroadcast}
				>
					×
				</button>
			</form>
		{:else}
			<button
				class="transition-colors"
				class:text-mauve={session.broadcasting}
				class:text-subtext1={!session.broadcasting}
				onclick={toggleBroadcast}
				title={session.broadcasting ? 'stop broadcasting' : 'broadcast publicly'}
			>
				{session.broadcasting ? `● ${session.broadcastName ?? 'live'}` : 'broadcast'}
			</button>
		{/if}

		<button
			class="text-subtext1 transition-colors hover:text-text"
			onclick={copyLink}
			title="copy session link"
		>
			{copied ? 'copied' : 'share'}
		</button>
		<button
			class="text-subtext1 transition-colors hover:text-red"
			onclick={leave}
			title="leave session"
		>
			leave
		</button>
	</div>
{:else}
	<button
		class="rounded-full border border-surface1 bg-base/70 px-3 py-1 text-[10px] text-subtext1 backdrop-blur-sm transition-colors hover:border-mauve hover:text-text"
		onclick={startSession}
		title="start a shareable live session"
	>
		share
	</button>
{/if}
