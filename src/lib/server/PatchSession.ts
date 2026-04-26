import { DurableObject } from 'cloudflare:workers';
import { defaultPatch, validatePatch, type Patch } from '$lib/audio/patch';

/**
 * One Durable Object instance per session. Holds the canonical patch and
 * fans out updates to every connected websocket. All inbound messages are
 * Zod-validated before being applied or rebroadcast.
 *
 * Wire protocol (JSON, both directions):
 *   { type: 'hello', patch, presence, broadcast, name? }   // server → new client
 *   { type: 'patch', patch }                                // both, full replace
 *   { type: 'section', section, value }                     // both, partial update
 *   { type: 'presence', count }                             // server → all
 *   { type: 'broadcast', name? }                            // client → server
 *   { type: 'unbroadcast' }                                 // client → server
 *   { type: 'broadcastState', broadcast, name? }            // server → all
 *
 * Presence accounting note:
 *   We never trust an in-memory Set for the live socket count. The DO can
 *   hibernate and lose any in-process state; the runtime, however, keeps
 *   hibernated sockets attached and surfaces them via ctx.getWebSockets().
 *   That call is the single source of truth for presence.
 */
export class PatchSession extends DurableObject<Env> {
	async fetch(req: Request): Promise<Response> {
		if (req.headers.get('upgrade') !== 'websocket') {
			return new Response('expected websocket', { status: 426 });
		}

		const url = new URL(req.url);
		const sessionId = url.searchParams.get('id') ?? '';
		await this.ctx.storage.put('sessionId', sessionId);

		const pair = new WebSocketPair();
		const client = pair[0];
		const server = pair[1];

		this.ctx.acceptWebSocket(server);

		// Live count includes the socket we just accepted.
		const presence = this.#presence();
		const patch = await this.#getPatch();
		const broadcast = (await this.ctx.storage.get<boolean>('broadcast')) ?? false;
		const name = await this.ctx.storage.get<string>('name');
		server.send(
			JSON.stringify({
				type: 'hello',
				patch,
				presence,
				broadcast,
				name
			})
		);
		// Notify everyone else of the new arrival.
		this.#fanout({ type: 'presence', count: presence }, server);
		await this.#syncRegistry();

		return new Response(null, { status: 101, webSocket: client });
	}

	async webSocketMessage(ws: WebSocket, raw: ArrayBuffer | string) {
		if (typeof raw !== 'string') return;
		let msg: unknown;
		try {
			msg = JSON.parse(raw);
		} catch {
			return;
		}

		const m = msg as { type?: string };
		try {
			if (m.type === 'patch') {
				const next = validatePatch((m as { patch: unknown }).patch);
				await this.ctx.storage.put('patch', next);
				this.#fanout({ type: 'patch', patch: next }, ws);
			} else if (m.type === 'section') {
				const { section, value } = m as { section: string; value: unknown };
				if (!['osc1', 'osc2', 'env', 'filter', 'lfo'].includes(section)) return;
				const current = await this.#getPatch();
				const merged: Patch = {
					...current,
					[section]: { ...current[section as keyof Patch], ...(value as object) }
				};
				const next = validatePatch(merged);
				await this.ctx.storage.put('patch', next);
				this.#fanout({ type: 'section', section, value: next[section as keyof Patch] }, ws);
			} else if (m.type === 'broadcast') {
				const name = (m as { name?: string }).name?.toString().slice(0, 64) || undefined;
				await this.ctx.storage.put('broadcast', true);
				if (name) await this.ctx.storage.put('name', name);
				else await this.ctx.storage.delete('name');
				this.#fanout({ type: 'broadcastState', broadcast: true, name });
				await this.#syncRegistry();
			} else if (m.type === 'unbroadcast') {
				await this.ctx.storage.put('broadcast', false);
				this.#fanout({ type: 'broadcastState', broadcast: false });
				await this.#syncRegistry();
			} else if (m.type === 'ping') {
				// Liveness ping. Reply with the authoritative presence count so
				// clients can self-correct any drift.
				try {
					ws.send(JSON.stringify({ type: 'presence', count: this.#presence() }));
				} catch {
					/* socket gone — next ctx.getWebSockets() call will exclude it */
				}
			}
		} catch {
			// Validation/registry failure: ignore.
		}
	}

	async webSocketClose(ws: WebSocket, _code: number, _reason: string, _wasClean: boolean) {
		// Explicitly close the server-side ws so the runtime drops it from
		// ctx.getWebSockets() before we count.
		try {
			ws.close();
		} catch {
			/* already closing */
		}
		this.#fanout({ type: 'presence', count: this.#presence() });
		await this.#syncRegistry();
	}

	async webSocketError(ws: WebSocket, _error: unknown) {
		try {
			ws.close();
		} catch {
			/* already closing */
		}
		this.#fanout({ type: 'presence', count: this.#presence() });
		await this.#syncRegistry();
	}

	/**
	 * Authoritative live-socket count. Filters by readyState so half-open or
	 * just-closed sockets that haven't been reaped yet aren't counted.
	 */
	#presence(): number {
		let n = 0;
		for (const ws of this.ctx.getWebSockets()) {
			if (ws.readyState === WebSocket.OPEN) n++;
		}
		return n;
	}

	async #getPatch(): Promise<Patch> {
		const stored = (await this.ctx.storage.get('patch')) as Patch | undefined;
		return stored ?? defaultPatch;
	}

	#fanout(msg: object, except?: WebSocket) {
		const payload = JSON.stringify(msg);
		// Iterate ctx.getWebSockets() — survives hibernation, no in-memory state.
		for (const ws of this.ctx.getWebSockets()) {
			if (ws === except) continue;
			if (ws.readyState !== WebSocket.OPEN) continue;
			try {
				ws.send(payload);
			} catch {
				// If sending fails, the socket is dead; close it so the next
				// ctx.getWebSockets() call won't include it.
				try {
					ws.close();
				} catch {
					/* ignore */
				}
			}
		}
	}

	/** Push current state into the global registry (or remove if not broadcasting). */
	async #syncRegistry() {
		const id = await this.ctx.storage.get<string>('sessionId');
		const broadcast = await this.ctx.storage.get<boolean>('broadcast');
		const name = await this.ctx.storage.get<string>('name');
		if (!id || !this.env.REGISTRY) return;

		const stub = this.env.REGISTRY.get(this.env.REGISTRY.idFromName('global'));
		const peers = this.#presence();

		if (broadcast && peers > 0) {
			await stub.fetch('https://registry/register', {
				method: 'POST',
				body: JSON.stringify({ id, name, peers })
			});
		} else {
			await stub.fetch('https://registry/unregister', {
				method: 'POST',
				body: JSON.stringify({ id })
			});
		}
	}
}
