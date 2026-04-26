<script lang="ts">
	import { audio } from '$lib/audio/engine.svelte';
	import { onMount } from 'svelte';

	// Pitch bend: -1..1, springs back to 0 on release. Range = ±2 semitones.
	let bend = $state(0);
	// Modulation: 0..1, sticky (stays where you leave it).
	let mod = $state(0);

	let bendActive = $state(false);
	let modActive = $state(false);
	let bendEl: HTMLDivElement;
	let modEl: HTMLDivElement;

	const BEND_RANGE = 2; // semitones

	$effect(() => {
		audio.setPitchBend(bend * BEND_RANGE);
	});
	$effect(() => {
		audio.setModulation(mod);
	});

	function valueFromY(el: HTMLElement, clientY: number, range: 'bend' | 'mod'): number {
		const r = el.getBoundingClientRect();
		// y=0 at top, y=1 at bottom (top of element = max value)
		const t = (clientY - r.top) / r.height;
		const clamped = Math.max(0, Math.min(1, t));
		if (range === 'bend') {
			// top = +1, middle = 0, bottom = -1
			return 1 - clamped * 2;
		}
		// mod: top = 1, bottom = 0
		return 1 - clamped;
	}

	function onBendDown(e: PointerEvent) {
		bendActive = true;
		bendEl.setPointerCapture(e.pointerId);
		bend = valueFromY(bendEl, e.clientY, 'bend');
	}
	function onBendMove(e: PointerEvent) {
		if (!bendActive) return;
		bend = valueFromY(bendEl, e.clientY, 'bend');
	}
	function onBendUp(e: PointerEvent) {
		if (!bendActive) return;
		bendActive = false;
		bendEl.releasePointerCapture?.(e.pointerId);
		// Spring back to center
		springBendToCenter();
	}

	function springBendToCenter() {
		const start = performance.now();
		const from = bend;
		const dur = 220;
		const tick = (now: number) => {
			const t = Math.min(1, (now - start) / dur);
			// ease-out cubic
			const eased = 1 - Math.pow(1 - t, 3);
			bend = from * (1 - eased);
			if (t < 1 && !bendActive) requestAnimationFrame(tick);
			else if (!bendActive) bend = 0;
		};
		requestAnimationFrame(tick);
	}

	function onModDown(e: PointerEvent) {
		modActive = true;
		modEl.setPointerCapture(e.pointerId);
		mod = valueFromY(modEl, e.clientY, 'mod');
	}
	function onModMove(e: PointerEvent) {
		if (!modActive) return;
		mod = valueFromY(modEl, e.clientY, 'mod');
	}
	function onModUp(e: PointerEvent) {
		if (!modActive) return;
		modActive = false;
		modEl.releasePointerCapture?.(e.pointerId);
		// Mod wheel stays put — no spring.
	}

	// Visual position: bend has a center indicator, mod fills from bottom.
	const bendKnobTop = $derived(`${50 - bend * 50}%`); // 0% top, 50% center, 100% bottom
	const modFillHeight = $derived(`${mod * 100}%`);

	onMount(() => {
		// Reset on mount in case of HMR
		bend = 0;
		audio.setPitchBend(0);
		audio.setModulation(0);
	});
</script>

<div class="flex h-full gap-2 select-none">
	<!-- Pitch bend wheel -->
	<div class="flex flex-col items-center gap-1">
		<div
			bind:this={bendEl}
			role="slider"
			tabindex="0"
			aria-label="pitch bend"
			aria-valuemin={-1}
			aria-valuemax={1}
			aria-valuenow={bend}
			class="relative h-full w-6 cursor-ns-resize touch-none rounded-md border border-surface1 bg-base shadow-inner"
			onpointerdown={onBendDown}
			onpointermove={onBendMove}
			onpointerup={onBendUp}
			onpointercancel={onBendUp}
		>
			<!-- Center line -->
			<div class="pointer-events-none absolute top-1/2 left-0 h-px w-full bg-surface2"></div>
			<!-- Knob -->
			<div
				class="pointer-events-none absolute left-1/2 h-3 w-5 -translate-x-1/2 -translate-y-1/2 rounded bg-mauve shadow-md transition-colors"
				class:opacity-90={bendActive}
				style:top={bendKnobTop}
			></div>
		</div>
		<span class="text-[9px] tracking-widest text-subtext0 uppercase">bend</span>
	</div>

	<!-- Mod wheel -->
	<div class="flex flex-col items-center gap-1">
		<div
			bind:this={modEl}
			role="slider"
			tabindex="0"
			aria-label="modulation"
			aria-valuemin={0}
			aria-valuemax={1}
			aria-valuenow={mod}
			class="relative h-full w-6 cursor-ns-resize touch-none overflow-hidden rounded-md border border-surface1 bg-base shadow-inner"
			onpointerdown={onModDown}
			onpointermove={onModMove}
			onpointerup={onModUp}
			onpointercancel={onModUp}
		>
			<!-- Fill -->
			<div
				class="pointer-events-none absolute bottom-0 left-0 w-full bg-lavender opacity-80"
				style:height={modFillHeight}
			></div>
			<!-- Knob indicator at top of fill -->
			<div
				class="pointer-events-none absolute left-1/2 h-1 w-5 -translate-x-1/2 rounded bg-text shadow"
				style:bottom={modFillHeight}
				style:transform="translate(-50%, 50%)"
			></div>
		</div>
		<span class="text-[9px] tracking-widest text-subtext0 uppercase">mod</span>
	</div>
</div>
