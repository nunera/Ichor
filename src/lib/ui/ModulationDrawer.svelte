<script lang="ts">
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import LFOTabs from './LFOTabs.svelte';
	import ModEnvTabs from './ModEnvTabs.svelte';
	import ModRouting from './ModRouting.svelte';
	import { dragMod } from './dragMod.svelte';

	let open = $state(false);
	let autoOpened = $state(false);
	let tabEl: HTMLButtonElement | null = $state(null);
	let drawerEl: HTMLElement | null = $state(null);
	let hoverTimer = 0;
	let closeTimer = 0;
	let followRaf = 0;
	let savedAnchor: { x: number; y: number } | null = null;

	function reanchorToTab() {
		if (!dragMod.source) return;
		const r = tabEl?.getBoundingClientRect();
		if (!r) return;
		dragMod.source = {
			...dragMod.source,
			// Anchor at the bottom-middle of the visible tab.
			anchor: { x: r.left + r.width / 2, y: r.bottom }
		};
	}

	function stopFollowingTab() {
		if (followRaf) cancelAnimationFrame(followRaf);
		followRaf = 0;
	}

	function followTabAnchorFor(ms: number) {
		stopFollowingTab();
		// Preserve the original rope origin so reopening the drawer can snap back.
		if (dragMod.source && !savedAnchor) savedAnchor = dragMod.source.anchor;
		const start = performance.now();
		const tick = () => {
			if (!dragMod.source) {
				followRaf = 0;
				return;
			}
			reanchorToTab();
			if (performance.now() - start < ms) {
				followRaf = requestAnimationFrame(tick);
			} else {
				followRaf = 0;
			}
		};
		followRaf = requestAnimationFrame(tick);
	}

	// While dragging an LFO rope, hovering the tab for ~120ms auto-opens the
	// drawer so the user can route without manually toggling it.
	$effect(() => {
		const src = dragMod.source;
		const cur = dragMod.cursor;
		if (!src) {
			clearTimeout(hoverTimer);
			hoverTimer = 0;
			clearTimeout(closeTimer);
			closeTimer = 0;
			stopFollowingTab();
			savedAnchor = null;
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

		// If the drawer is already open, hovering in the blurred backdrop area
		// (outside drawer + tab) for a moment closes it, without requiring a drop.
		if (open && !inDrawer && !inTab && !closeTimer) {
			closeTimer = window.setTimeout(() => {
				open = false;
				autoOpened = false;
				// The drawer animates down; keep the cable anchored to the tab
				// during the transition so it moves with it.
				followTabAnchorFor(520);
				closeTimer = 0;
			}, 140);
		} else if ((inDrawer || inTab) && closeTimer) {
			clearTimeout(closeTimer);
			closeTimer = 0;
		}
	});

	// If the user re-opens the drawer while still dragging, snap the rope origin
	// back to where the drag started (inside the modulation panel).
	let prevOpen = open;
	$effect(() => {
		if (!prevOpen && open && dragMod.source && savedAnchor) {
			dragMod.source = { ...dragMod.source, anchor: savedAnchor };
			savedAnchor = null;
			stopFollowingTab();
		}
		prevOpen = open;
	});

	// On rope drop: if it lands in the blurred backdrop (outside our drawer)
	// with no knob target, close the modulation panel to get it out of the way.
	// If we auto-opened, also close again unless the cursor ended inside us.
	let prevSource: typeof dragMod.source = null;
	$effect(() => {
		const src = dragMod.source;
		if (prevSource && !src) {
			const cur = dragMod.cursor;
			const drawerRect = drawerEl?.getBoundingClientRect();
			const inDrawer =
				!!drawerRect &&
				cur.x >= drawerRect.left &&
				cur.x <= drawerRect.right &&
				cur.y >= drawerRect.top &&
				cur.y <= drawerRect.bottom;
			const droppedOnKnob = !!dragMod.hoveredTarget;
			if (autoOpened) {
				if (!inDrawer) {
					open = false;
					autoOpened = false;
				} else {
					autoOpened = false;
				}
			} else if (open && !inDrawer && !droppedOnKnob) {
				open = false;
			}
		}
		prevSource = src;
	});

	// Block drag routing through the open drawer/tab.
	$effect(() => {
		if (!open) return;
		const unregDrawer = dragMod.registerBlocker(
			'modulation.drawer',
			() => drawerEl?.getBoundingClientRect() ?? null
		);
		const unregTab = dragMod.registerBlocker(
			'modulation.tab',
			() => tabEl?.getBoundingClientRect() ?? null
		);
		return () => {
			unregDrawer();
			unregTab();
		};
	});
</script>

<!-- Backdrop -->
{#if open}
	<div
		class="fixed inset-0 z-20 bg-crust/60 backdrop-blur-sm transition-[opacity,backdrop-filter] duration-300"
		style:pointer-events="auto"
		role="presentation"
		onclick={() => (open = false)}
		transition:fade={{ duration: 250, easing: cubicOut }}
	></div>
{/if}

<!-- Drawer container — slides up from the bottom, tab centred horizontally. -->
<div
	class="fixed right-0 bottom-0 left-0 z-30 flex h-[min(34rem,80vh)] translate-y-full flex-col transition-transform duration-[450ms]"
	class:!translate-y-0={open}
	style:transition-timing-function="cubic-bezier(0.22, 1, 0.36, 1)"
>
	<!--
		Tab uses an inner clipped bg element. The outer button remains a
		rectangular hit target so clicks can't pass through the clipped corners
		to underlying knobs.
	-->
	<button
		bind:this={tabEl}
		class="absolute bottom-full left-1/2 h-8 w-32 -translate-x-1/2 cursor-pointer text-[11px] tracking-widest uppercase"
		style:pointer-events="auto"
		onclick={() => (open = !open)}
		aria-label="toggle modulation"
		aria-expanded={open}
	>
		<span
			class="absolute inset-0 flex items-center justify-center transition-colors"
			style:clip-path="polygon(15% 0, 85% 0, 100% 100%, 0 100%)"
			class:bg-mauve={open}
			class:text-base={open}
			class:bg-surface1={!open}
			class:text-subtext1={!open}
		>
			modulation
		</span>
	</button>

	<aside
		bind:this={drawerEl}
		class="flex h-full w-full flex-col gap-3 overflow-hidden border-t border-surface1 bg-mantle p-4 shadow-2xl"
		role="dialog"
		aria-label="modulation"
		aria-hidden={!open}
	>
		<header class="flex shrink-0 items-center justify-between">
			<h2 class="text-xs tracking-widest text-subtext0 uppercase">modulation</h2>
			<span class="text-[10px] text-overlay1">sources · routing</span>
		</header>

		<!-- Top row: LFO tabs | Mod env tabs.
		     Bottom row: combined routing list. -->
		<div class="grid min-h-0 flex-1 grid-cols-2 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-3">
			<div class="min-h-0"><LFOTabs /></div>
			<div class="min-h-0"><ModEnvTabs /></div>
			<div class="col-span-2 min-h-0"><ModRouting /></div>
		</div>
	</aside>
</div>
