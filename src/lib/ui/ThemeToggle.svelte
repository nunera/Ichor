<script lang="ts">
	import { onMount } from 'svelte';

	type Theme = 'latte' | 'catppuccin' | 'catppuccin-oled';
	const themes: Theme[] = ['latte', 'catppuccin', 'catppuccin-oled'];

	type Accent = 'mauve' | 'rosewater' | 'red' | 'peach' | 'green' | 'teal' | 'sky' | 'blue';
	const accents: Accent[] = ['mauve', 'rosewater', 'red', 'peach', 'green', 'teal', 'sky', 'blue'];

	let theme = $state<Theme>('catppuccin');
	let accent = $state<Accent>('mauve');
	let accentPos = $state(0);
	let rainbow = $state(false);
	let rainbowRaf: number | null = null;
	let rainbowT0 = 0;

	onMount(() => {
		const storedTheme = localStorage.getItem('ichor-theme');
		const storedAccent = localStorage.getItem('ichor-accent');
		const storedRainbow = localStorage.getItem('ichor-rainbow');

		// Migrate old theme values.
		if (storedTheme === 'latte') theme = 'latte';
		else if (storedTheme === 'mocha' || storedTheme === 'sky') theme = 'catppuccin';
		else if (storedTheme === 'mocha-oled') theme = 'catppuccin-oled';
		else if (storedTheme && themes.includes(storedTheme as Theme)) theme = storedTheme as Theme;
		else {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			theme = prefersDark ? 'catppuccin' : 'latte';
		}

		// Migrate old sky theme to sky accent.
		if (storedTheme === 'sky') accent = 'sky';
		else if (storedAccent && accents.includes(storedAccent as Accent))
			accent = storedAccent as Accent;
		else accent = 'mauve';

		accentPos = accents.indexOf(accent);
		rainbow = storedRainbow === '1';
	});

	$effect(() => {
		if (typeof document === 'undefined') return;
		// "dark" enables the dark Catppuccin palette; "oled" pushes
		// backgrounds to true black. Accent is controlled by a class.
		const dark = theme === 'catppuccin' || theme === 'catppuccin-oled';
		const oled = theme === 'catppuccin-oled';
		const accentClass = !rainbow && accent !== 'mauve' ? `accent-${accent}` : '';
		let cls = '';
		if (dark) cls += 'dark';
		if (oled) cls += (cls ? ' ' : '') + 'oled';
		if (rainbow) cls += (cls ? ' ' : '') + 'rainbow';
		if (accentClass) cls += (cls ? ' ' : '') + accentClass;
		document.documentElement.className = cls;
		try {
			localStorage['ichor-theme'] = theme;
			localStorage['ichor-accent'] = accent;
			localStorage['ichor-rainbow'] = rainbow ? '1' : '0';
		} catch {
			/* ignore */
		}
	});

	$effect(() => {
		if (typeof document === 'undefined') return;
		const root = document.documentElement;
		let alive = true;
		if (!rainbow) {
			if (rainbowRaf !== null) cancelAnimationFrame(rainbowRaf);
			rainbowRaf = null;
			root.style.removeProperty('--ctp-mauve');
			return;
		}

		rainbowT0 = performance.now();
		const periodMs = 5000;
		const tick = (t: number) => {
			if (!alive) return;
			// Hue-rotate an RGB value through the spectrum.
			const a = ((t - rainbowT0) % periodMs) / periodMs;
			const hue = a * 360;
			root.style.setProperty('--ctp-mauve', `hsl(${hue}deg 95% 70%)`);
			rainbowRaf = requestAnimationFrame(tick);
		};
		rainbowRaf = requestAnimationFrame(tick);
		return () => {
			alive = false;
			if (rainbowRaf !== null) cancelAnimationFrame(rainbowRaf);
			rainbowRaf = null;
		};
	});

	function onAccentInput(v: number) {
		accentPos = v;
		const i = Math.max(0, Math.min(accents.length - 1, Math.round(v)));
		accent = accents[i];
	}

	function toggleRainbow() {
		rainbow = !rainbow;
	}
</script>

<label class="flex items-center gap-2 text-xs text-subtext1">
	theme
	<select
		bind:value={theme}
		class="rounded-md border border-surface1 bg-surface0 px-2 py-1 text-text outline-none focus:border-mauve"
	>
		{#each themes as t (t)}
			<option value={t}>{t}</option>
		{/each}
	</select>
</label>

<label class="group flex items-center gap-2 text-xs text-subtext1">
	accent
	<input
		type="range"
		min="0"
		max={accents.length - 1}
		step="0.001"
		value={accentPos}
		oninput={(e) => onAccentInput(e.currentTarget.valueAsNumber)}
		ondblclick={(e) => {
			e.preventDefault();
			toggleRainbow();
		}}
		aria-label="accent color"
		class="w-24 cursor-ew-resize opacity-10 transition-opacity group-hover:opacity-35 focus:opacity-50"
		style:accent-color="var(--ctp-mauve)"
		title={rainbow ? 'rainbow' : accent}
	/>
</label>
