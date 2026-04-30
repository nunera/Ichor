<script lang="ts">
	import ModEnvCard from './ModEnvCard.svelte';

	const tabs = [
		{ id: 'modEnv1', label: 'ENV 1' },
		{ id: 'modEnv2', label: 'ENV 2' }
	] as const;
	type Tab = (typeof tabs)[number]['id'];

	let active = $state<Tab>('modEnv1');
</script>

<section
	class="flex h-full min-h-0 flex-col gap-2 rounded-lg border border-surface0 bg-base/60 p-3"
>
	<header class="flex items-center gap-2">
		<h3 class="text-xs tracking-widest text-subtext0 uppercase">mod env</h3>
		<div class="ml-auto flex gap-1">
			{#each tabs as t (t.id)}
				<button
					class="rounded px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase transition-colors"
					class:bg-mauve={active === t.id}
					class:text-base={active === t.id}
					class:bg-surface0={active !== t.id}
					class:text-overlay1={active !== t.id}
					onclick={() => (active = t.id)}
				>
					{t.label}
				</button>
			{/each}
		</div>
	</header>

	<div class="min-h-0 flex-1">
		{#key active}
			<ModEnvCard which={active} showRoutes={false} />
		{/key}
	</div>
</section>
