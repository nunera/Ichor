/**
 * Dev-time stub for the runtime-only `cloudflare:workers` module.
 *
 * The real module is provided by the Workers runtime; in `vite dev` (Node)
 * it doesn't exist. Vite is configured (vite.config.ts) to alias
 * `cloudflare:workers` → this file during dev so importing the module
 * doesn't crash. The Durable Object route never actually runs in `vite dev`
 * (no DO bindings), so the stubs are never invoked.
 */

export class DurableObject<_Env = unknown> {
	ctx: never;
	env: never;
	constructor(_ctx: unknown, _env: unknown) {
		this.ctx = undefined as never;
		this.env = undefined as never;
	}
}

// Add other exports here if you import more names from cloudflare:workers.
