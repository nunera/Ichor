import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/** Returns the current public list of broadcasted sessions. */
export const GET: RequestHandler = async ({ platform }) => {
	if (!platform?.env?.REGISTRY) {
		// Local dev (no DO bindings): return empty list silently.
		return json([]);
	}
	const stub = platform.env.REGISTRY.get(platform.env.REGISTRY.idFromName('global'));
	const res = await stub.fetch('https://registry/list');
	if (!res.ok) throw error(502, 'registry error');
	return json(await res.json());
};
