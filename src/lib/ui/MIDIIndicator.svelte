<script lang="ts">
	import { midi } from '$lib/audio/midi.svelte';

	function toggle() {
		if (midi.enabled) midi.disable();
		else midi.enable();
	}
</script>

{#if midi.supported}
	<button
		class="rounded-full border border-surface1 bg-base/70 px-3 py-1 text-[10px] backdrop-blur-sm transition-colors"
		class:text-mauve={midi.enabled && midi.inputs.length > 0}
		class:text-subtext1={!midi.enabled || midi.inputs.length === 0}
		class:hover:border-mauve={!midi.enabled}
		class:hover:text-text={!midi.enabled}
		onclick={toggle}
		title={midi.enabled
			? midi.inputs.length
				? `MIDI on · ${midi.inputs.join(', ')}`
				: 'MIDI on · no devices'
			: 'enable Web MIDI'}
	>
		midi
		{#if midi.enabled}
			<span class="text-overlay1">· {midi.inputs.length}</span>
		{/if}
	</button>
{/if}
