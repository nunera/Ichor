import { DurableObject } from 'cloudflare:workers';

/**
 * Singleton registry of currently broadcasted sessions. Browser clients
 * fetch GET /api/sessions to discover joinable sessions; PatchSession
 * instances POST to register / unregister / heartbeat themselves.
 */

export type Listing = {
	id: string;
	name?: string;
	peers: number;
	updatedAt: number;
};

// Sessions older than this without a heartbeat are pruned on read.
const STALE_MS = 60_000;

export class Registry extends DurableObject<Env> {
	async fetch(req: Request): Promise<Response> {
		const url = new URL(req.url);

		if (req.method === 'GET' && url.pathname.endsWith('/list')) {
			return this.#json(await this.#list());
		}

		if (req.method === 'POST' && url.pathname.endsWith('/register')) {
			const body = (await req.json()) as { id: string; name?: string; peers: number };
			if (!body.id) return new Response('id required', { status: 400 });
			await this.ctx.storage.put(`s:${body.id}`, {
				id: body.id,
				name: body.name?.slice(0, 64),
				peers: Math.max(0, body.peers | 0),
				updatedAt: Date.now()
			} satisfies Listing);
			return new Response('ok');
		}

		if (req.method === 'POST' && url.pathname.endsWith('/unregister')) {
			const body = (await req.json()) as { id: string };
			if (!body.id) return new Response('id required', { status: 400 });
			await this.ctx.storage.delete(`s:${body.id}`);
			return new Response('ok');
		}

		return new Response('not found', { status: 404 });
	}

	async #list(): Promise<Listing[]> {
		const all = await this.ctx.storage.list<Listing>({ prefix: 's:' });
		const now = Date.now();
		const fresh: Listing[] = [];
		const stale: string[] = [];
		for (const [key, listing] of all) {
			if (now - listing.updatedAt > STALE_MS) stale.push(key);
			else fresh.push(listing);
		}
		if (stale.length) await this.ctx.storage.delete(stale);
		// Newest activity first.
		fresh.sort((a, b) => b.updatedAt - a.updatedAt);
		return fresh;
	}

	#json(value: unknown) {
		return new Response(JSON.stringify(value), {
			headers: { 'content-type': 'application/json' }
		});
	}
}
