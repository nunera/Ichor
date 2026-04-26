# ichor

> A web-based synthesizer that grows with you.

**ichor** is a browser-native music workstation built in Svelte 5 + SvelteKit. It starts as a one-finger piano and unfolds, layer by layer, into a sampler, groovebox, sound designer, effects rack, generative explorer, and collaborative DAW. Nothing to install. Bring headphones.

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

**Layer 1 — sound design.** A playable Serum-inspired synth in the browser:

- Two oscillators (sine / square / saw / triangle) with octave / semi / fine detune, level, enable
- AHDSR envelope with a draggable visual editor and matching knobs
- Lowpass filter (24 dB) with cutoff + resonance
- LFO → cutoff with rate, depth, enable
- Multi-octave keyboard (3 octaves) with mouse glissando, two rows of keybinds (`a–j` / `k–'`), `z` / `x` to shift octave
- Live oscilloscope + spectrum analyser as the page header background, toggle in the top-left
- 30+ built-in presets in a floating, physics-based picker (drag nodes, hover to highlight category connections, click to load)
- Live JSON patch editor (Cmd/Ctrl-S to apply) tucked behind a sliding trapezoid flag on the left edge
- Three Catppuccin themes: **latte**, **mocha**, **sky** (mocha with a sky-blue accent + purple secondary)

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

### Deploy to Cloudflare

The project is configured with the Cloudflare Workers adapter (`wrangler.jsonc` is included).

```sh
pnpm build
pnpm dlx wrangler deploy
```

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
    ui/
      Keyboard.svelte       # Multi-octave keyboard, glissando, octave shift
      SoundDesign.svelte    # Two-row grid: osc1 / osc2 / filter then env / lfo
      OscCard.svelte        # Per-osc waveform display + 4 knobs
      Envelope.svelte       # Draggable AHDSR + knob row, ResizeObserver-sized SVG
      LFOWave.svelte        # Inline LFO shape preview
      Knob.svelte           # Circular knob (drag, wheel, dblclick, exponential curves)
      Visualizer.svelte     # Canvas oscilloscope + spectrum, theme-aware
      ThemeToggle.svelte    # latte / mocha / sky picker
      PatchEditor.svelte    # Sliding drawer + trapezoid flag, live JSON
      PresetCloud.svelte    # Verlet-physics preset picker, lives in the blur space
  routes/
    +page.svelte         # Layout: full-bleed visualizer header → controls → keys
    layout.css           # Catppuccin tokens (latte / mocha / sky)
```

### Architecture notes

- **Single source of truth.** `audio.patch` is `$state`; every UI input goes
  through a validated setter (`audio.setOsc1`, `setEnvelope`, …) that runs
  the input through Zod before mutating state or touching the audio graph.
- **Write-source tagging.** Every setter accepts `'ui' | 'editor' | 'remote' | 'midi'`.
  The JSON editor and (eventually) network sync subscribe to writes and
  filter out their own source tag to prevent echo loops.
- **`audio.subscribe(fn)`** emits a `WriteEvent` after every change. This is
  the surface bidirectional sync (URL hash, websockets, Strudel) will hook into.
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

- **next:** Strudel param hook (sequencing handled externally), URL-hash share links
- **then:** Cloudflare Durable Object websocket sync (live multiplayer patches)
- effects rack (reverb, delay, distortion, eq, comp)
- pitch bend + mod wheel, Web MIDI
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
