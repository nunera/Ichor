<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import GuideKnob from './guide/GuideKnob.svelte';
	import GuideEnvelope from './guide/GuideEnvelope.svelte';
	import GuideWave from './guide/GuideWave.svelte';
	import GuideFilter from './guide/GuideFilter.svelte';
	import {
		Piano,
		AudioWaveform,
		CircleDot,
		Waves,
		Filter as FilterIcon,
		Activity,
		Layers,
		FlaskConical,
		Zap,
		Music2,
		Sparkles,
		SlidersHorizontal,
		Code,
		Cloud,
		Rocket,
		X,
		type Icon as IconType
	} from 'lucide-svelte';

	let open = $state(false);
	let lessonIndex = $state(0);

	type Lesson = {
		title: string;
		icon: typeof IconType;
		body: string;
		// Optional inline visual key — components below render the matching demo.
		visual?: 'wave' | 'envelope' | 'filter' | 'knob' | 'lfo' | 'unison';
	};

	const lessons: Lesson[] = [
		{
			icon: Piano,
			title: 'What is a synthesizer?',
			body:
				'A synthesizer makes sound from scratch using electronic circuits (or in our case, math!). ' +
				'Unlike a guitar or piano which use vibrating strings, a synth generates raw tones called ' +
				'\u201coscillators,\u201d then shapes them with filters, envelopes, and effects to create ' +
				'anything from soft pads to gritty basses to alien noises.\n\n' +
				'In ichor, you press a key (or click the keyboard at the bottom) and a tone comes out. ' +
				'Everything else on screen - the knobs, the buttons, the drawers - lets you ' +
				'sculpt that tone into whatever you want.'
		},
		{
			icon: AudioWaveform,
			title: 'Oscillators & Waveforms',
			visual: 'wave',
			body:
				'An oscillator generates a continuous tone. The shape of that tone is called a ' +
				'\u201cwaveform,\u201d and different shapes sound different even at the same pitch.\n\n' +
				'\u2022 SINE: pure, smooth, flutey. The simplest sound possible.\n' +
				'\u2022 TRIANGLE: like a sine but slightly brighter. Soft and clean.\n' +
				'\u2022 SQUARE: hollow, woody, classic 8-bit. Like a clarinet or NES game.\n' +
				'\u2022 SAWTOOTH: bright, buzzy, full of harmonics. The classic synth lead/bass.\n' +
				'\u2022 PULSE: a square with adjustable width - narrow widths sound nasal/reedy.\n\n' +
				'Ichor has TWO oscillators (osc 1 and osc 2) so you can layer two waveforms together. ' +
				'Try detuning them slightly with the FINE knob - it makes everything sound thicker.'
		},
		{
			icon: CircleDot,
			title: 'Knobs: how to use them',
			visual: 'knob',
			body:
				'Every knob in ichor works the same way:\n\n' +
				'\u2022 CLICK + DRAG up/down to change the value\n' +
				'\u2022 DOUBLE-CLICK to reset to default\n' +
				'\u2022 SCROLL while hovering for precise tweaks\n\n' +
				'The little ring around the knob shows the current value. The number underneath ' +
				'tells you the exact amount and unit (Hz, dB, %, etc).\n\n' +
				"Don't be afraid to crank knobs to extremes - most of the fun comes from " +
				'breaking things in interesting ways!'
		},
		{
			icon: Activity,
			title: 'The Envelope (ADSR)',
			visual: 'envelope',
			body:
				"An envelope describes how a sound's volume changes over time after you press a key. " +
				'Ichor uses an AHDSR envelope with five stages:\n\n' +
				'\u2022 ATTACK: how long it takes to fade IN. Short = punchy. Long = swelling pad.\n' +
				'\u2022 HOLD: how long it stays at full volume before decaying.\n' +
				'\u2022 DECAY: how long it takes to drop from full to the sustain level.\n' +
				'\u2022 SUSTAIN: the volume held while you keep the key pressed.\n' +
				'\u2022 RELEASE: how long it fades OUT after you release the key.\n\n' +
				'The shape on the envelope panel actually shows your settings in real time - ' +
				'you can drag the dots to edit it visually instead of using knobs!'
		},
		{
			icon: FilterIcon,
			title: 'The Filter',
			visual: 'filter',
			body:
				'A filter sculpts the brightness of your sound by removing certain frequencies. Think ' +
				'of it like a tone control on steroids.\n\n' +
				'\u2022 LOWPASS (LP): removes high frequencies - makes things mellower/darker.\n' +
				'\u2022 HIGHPASS (HP): removes low frequencies - thins things out, removes bass.\n' +
				'\u2022 BANDPASS (BP): keeps only a narrow band - telephone/honky tone.\n' +
				'\u2022 NOTCH (NT): removes a narrow band - phaser/comb-like effects.\n\n' +
				'CUTOFF sets where the filter starts cutting. RESONANCE boosts frequencies right at ' +
				'the cutoff point - high resonance creates that classic squelchy "wah" sound.\n\n' +
				'Try sweeping the cutoff while playing a chord - instant acid bassline vibes.'
		},
		{
			icon: Waves,
			title: 'The LFO (Low Frequency Oscillator)',
			visual: 'lfo',
			body:
				"An LFO is just an oscillator that's TOO SLOW to be heard - instead it's used to " +
				"wobble other parameters. Ichor's LFO is wired to the filter cutoff by default.\n\n" +
				'\u2022 RATE: how fast the wobble happens (in Hz, cycles per second)\n' +
				'\u2022 DEPTH: how much it wobbles (small = subtle vibrato, large = dramatic sweep)\n' +
				'\u2022 SHAPE: sine = smooth wobble, square = on-off jump, sawtooth = ramp\n\n' +
				'Slow LFO + lots of depth = dub-style filter sweeps.\n' +
				'Fast LFO + a bit of depth = vibrato or tremolo.\n\n' +
				'Tip: even with the LFO disabled, the MOD WHEEL on the left side of the keyboard ' +
				"adds extra LFO depth - play around with it while you're holding a note!"
		},
		{
			icon: Layers,
			title: 'Unison & Detune (the "fat" sound)',
			visual: 'unison',
			body:
				'Want that big, rich, "supersaw" sound from EDM and trance music? You need UNISON.\n\n' +
				'When unison is set to more than 1 voice, the oscillator stacks multiple copies of ' +
				'itself slightly detuned from each other. The SPREAD knob controls how detuned they ' +
				'are (in cents - 100 cents = 1 semitone).\n\n' +
				'\u2022 1 voice = clean, pure tone\n' +
				'\u2022 3-5 voices, low spread = warm, thicker tone\n' +
				'\u2022 7+ voices, high spread = massive, swirling supersaw lead\n\n' +
				'Unison only works on the BASIC synth engine - FM, AM, and Pluck have other ways ' +
				'of getting rich tones.'
		},
		{
			icon: FlaskConical,
			title: 'Synth Engines (BASIC / FM / AM / Pluck)',
			body:
				'Each oscillator slot can use one of four different SYNTHESIS ENGINES:\n\n' +
				'\u2022 BASIC - classic subtractive synthesis. The waveform you pick gets shaped ' +
				'by the filter and envelope. This is what 99% of synths do.\n\n' +
				'\u2022 FM (Frequency Modulation) - one oscillator modulates the pitch of another, ' +
				'creating bell-like, metallic, glassy tones. Famous from the Yamaha DX7 (Whitney ' +
				'Houston, A-ha, etc). Try high HARMONICITY values for bells.\n\n' +
				'\u2022 AM (Amplitude Modulation) - one oscillator modulates the volume of another, ' +
				'making ring-mod sidebands. Eerie, sci-fi, alien sounds.\n\n' +
				'\u2022 PLUCK - simulates a plucked string using physics (Karplus-Strong). Great ' +
				'for guitars, harps, kalimba, koto. Has no envelope - it self-decays naturally.\n\n' +
				'You can MIX engines: Osc 1 = Pluck for the body, Osc 2 = FM for shimmer = beautiful ' +
				'electric piano.'
		},
		{
			icon: Zap,
			title: 'Sub Oscillator & Noise',
			body:
				'These are two extra layers that sit alongside Osc 1 and Osc 2:\n\n' +
				'\u2022 SUB OSC - a simple oscillator that always plays one or two octaves BELOW ' +
				'the note you press. Adds weight to bass sounds. Toggle it on for any patch that ' +
				'needs more low-end thump.\n\n' +
				'\u2022 NOISE - random hiss that follows your envelope. Three flavors:\n' +
				'  \u2022 WHITE: bright hiss (cymbal/wind sounds)\n' +
				'  \u2022 PINK: warmer hiss (rain, ocean)\n' +
				'  \u2022 BROWN: dark rumble (thunder)\n\n' +
				'Both have their own LEVEL and PAN knobs. Pan them to opposite sides for stereo ' +
				'width. Add a tiny bit of noise to a pad to make it breathe.'
		},
		{
			icon: Music2,
			title: 'Voice Modes (Poly / Mono / Legato / Scale)',
			body:
				'Voice modes change HOW notes are played:\n\n' +
				'\u2022 POLY - multiple notes at once (chords). Default for most patches.\n\n' +
				'\u2022 MONO - only one note at a time. New notes cut off old ones. Best for ' +
				'leads and basslines.\n\n' +
				'\u2022 LEGATO - like mono, but with GLIDE. Notes slide from one pitch to the ' +
				'next when you play overlapping. The GLIDE knob sets how long the slide takes.\n\n' +
				'\u2022 SCALE - like legato, but the glide time scales with how far apart the ' +
				'notes are. A small interval glides fast, a big leap glides slowly.\n\n' +
				'Set up a synth lead patch in MONO with some glide for that classic Moog/TB-303 vibe.'
		},
		{
			icon: Sparkles,
			title: 'Effects (the right drawer)',
			body:
				'Click the EFFECTS tab on the right edge of the screen to open the effects rack. ' +
				'These post-process your sound to make it bigger, weirder, or both:\n\n' +
				'\u2022 DISTORTION - adds harmonics, makes things crunchy/aggressive\n' +
				'\u2022 BITCRUSHER - reduces bit depth for that lo-fi, chiptune, "broken" sound\n' +
				'\u2022 CHORUS - doubles your sound with detuned copies, adds width and shimmer\n' +
				'\u2022 DELAY - echoes that bounce in stereo (ping-pong). Great for atmosphere.\n' +
				'\u2022 REVERB - adds the sense of being in a room/hall/cathedral\n\n' +
				'Each effect has its own MIX knob (wet/dry blend) and a checkbox to enable it. ' +
				'Order matters! Effects are chained left-to-right. Try chorus + delay + reverb on ' +
				'a pluck for absolutely magical ambient sounds.'
		},
		{
			icon: SlidersHorizontal,
			title: 'The Pitch Bend & Mod Wheels',
			body:
				'On the LEFT side of the keyboard you have two vertical sliders - these mimic ' +
				'real synth keyboards:\n\n' +
				'\u2022 PITCH BEND - drag up/down to bend notes \u00B12 semitones. SPRINGS BACK ' +
				'to center when you let go (like a real bend wheel). Great for guitar-style note ' +
				'slides while holding a key.\n\n' +
				'\u2022 MOD WHEEL - drag up to add modulation. Stays where you put it. Boosts the ' +
				'LFO depth, so even with the LFO turned off, raising the mod wheel introduces a ' +
				'cutoff sweep. Adds expression to held notes.'
		},
		{
			icon: Code,
			title: 'Strudel: live coding patterns',
			body:
				'Click the STRUDEL tab on the right to open a code editor. Strudel is a mini ' +
				'language for generating musical patterns - you write code, and the synth ' +
				'plays your code in real time.\n\n' +
				'Example: `note("c3 eb3 g3 bb3").s("ichor").slow(2)`\n\n' +
				'This plays a C minor 7 arpeggio across 2 cycles. You can chain on synth params ' +
				'too: `.cutoff(sine.range(0.1, 0.9))` makes the filter sweep automatically. ' +
				'Press CMD+ENTER (or CTRL+ENTER) to play your code.\n\n' +
				'Strudel is a whole world unto itself - google "strudel cycles" for full docs.'
		},
		{
			icon: Cloud,
			title: 'Presets & Sharing',
			body:
				'Click the PATCH tab on the LEFT side to open the preset cloud - a giant floating ' +
				'physics-based blob of 327 presets organized by category (bass, lead, pad, keys, etc). ' +
				'Hover one to preview, click to load.\n\n' +
				"You can also click SHARE in the top bar to get a URL anyone can open - they'll " +
				'see your patch live, and any knob you turn updates on their screen instantly. ' +
				'Multiplayer synth jam time.\n\n' +
				'Click BROWSE to see other public sessions currently online.'
		},
		{
			icon: Rocket,
			title: "You're ready to make sounds!",
			body:
				"That's the basics! Here are some recipes to get you started:\n\n" +
				'\u2022 BIG PAD: Two oscs (saw + saw, slightly detuned), unison ~5 voices, slow ' +
				'attack and long release, lowpass filter around 2kHz, big reverb.\n\n' +
				'\u2022 ACID BASS: Single saw osc, fast attack and short release, lowpass filter at ' +
				'~500Hz with high resonance, mono voice mode with a tiny bit of glide.\n\n' +
				'\u2022 PLUCK BELL: Pluck engine, low dampening, high resonance, add some chorus and ' +
				'a long reverb. Magical.\n\n' +
				'\u2022 FM BASS: FM engine, harmonicity = 1, mod index ~5, filter wide open. Punchy ' +
				'and modern.\n\n' +
				'\u2022 LO-FI BEAT BASS: any patch + bitcrusher at 6 bits + a touch of delay.\n\n' +
				'Have fun! Open this guide anytime via the GUIDE button up top.'
		}
	];

	function next() {
		lessonIndex = Math.min(lessons.length - 1, lessonIndex + 1);
	}
	function prev() {
		lessonIndex = Math.max(0, lessonIndex - 1);
	}
	function goto(i: number) {
		lessonIndex = i;
	}

	const lesson = $derived(lessons[lessonIndex]);
	const HeaderIcon = $derived(lesson.icon);

	function onKey(e: KeyboardEvent) {
		if (!open) return;
		if (e.key === 'Escape') open = false;
		else if (e.key === 'ArrowRight') next();
		else if (e.key === 'ArrowLeft') prev();
	}
