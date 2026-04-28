<script lang="ts">
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { audio } from '$lib/audio/engine.svelte';
	import { dragMod } from './dragMod.svelte';
	import Knob from './Knob.svelte';

	let open = $state(false);
	let autoOpened = $state(false);
	let tabEl: HTMLButtonElement | null = $state(null);
	let drawerEl: HTMLElement | null = $state(null);
	let hoverTimer = 0;
	const fx = $derived(audio.patch.effects);

	// While dragging an LFO rope, hovering the tab for ~120ms auto-opens the
	// drawer so the user can drop onto any FX knob inside.
	$effect(() => {
		const src = dragMod.source;
		const cur = dragMod.cursor;
		if (!src) {
			clearTimeout(hoverTimer);
			hoverTimer = 0;
			return;
		}
		const tabRect = tabEl?.getBoundingClientRect();
		const drawerRect = drawerEl?.getBoundingClientRect();
		const inTab =
			!!tabRect &&
			cur.x >= tabRect.left &&
			cur.x <= tabRect.right &&
			cur.y >= tabRect.top &&
			cur.y <= tabRect.bottom;
		const inDrawer =
			!!drawerRect &&
			cur.x >= drawerRect.left &&
			cur.x <= drawerRect.right &&
			cur.y >= drawerRect.top &&
			cur.y <= drawerRect.bottom;
		if (!open && inTab && !hoverTimer) {
			hoverTimer = window.setTimeout(() => {
				open = true;
				autoOpened = true;
				hoverTimer = 0;
			}, 120);
		} else if (!inTab && hoverTimer && !inDrawer) {
			clearTimeout(hoverTimer);
			hoverTimer = 0;
		}
	});

	// On rope drop: if it landed on one of our FX knobs, keep the drawer open
	// (clear autoOpened so user closes it manually). Else if we auto-opened,
	// close again.
	let prevSource: typeof dragMod.source = null;
	$effect(() => {
		const src = dragMod.source;
		if (prevSource && !src) {
			// drop just happened
			const hit = dragMod.hoveredTarget;
			const isFxTarget = !!hit && /^(distortion|bitcrusher|chorus|delay|reverb)\./.test(hit);
			if (autoOpened) {
				if (isFxTarget) {
					autoOpened = false;
				} else {
					open = false;
					autoOpened = false;
				}
			}
		}
		prevSource = src;
	});
</script>

