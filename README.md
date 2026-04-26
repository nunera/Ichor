# ichor

> A collaborative, hackable, browser-native synthesizer that grows with you.

**ichor** is a browser-native synthesizer built in Svelte 5 + SvelteKit. Two oscillators with swappable engines (subtractive, FM, AM, Karplus-Strong), a multi-mode filter, draggable LFOs, an effects rack, an arpeggiator, live coding via Strudel, and real-time collaborative sessions over Cloudflare Durable Objects. Nothing to install. Bring headphones.

```
       .  .   . .
       .  .  .. .       ichor
       . . .. . .       ─────
       .  .  . .        web synth · svelte 5 · cloudflare workers
        \ | /
         \|/
          o
```

---

## Status

A playable, hackable synth in the browser:

### Synthesis

- Two oscillators with **swappable engines**: BASIC (subtractive), FM, AM, and PLUCK (Karplus-Strong)
- Waveforms: sine / square / saw / triangle / pulse (with adjustable width)
- Per-osc octave / semi / fine detune, level, pan, enable
- **Unison** (1–7 voices) with stereo spread for fat supersaws (BASIC engine)
- **Sub oscillator** (1 or 2 octaves below) for added low-end weight
- **Noise generator** (white / pink / brown) with level + pan
- AHDSR envelope with a draggable visual editor and matching knobs
- Multi-mode filter (lowpass / highpass / bandpass / notch) with cutoff + resonance
- LFO → cutoff with rate, depth, shape (sine / square / saw), enable
- **Voice modes:** poly / mono / legato / scale, with glide time
  - Glide implemented via parallel mono `Tone.Synth` instances (PolySynth doesn't support portamento)
  - Pluck voicing uses a per-note `PluckSynth` Map (PluckSynth isn't `Monophonic`)

### Effects rack (right drawer)

- Distortion, Bitcrusher, Chorus, Ping-Pong Delay, Reverb
- Each with wet/dry mix and individual enable; chained left-to-right
- All effect params are addressable from Strudel patterns

### Performance & I/O

- Multi-octave keyboard (3 octaves) with mouse glissando, two rows of keybinds (`a–j` / `k–'`), `z` / `x` to shift octave
- **Pitch bend wheel** (±2 semitones, springs back) and **mod wheel** (boosts LFO depth)
- **Web MIDI** input support

### UI

- Live oscilloscope + spectrum analyser as the page header background
- 300+ built-in presets in a floating, physics-based picker (drag, hover, click to load)
- Live JSON patch editor on the left, **Strudel** + **Effects** drawers on the right — all built on **CodeMirror 6** with custom Catppuccin highlighting
- Three Catppuccin themes: **latte**, **mocha**, **sky**
- **Beginner's guide** modal: 15 lessons with embedded interactive visualizers (knob, waveform, envelope, filter)
- Lucide icons throughout

### Networking & live coding

- **Live multiplayer sessions** via Cloudflare Durable Objects: click "share" → get a URL → anyone who opens it edits the same patch in real time, with presence count
- **Live coding** via a custom Strudel lookahead scheduler (bypassing broken `@kabelsalat` internals): write patterns like `note("c3 eb3 g3 bb3").s("ichor").cutoff(sine.range(0.1, 0.9))` in the side drawer; every synth + effect param is a Strudel-addressable channel.

---

## Stack

- **Svelte 5** (runes) + **SvelteKit**
- **TypeScript** + **Zod** (canonical patch schema, validated at every write)
- **Tailwind CSS** v4 (Catppuccin tokens via `@theme inline`)
- **Tone.js** on top of the Web Audio API
- **Cloudflare Workers** (adapter: `sveltekit-adapter cloudflare+cfTarget:workers`)
- **Vite** for dev & build
- **ESLint** + **Prettier**

---

## Getting started

```sh
pnpm install
pnpm dev            # http://localhost:5173
pnpm dev -- --open
```

### Build

```sh
pnpm build
pnpm preview
```

### When to run `pnpm gen`

`pnpm gen` runs `wrangler types`, regenerating `worker-configuration.d.ts`
from `wrangler.jsonc`. The build script enforces these stay in sync via
`wrangler types --check` and will fail with:

```
Types at worker-configuration.d.ts are out of date. Run `wrangler types` to regenerate.
```

Run `pnpm gen` whenever you:

- add, remove, or rename a binding in `wrangler.jsonc` (Durable Object,
  KV, R2, D1, vars, secrets, etc.)
- change the `compatibility_date` or `compatibility_flags`
- add a new Durable Object class to the `migrations` array

You don't need to run it after every change to your code — only after
`wrangler.jsonc` changes. The generated file is committed to git so CI
also stays in sync.

### Deploy to Cloudflare

The project is configured with the Cloudflare Workers adapter (`wrangler.jsonc` is included).

```sh
pnpm build
pnpm dlx wrangler deploy
```

`pnpm build` runs three steps in order:

1. `wrangler types --check` — verifies `worker-configuration.d.ts` matches
   `wrangler.jsonc`. Run `pnpm gen` if it complains.
2. `vite build` — builds the SvelteKit app into `.svelte-kit/cloudflare/`.
3. `node scripts/inject-do.mjs` — esbuild-bundles the Durable Object
   classes (`PatchSession`, `Registry`) and appends them to the generated
   `_worker.js` so wrangler can find them. The Cloudflare adapter doesn't
   natively support DO exports, so this post-build step is required for
   the multiplayer session feature to work.

### Run locally only

It's a static-friendly SvelteKit app; `pnpm preview` is enough for local-only usage. No external services are required for layers 0–3.

---

## Project layout

```
src/
  lib/
    audio/
      patch.ts          # Zod schema, types, defaults, validators
      engine.svelte.ts  # AudioEngine: Tone graph, validated setters,
                        # subscribe API, write-source tagging
      presets.ts        # Built-in presets grouped by category
    server/
      PatchSession.ts       # Durable Object: holds canonical patch, fans out updates
    audio/
      session.svelte.ts     # Client-side websocket sync, coalesced per-frame
    audio/
      strudel.svelte.ts     # Custom lookahead scheduler + param routing
    ui/
      Keyboard.svelte       # Multi-octave keyboard, glissando, octave shift
      SoundDesign.svelte    # Two-row grid: osc1 / osc2 / filter then env / lfo
      OscCard.svelte        # Per-osc swappable engine UI (BASIC/FM/AM/Pluck)
      Envelope.svelte       # Draggable AHDSR + knob row, ResizeObserver-sized SVG
      LFOWave.svelte        # Inline LFO shape preview
      Knob.svelte           # Circular knob (drag, wheel, dblclick, exponential curves)
      Visualizer.svelte     # Canvas oscilloscope + spectrum, theme-aware
      ThemeToggle.svelte    # latte / mocha / sky picker
      PatchEditor.svelte    # CodeMirror 6 JSON editor in a sliding drawer
      StrudelDrawer.svelte  # CodeMirror 6 live coding drawer
      EffectsDrawer.svelte  # Distortion / bitcrusher / chorus / delay / reverb
      PitchModWheels.svelte # Pitch bend (sprung) + mod wheel
      PresetCloud.svelte    # Verlet-physics preset picker
      Guide.svelte          # 15-lesson beginner modal w/ live visualizers
      guide/                # GuideKnob, GuideWave, GuideEnvelope, GuideFilter
  routes/
    +page.svelte         # Layout: full-bleed visualizer header → controls → keys
    layout.css           # Catppuccin tokens (latte / mocha / sky)
```

### Architecture notes

- **Single source of truth.** `audio.patch` is `$state`; every UI input goes
  through a validated setter (`audio.setOsc1`, `setEnvelope`, …) that runs
  the input through Zod before mutating state or touching the audio graph.
- **Write-source tagging.** Every setter accepts `'ui' | 'editor' | 'remote' | 'midi' | 'strudel'`.
  Subscribers (JSON editor, websocket sync, Strudel) filter out their own
  source tag to prevent echo loops.
- **Partial-update gotcha.** Zod's `.default()` triggers on _missing_ keys,
  which silently reset sibling params during partial updates. `validateSection`
  filters the parsed output back down to the originally provided keys.
- **`audio.subscribe(fn)`** emits a `WriteEvent` after every change — the
  hook surface for bidirectional sync (URL hash, websockets, Strudel).
- **`audio.loadPatch(value, source)`** atomically validates and applies a full patch.

---

## Recreate this project

```sh
pnpm dlx sv@0.15.1 create --template minimal --types ts \
  --add prettier eslint tailwindcss="plugins:none" \
        sveltekit-adapter="adapter:cloudflare+cfTarget:workers" \
        mcp="ide:opencode" \
  --install pnpm Ichor
```

---

## Roadmap

Built in public, in small increments. The rough direction, loosest to firmest:

- **next:** patch persistence (save your own presets to localStorage / cloud)
- sampling (mic, file, tab capture)
- export (WAV / MP3 / stems / MIDI)
- granular / FM / wavetable synths
- AI helpers (vibe → arrangement, "more space", etc.)
- accessibility, gamepad / Pi controllers
- guided exploration & genre templates, Synplant-style sound exploration

Nothing here is committed to. It's a list of things that would be cool, in roughly the order they make sense to build. **Sequencing is intentionally out of scope** — that lane belongs to [Strudel](https://strudel.cc).

---

## Contributing

Open an issue describing the feature you want to take, or a sound you wish existed in the browser. Keep PRs small and focused.

Code style is enforced by Prettier + ESLint. Run `pnpm lint` and `pnpm check` before pushing.

---

## Why "ichor"

The fluid in the veins of the gods. Short, looks good in lowercase, and the domain was free.

---

## License

MIT.
