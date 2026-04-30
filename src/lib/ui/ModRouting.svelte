<script lang="ts">
	import { audio } from '$lib/audio/engine.svelte';
	import { modTargets } from '$lib/audio/modTargets';
	import Knob from './Knob.svelte';
	import { X } from 'lucide-svelte';

	type Source = 'lfo1' | 'lfo2' | 'modEnv1' | 'modEnv2';
	const sources: { id: Source; label: string }[] = [
		{ id: 'lfo1', label: 'LFO 1' },
		{ id: 'lfo2', label: 'LFO 2' },
		{ id: 'modEnv1', label: 'ENV 1' },
		{ id: 'modEnv2', label: 'ENV 2' }
	];

	const rows = $derived(
		sources.flatMap((s) =>
			audio.patch[s.id].routes.map((r) => ({
				source: s.id,
				sourceLabel: s.label,
				target: r.target,
				amount: r.amount
			}))
		)
	);

	function targetLabel(id: string): string {
		const t = modTargets.get(id);
		return t ? `${t.group} · ${t.label}` : id;
	}
</script>

<section
	class="flex h-full min-h-0 flex-col gap-2 rounded-lg border border-surface0 bg-base/60 p-3"
>
	<header class="flex items-center justify-between">
		<h3 class="text-xs tracking-widest text-subtext0 uppercase">routing</h3>
		<span class="text-[10px] text-overlay1">
			{rows.length} active route{rows.length === 1 ? '' : 's'}
		</span>
	</header>

	{#if rows.length === 0}
		<p class="px-1 py-3 text-[11px] leading-relaxed text-overlay1">
			no routes yet — drag an LFO or mod env title onto any knob to create one.
		</p>
	{:else}
		<div class="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto pr-0.5">
			{#each rows as r (`${r.source}:${r.target}`)}
				<div class="flex items-center gap-2 rounded bg-mantle/60 px-2 py-1.5">
					<span
						class="shrink-0 rounded bg-mauve/20 px-1.5 py-0.5 text-[10px] tracking-wide text-mauve uppercase"
					>
						{r.sourceLabel}
					</span>
					<div class="min-w-0 flex-1 truncate text-[11px] text-text">
						{targetLabel(r.target)}
					</div>
					<Knob
						label="amt"
						target={`${r.source}.route.${r.target}.amount`}
						value={r.amount}
						min={-0.5}
						max={0.5}
						step={0.005}
						size={24}
						format={(v) => `${v < 0 ? '−' : '+'}${Math.round(Math.abs(v) * 200)}%`}
						onchange={(v) => audio.updateRoute(r.source, r.target, { amount: v })}
					/>
					<button
						onclick={() => audio.removeRoute(r.source, r.target)}
						class="rounded p-0.5 text-overlay1 transition-colors hover:bg-surface0 hover:text-red"
						title="remove route"
						aria-label="remove route"
					>
						<X size={12} />
					</button>
				</div>
			{/each}
		</div>
	{/if}
</section>