<!-- Backdrop -->
{#if open}
	<div
		class="fixed inset-0 z-20 bg-crust/60 backdrop-blur-sm transition-[opacity,backdrop-filter] duration-300"
		role="presentation"
		onclick={() => (open = false)}
		transition:fade={{ duration: 250, easing: cubicOut }}
	></div>
{/if}

<!-- Drawer container — mirrors StrudelDrawer but tab is offset down so it sits under it. -->
<div
	class="fixed top-0 right-0 z-30 flex h-full w-[min(32rem,90vw)] translate-x-full transition-transform duration-[450ms]"
	class:!translate-x-0={open}
	style:transition-timing-function="cubic-bezier(0.22, 1, 0.36, 1)"
>
	<button
		bind:this={tabEl}
		class="absolute top-32 right-full flex h-24 w-8 cursor-pointer items-center justify-center text-[11px] tracking-widest uppercase transition-colors"
		style:clip-path="polygon(100% 0, 0 15%, 0 85%, 100% 100%)"
		class:bg-mauve={open}
		class:text-base={open}
		class:bg-surface1={!open}
		class:text-subtext1={!open}
		onclick={() => (open = !open)}
		aria-label="toggle effects"
		aria-expanded={open}
	>
		<span style:writing-mode="vertical-rl">effects</span>
	</button>

	<aside
		bind:this={drawerEl}
		class="flex h-full w-full flex-col gap-3 overflow-y-auto border-l border-surface1 bg-mantle p-4 shadow-2xl"
		role="dialog"
		aria-label="effects"
		aria-hidden={!open}
	>
		<header class="flex items-center justify-between">
			<h2 class="text-xs tracking-widest text-subtext0 uppercase">effects</h2>
			<span class="text-[10px] text-overlay1">post-filter chain</span>
		</header>

		<!-- Distortion -->
		<section
			class="flex flex-col gap-2 rounded-lg border border-surface0 bg-base/60 p-3"
			class:opacity-60={!fx.distortion.enabled}
		>
			<header class="flex items-center gap-2">
				<input
					type="checkbox"
					checked={fx.distortion.enabled}
					onchange={(e) => audio.setDistortion({ enabled: e.currentTarget.checked })}
					class="accent-mauve"
				/>
				<span class="text-xs tracking-widest text-subtext0 uppercase">distortion</span>
			</header>
			<div class="flex items-end justify-around gap-2">
				<Knob
					label="drive"
					target="distortion.drive"
					value={fx.distortion.drive}
					min={0}
					max={1}
					step={0.01}
					size={32}
					format={(v) => `${Math.round(v * 100)}%`}
					onchange={(v) => audio.setDistortion({ drive: v })}
				/>
				<Knob
					label="mix"
					target="distortion.mix"
					value={fx.distortion.mix}
					min={0}
					max={1}
					step={0.01}
					size={32}
					format={(v) => `${Math.round(v * 100)}%`}
					onchange={(v) => audio.setDistortion({ mix: v })}
				/>
			</div>
		</section>

		<!-- Bitcrusher -->
		<section
			class="flex flex-col gap-2 rounded-lg border border-surface0 bg-base/60 p-3"
			class:opacity-60={!fx.bitcrusher.enabled}
		>
			<header class="flex items-center gap-2">
				<input
					type="checkbox"
					checked={fx.bitcrusher.enabled}
					onchange={(e) => audio.setBitcrusher({ enabled: e.currentTarget.checked })}
					class="accent-mauve"
				/>
				<span class="text-xs tracking-widest text-subtext0 uppercase">bitcrusher</span>
			</header>
			<div class="flex items-end justify-around gap-2">
				<Knob
					label="bits"
					target="bitcrusher.bits"
					value={fx.bitcrusher.bits}
					min={1}
					max={16}
					step={1}
					size={32}
					format={(v) => `${v}`}
					onchange={(v) => audio.setBitcrusher({ bits: v })}
				/>
				<Knob
					label="drive"
					target="bitcrusher.drive"
					value={fx.bitcrusher.drive}
					min={0}
					max={2}
					step={0.01}
					size={32}
					format={(v) => `${v.toFixed(2)}x`}
					onchange={(v) => audio.setBitcrusher({ drive: v })}
				/>
				<Knob
					label="tone"
					target="bitcrusher.tone"
					value={fx.bitcrusher.tone}
					min={200}
					max={20000}
					step={1}
					curve={3}
					size={32}
					format={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${Math.round(v)}`)}
					unit=" Hz"
					onchange={(v) => audio.setBitcrusher({ tone: v })}
				/>
				<Knob
					label="mix"
					target="bitcrusher.mix"
					value={fx.bitcrusher.mix}
					min={0}
					max={1}
					step={0.01}
					size={32}
					format={(v) => `${Math.round(v * 100)}%`}
					onchange={(v) => audio.setBitcrusher({ mix: v })}
				/>
			</div>
		</section>

		<!-- Chorus -->
		<section
			class="flex flex-col gap-2 rounded-lg border border-surface0 bg-base/60 p-3"
			class:opacity-60={!fx.chorus.enabled}
		>
			<header class="flex items-center gap-2">
				<input
					type="checkbox"
					checked={fx.chorus.enabled}
					onchange={(e) => audio.setChorus({ enabled: e.currentTarget.checked })}
					class="accent-mauve"
				/>
				<span class="text-xs tracking-widest text-subtext0 uppercase">chorus</span>
			</header>
			<div class="flex items-end justify-around gap-2">
				<Knob
					label="rate"
					target="chorus.rate"
					value={fx.chorus.rate}
					min={0.01}
					max={10}
					step={0.01}
					curve={2}
					size={32}
					unit=" Hz"
					format={(v) => v.toFixed(2)}
					onchange={(v) => audio.setChorus({ rate: v })}
				/>
				<Knob
					label="depth"
					target="chorus.depth"
					value={fx.chorus.depth}
					min={0}
					max={1}
					step={0.01}
					size={32}
					format={(v) => `${Math.round(v * 100)}%`}
					onchange={(v) => audio.setChorus({ depth: v })}
				/>
				<Knob
					label="spread"
					target="chorus.spread"
					value={fx.chorus.spread}
					min={0}
					max={180}
					step={1}
					size={32}
					unit="°"
					onchange={(v) => audio.setChorus({ spread: v })}
				/>
				<Knob
					label="mix"
					target="chorus.mix"
					value={fx.chorus.mix}
					min={0}
					max={1}
					step={0.01}
					size={32}
					format={(v) => `${Math.round(v * 100)}%`}
					onchange={(v) => audio.setChorus({ mix: v })}
				/>
			</div>
		</section>

		<!-- Delay -->
		<section
			class="flex flex-col gap-2 rounded-lg border border-surface0 bg-base/60 p-3"
			class:opacity-60={!fx.delay.enabled}
		>
			<header class="flex items-center gap-2">
				<input
					type="checkbox"
					checked={fx.delay.enabled}
					onchange={(e) => audio.setDelay({ enabled: e.currentTarget.checked })}
					class="accent-mauve"
				/>
				<span class="text-xs tracking-widest text-subtext0 uppercase">delay</span>
			</header>
			<div class="flex items-end justify-around gap-2">
				<Knob
					label="time"
					target="delay.time"
					value={fx.delay.time}
					min={0.001}
					max={2}
					step={0.001}
					curve={2}
					size={32}
					unit=" s"
					format={(v) => v.toFixed(3)}
					onchange={(v) => audio.setDelay({ time: v })}
				/>
				<Knob
					label="fdbk"
					target="delay.feedback"
					value={fx.delay.feedback}
					min={0}
					max={0.95}
					step={0.01}
					size={32}
					format={(v) => `${Math.round(v * 100)}%`}
					onchange={(v) => audio.setDelay({ feedback: v })}
				/>
				<Knob
					label="mix"
					target="delay.mix"
					value={fx.delay.mix}
					min={0}
					max={1}
					step={0.01}
					size={32}
					format={(v) => `${Math.round(v * 100)}%`}
					onchange={(v) => audio.setDelay({ mix: v })}
				/>
			</div>
		</section>

		<!-- Reverb -->
		<section
			class="flex flex-col gap-2 rounded-lg border border-surface0 bg-base/60 p-3"
			class:opacity-60={!fx.reverb.enabled}
		>
			<header class="flex items-center gap-2">
				<input
					type="checkbox"
					checked={fx.reverb.enabled}
					onchange={(e) => audio.setReverb({ enabled: e.currentTarget.checked })}
					class="accent-mauve"
				/>
				<span class="text-xs tracking-widest text-subtext0 uppercase">reverb</span>
			</header>
			<div class="flex items-end justify-around gap-2">
				<Knob
					label="decay"
					target="reverb.decay"
					value={fx.reverb.decay}
					min={0.1}
					max={20}
					step={0.1}
					curve={2}
					size={32}
					unit=" s"
					format={(v) => v.toFixed(1)}
					onchange={(v) => audio.setReverb({ decay: v })}
				/>
				<Knob
					label="pre"
					target="reverb.preDelay"
					value={fx.reverb.preDelay}
					min={0}
					max={0.5}
					step={0.001}
					size={32}
					unit=" s"
					format={(v) => v.toFixed(3)}
					onchange={(v) => audio.setReverb({ preDelay: v })}
				/>
				<Knob
					label="mix"
					target="reverb.mix"
					value={fx.reverb.mix}
					min={0}
					max={1}
					step={0.01}
					size={32}
					format={(v) => `${Math.round(v * 100)}%`}
					onchange={(v) => audio.setReverb({ mix: v })}
				/>
			</div>
		</section>
	</aside>
</div>
