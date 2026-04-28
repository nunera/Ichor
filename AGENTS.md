# Agent Instructions

Repo-wide guidance for AI coding assistants working in **ichor**.
Read this once per session before making non-trivial changes.

---

## Project

- **Stack:** Svelte 5 (runes) + SvelteKit, TypeScript, Zod, Tailwind v4 (Catppuccin), Tone.js, Cloudflare Workers (DO).
- **Package manager:** pnpm. Never use npm/yarn.
- **Adapter:** `sveltekit-adapter cloudflare+cfTarget:workers`. Durable Objects are appended post-build by `scripts/inject-do.mjs`.

## Commands

- `pnpm dev` — Vite dev server.
- `pnpm check` — `wrangler types --check && svelte-kit sync && svelte-check`. Run before declaring work done.
- `pnpm gen` — regenerate `worker-configuration.d.ts` from `wrangler.jsonc`. Only needed when bindings / compat date / DO migrations change.
- `pnpm build` — full build incl. DO injection. `pnpm preview` to serve locally.

## Architecture rules

1. **`audio.patch` is the single source of truth.** It's a `$state<Patch>` validated by Zod (`src/lib/audio/patch.ts`). Every UI input, network message, MIDI event, and Strudel control writes through a validated setter (`audio.setOsc1`, `setFilter`, …) — never mutate `audio.patch` directly outside the engine.

2. **Write-source tagging.** Every setter accepts `'ui' | 'editor' | 'remote' | 'midi' | 'init' | 'preview'` (see `WriteSource` in `engine.svelte.ts`). Subscribers (JSON editor, websocket sync, persistence) filter out their own source tag to prevent echo loops. Always pass an appropriate source when writing on behalf of a non-UI surface. **`'preview'`** is specifically _not_ broadcast over the websocket — use it for ephemeral writes (preset hover, etc.) that shouldn't spam co-listeners. (Strudel currently writes as `'ui'`; if you need to disambiguate, add a `'strudel'` source to the union and update the websocket filter.)

3. **`validateSection` partial-update gotcha.** Zod's `.default()` triggers on missing keys, which would silently reset sibling params. `validateSection` filters parsed output back down to _originally provided_ keys. Don't bypass it; don't `parse()` a partial yourself.

4. **`audio.subscribe(fn)` emits a `WriteEvent` after every change.** This is the hook for bidirectional sync. Add new sections to the `WriteEvent` union and emit consistently.

5. **`audio.loadPatch(value, source)` is the only path for whole-patch replacement.** It validates first, then applies every section atomically, then emits one `'all'` event. It guards against being called before `audio.start()` (graph nodes may be null).

## Adding things

- **New patch field** → schema in `patch.ts` (with bounds + `.default()`), partial entry in `SectionPartials`, defaults in `defaultPatch`, an applier in `engine.svelte.ts`, a setter that validates + emits.
- **New mod target** (knob → LFO target) → register in `#registerModTargets` with `id` (`'group.label'`), `min`, `max`, optional `curve` (matches the Knob's `curve` for consistent feel), `getBase`, `apply`. Then pass `target="group.label"` to the Knob component. The convention is: every continuous knob should have a `target=` — only stepped/discrete UI (buttons, mode pickers, integer steppers like octave) is excluded. `apply` may be a no-op if the underlying parameter is only sampled at note-attack (envelopes, pluck params on existing voices) — the registration is still useful for cross-LFO modulation.
- **Per-route amount targets** are auto-managed via `#syncRouteAmtTargets()` whenever routes mutate or a patch loads. Id format: `lfoN.route.{targetId}.amount`. The mod-tick reads `liveMod.get(...)` for those ids with one frame of lag (acceptable, inaudible).
- **New patch shape (breaking)** → write a Zod preprocessor (see `migrateLegacyLfo`) so 300+ presets keep parsing. Don't rewrite presets.

## Engine gotchas

- `Tone.PolySynth` doesn't support portamento (allocates fresh voice per attack). Glide modes route through parallel `#osc1Mono`/`#osc2Mono` `Tone.Synth` instances.
- `Tone.PluckSynth` isn't `Monophonic` and can't be wrapped in `PolySynth`. Pluck slots use a per-note `Map<note, PluckSynth>` allocated/disposed manually.
- **`Tone.PolySynth.set({ oscillator: { type } })` only updates the prototype voice options — already-allocated voice instances keep their original waveform until disposed.** This bit the sub-osc waveform picker for ages. When changing the oscillator class on a PolySynth, dispose and rebuild it (see `#rebuildOscSynth`, `#rebuildSubSynth`). Setting _non-oscillator-class_ params (detune, envelope, harmonicity, modulationIndex, gain) via `.set` is fine and propagates to live voices.
- LFOs are software-driven by `requestAnimationFrame` in `#modTick`, not connected to the audio graph. Phase is tracked manually so they run regardless of `Tone.Transport`. Modulation happens in _knob-space_ and is converted back through the target's `curve`. LFO rate and per-route amount are themselves modulatable targets — those reads happen with one frame of lag (the previous tick's `liveMod` value).
- The arpeggiator (`arp.svelte.ts`) wraps `audio.attack/release`; when disabled it's a transparent passthrough. Keyboard, MIDI, and Strudel all funnel through it.

## Style

- **Svelte 5 runes only.** `$state`, `$derived`, `$props`, `$effect`. No `export let`, no `$:`, no stores, no `<svelte:component>`. Use class-based shared state with `$state` fields (see `arp.svelte.ts`, `keyboard.svelte.ts`, `dragMod.svelte.ts`).
- **Avoid `$effect` for derived data.** Use `$derived` / `$derived.by`. Effects are for syncing to external systems only.
- **Keyed `{#each}`** with stable keys. Never use index as key.
- **Tailwind v4 with Catppuccin tokens** — `bg-base`, `text-text`, `text-subtext0`, `text-overlay1`, `bg-mauve`, etc. Three themes (`latte`, `mocha`, `sky`) all use the same token names; don't hard-code colors.
- **Lucide icons** for any new iconography.
- Prettier + ESLint enforce style. Run `pnpm lint` and `pnpm check` before declaring work done.

## Don'ts

- Don't commit unless explicitly asked.
- Don't add documentation files (`*.md`) proactively. The user will ask.
- Don't introduce sequencing primitives — that's intentionally out of scope (Strudel handles it).
- Don't break preset compatibility. If you must, add a Zod preprocessor for migration.
- Don't use `console.log` for "telemetry"; only for debugging that you remove.

---

## Svelte MCP tools

Use the Svelte MCP server proactively whenever writing or analyzing Svelte 5 / SvelteKit code.

- **`list-sections`** — call FIRST to discover available docs. Match `use_cases` against the task at hand.
- **`get-documentation`** — fetch ALL relevant sections in one call (it accepts arrays). Cheaper than guessing from memory.
- **`svelte-autofixer`** — MUST be called on any new/edited Svelte component or `.svelte.ts` module before sending the result. Loop until no issues.
- **`playground-link`** — only after the user confirms they want one, and only if the code wasn't written to project files.