</script>

<svelte:window onkeydown={onKey} />

<button
	class="rounded-full border border-surface1 bg-base/70 px-3 py-1 text-[10px] backdrop-blur-sm transition-colors hover:border-mauve hover:text-text"
	class:text-mauve={open}
	class:text-subtext1={!open}
	onclick={() => (open = true)}
	title="open the beginner's guide"
>
	guide
</button>

{#if open}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-40 bg-crust/70 backdrop-blur-sm"
		role="presentation"
		onclick={() => (open = false)}
		transition:fade={{ duration: 200, easing: cubicOut }}
	></div>

	<!-- Modal -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4"
		transition:scale={{ duration: 220, start: 0.96, easing: cubicOut }}
	>
		<div
			class="flex h-[min(80vh,640px)] w-[min(56rem,95vw)] overflow-hidden rounded-2xl border border-surface1 bg-mantle shadow-2xl"
			role="dialog"
			aria-label="ichor guide"
		>
			<!-- Sidebar: lesson list -->
			<aside
				class="flex w-56 shrink-0 flex-col gap-0.5 overflow-y-auto border-r border-surface1 bg-base/50 p-2"
			>
				<header class="px-2 pt-1 pb-2">
					<h2 class="text-[10px] tracking-widest text-subtext0 uppercase">guide</h2>
					<p class="mt-0.5 text-[9px] text-overlay1">{lessons.length} lessons</p>
				</header>
				{#each lessons as l, i}
					{@const Icon = l.icon}
					<button
						class="flex items-center gap-2 rounded px-2 py-1.5 text-left text-[11px] transition-colors"
						class:bg-mauve={i === lessonIndex}
						class:text-base={i === lessonIndex}
						class:hover:bg-surface0={i !== lessonIndex}
						class:text-subtext1={i !== lessonIndex}
						onclick={() => goto(i)}
					>
						<Icon size={14} class="shrink-0" />
						<span class="truncate leading-tight">{l.title}</span>
					</button>
				{/each}
			</aside>

			<!-- Content -->
			<div class="flex flex-1 flex-col overflow-hidden">
				<header class="flex items-center justify-between border-b border-surface0 px-5 py-3">
					<div class="flex items-center gap-3">
						<HeaderIcon size={28} class="text-mauve" />
						<div>
							<h3 class="font-medium text-base text-text">{lesson.title}</h3>
							<p class="text-[10px] tracking-widest text-overlay1 uppercase">
								lesson {lessonIndex + 1} of {lessons.length}
							</p>
						</div>
					</div>
					<button
						class="flex h-7 w-7 items-center justify-center rounded-full border border-surface1 text-subtext1 transition-colors hover:border-mauve hover:text-text"
						onclick={() => (open = false)}
						aria-label="close guide"
					>
						<X size={14} />
					</button>
				</header>

				<!-- Body: visual + text -->
				<div class="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
					{#if lesson.visual === 'wave'}
						<GuideWave />
					{:else if lesson.visual === 'envelope'}
						<GuideEnvelope />
					{:else if lesson.visual === 'filter'}
						<GuideFilter />
					{:else if lesson.visual === 'knob'}
						<GuideKnob />
					{:else if lesson.visual === 'lfo'}
						<GuideWave lfo />
					{:else if lesson.visual === 'unison'}
						<GuideWave unison />
					{/if}

					<p class="text-[12px] leading-relaxed whitespace-pre-line text-text">{lesson.body}</p>
				</div>

				<!-- Footer nav -->
				<footer class="flex items-center justify-between border-t border-surface0 px-5 py-3">
					<button
						class="rounded border border-surface1 bg-surface0 px-3 py-1 text-[11px] text-subtext1 transition-colors hover:border-mauve hover:text-text disabled:cursor-not-allowed disabled:opacity-30"
						onclick={prev}
						disabled={lessonIndex === 0}
					>
						‹ prev
					</button>

					<div class="flex gap-1">
						{#each lessons as _, i}
							<button
								class="h-1.5 w-1.5 rounded-full transition-colors"
								class:bg-mauve={i === lessonIndex}
								class:bg-surface2={i !== lessonIndex}
								onclick={() => goto(i)}
								aria-label={`go to lesson ${i + 1}`}
							></button>
						{/each}
					</div>

					<button
						class="rounded bg-mauve px-3 py-1 text-[11px] text-base transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
						onclick={next}
						disabled={lessonIndex === lessons.length - 1}
					>
						next ›
					</button>
				</footer>
			</div>
		</div>
	</div>
{/if}
