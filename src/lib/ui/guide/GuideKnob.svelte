<script lang="ts">
	import Knob from '../Knob.svelte';

	let value = $state(50);
</script>

<div class="flex items-center gap-6 rounded-lg border border-surface0 bg-base/40 p-4">
	<div class="flex flex-col items-center gap-1">
		<Knob
			label="try me"
			{value}
			min={0}
			max={100}
			step={1}
			size={56}
			format={(v) => `${v}`}
			onchange={(v) => (value = v)}
		/>
	</div>
	<div class="flex flex-1 flex-col gap-2 text-[11px] text-subtext1">
		<p>↑ Click and drag this knob up/down to change the value.</p>
		<p>Double-click to reset · scroll to fine-tune</p>
		<div class="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface0">
			<div class="h-full bg-mauve transition-[width]" style:width="{value}%"></div>
		</div>
	</div>
</div>
