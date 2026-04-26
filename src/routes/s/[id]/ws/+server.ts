import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Upgrade endpoint: /s/<id>/ws → forwards the websocket request to the
 * Durable Object instance keyed by <id>. The session id is passed as a
 * query string so the DO can record it (useful for the public registry).
 */
export const GET: RequestHandler = async ({ params, request, platform }) => {
	if (!platform?.env?.PATCH_SESSION) {
		throw error(500, 'Durable Object binding not available');
	}
	if (request.headers.get('upgrade') !== 'websocket') {
		throw error(426, 'expected websocket upgrade');
	}

	const id = platform.env.PATCH_SESSION.idFromName(params.id);
	const stub = platform.env.PATCH_SESSION.get(id);

	const url = new URL(request.url);
	url.searchParams.set('id', params.id);
	const forwarded = new Request(url.toString(), request);
	return stub.fetch(forwarded);
};
