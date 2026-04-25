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

Early. Right now there's a single playable octave with a basic synth — the spine. Everything else gets built on top of that, one small piece at a time.

---

## Stack

- **Svelte 5** (runes) + **SvelteKit**
- **TypeScript**
- **Tailwind CSS**
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
    audio/        # Web Audio graph, voices, scheduler
    dsp/          # AudioWorklet processors (filters, fx, synths)
    ui/           # Keyboard, knobs, sequencer, piano roll
    state/        # Runes-based stores (project, transport, patches)
    midi/         # Web MIDI + gamepad + websocket controllers
  routes/         # SvelteKit routes
static/           # Drum samples, presets, icons
```

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

- groovebox / step sequencer
- sampling (mic, file, tab capture)
- sound design (ADSR, filters, second osc, LFO)
- effects rack (reverb, delay, distortion, eq, comp)
- guided exploration & genre templates
- Synplant-style sound exploration
- piano roll, arpeggiator, euclidean rhythms
- accessibility, Web MIDI, gamepad / Pi controllers
- AI helpers (vibe → arrangement, "more space", etc.)
- export (WAV / MP3 / stems / MIDI), save, multiplayer (Durable Objects), shareable links
- visualizers, granular / FM / wavetable synths

Nothing here is committed to. It's a list of things that would be cool, in roughly the order they make sense to build.

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
