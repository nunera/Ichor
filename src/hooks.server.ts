/**
 * Re-export Durable Object classes so the Cloudflare Workers adapter
 * bundles them into the worker entry. Without this, wrangler can't bind
 * the class even if it's referenced from a route.
 */
export { PatchSession } from '$lib/server/PatchSession';
export { Registry } from '$lib/server/Registry';
