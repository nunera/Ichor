import { audio, type WriteEvent } from './engine.svelte';

/**
 * Live websocket sync to a server-side Durable Object that holds the
 * canonical patch for a session. Writes coming from the UI are pushed up;
 * writes coming from the server are applied with source 'remote' so the
 * `subscribe` filter ignores them on the way back out (no echo loop).
 *
 * Robustness:
 *   - 15s liveness ping to the DO; the server replies with the
 *     authoritative presence count, so any drift in our local `peers`
 *     value is corrected automatically.
 *   - If the socket closes unexpectedly while a session is active,
 *     reconnects with backoff up to 30s.
 *
 * Public surface:
 *   session.connected, session.id, session.peers          — reactive state
 *   session.broadcasting, session.broadcastName          — reactive state
 *   session.connect(id)                                   — open ws
 *   session.disconnect()                                  — close ws (no reconnect)
 *   session.broadcast(name?), session.unbroadcast()       — public listing toggle
 */
export type RemoteCursor = { x: number; y: number; color: string; updatedAt: number };

/** Stable hash → hue mapping so each peer gets a consistent color. */
function colorFor(id: string): string {
	let h = 0;
	for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
	return `hsl(${h % 360} 80% 65%)`;
}

class SessionClient {
	connected = $state(false);
	id = $state<string | null>(null);
	peers = $state(0);
	broadcasting = $state(false);
	broadcastName = $state<string | null>(null);
	peerId = $state<string | null>(null);
	cursors = $state<Map<string, RemoteCursor>>(new Map());

	#ws: WebSocket | null = null;
	#unsub: (() => void) | null = null;
	#pending = new Map<string, unknown>();
	#flushScheduled = false;
	#cursorScheduled = false;
	#pendingCursor: { x: number; y: number } | null = null;

	#pingTimer: ReturnType<typeof setInterval> | null = null;
	#reconnectTimer: ReturnType<typeof setTimeout> | null = null;
	#reconnectAttempts = 0;
	#shouldStayConnected = false;

	connect(id: string) {
		if (this.connected && this.id === id) return;
		// Disconnect tears everything down AND clears `shouldStayConnected`,
		// so set it after.
		this.disconnect();
		this.id = id;
		this.#shouldStayConnected = true;
		this.#open();
	}

	#open() {
		if (!this.id || !this.#shouldStayConnected) return;

		const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
		const url = `${proto}//${location.host}/s/${encodeURIComponent(this.id)}/ws`;
		const ws = new WebSocket(url);
		this.#ws = ws;

		ws.addEventListener('open', () => {
			this.connected = true;
			this.#reconnectAttempts = 0;
			// Ping every 15s so the server can correct any presence drift
			// (e.g. after DO hibernation or a half-open connection).
			this.#pingTimer = setInterval(() => {
				if (ws.readyState === WebSocket.OPEN) {
					try {
						ws.send(JSON.stringify({ type: 'ping' }));
					} catch {
						/* ignore */
					}
				}
			}, 15_000);
		});

		ws.addEventListener('message', (e) => this.#onMessage(e.data));

		ws.addEventListener('close', () => {
			this.connected = false;
			this.peers = 0;
			this.#clearPing();
			if (this.#shouldStayConnected) this.#scheduleReconnect();
		});

		ws.addEventListener('error', () => {
			// `close` fires after `error`; let the close handler drive reconnect.
			this.connected = false;
		});

		// Ensure exactly one local subscription is active.
		if (!this.#unsub) {
			this.#unsub = audio.subscribe((ev) => this.#onLocalWrite(ev));
		}
	}

	#scheduleReconnect() {
		if (this.#reconnectTimer) return;
		this.#reconnectAttempts++;
		// Exponential backoff capped at 30s.
		const delay = Math.min(30_000, 500 * 2 ** Math.min(this.#reconnectAttempts, 6));
		this.#reconnectTimer = setTimeout(() => {
			this.#reconnectTimer = null;
			this.#open();
		}, delay);
	}

	#clearPing() {
		if (this.#pingTimer) {
			clearInterval(this.#pingTimer);
			this.#pingTimer = null;
		}
	}

	#clearReconnect() {
		if (this.#reconnectTimer) {
			clearTimeout(this.#reconnectTimer);
			this.#reconnectTimer = null;
		}
		this.#reconnectAttempts = 0;
	}

	disconnect() {
		this.#shouldStayConnected = false;
		this.#clearPing();
		this.#clearReconnect();
		this.#teardownSubscription();
		if (this.#ws) {
			try {
				this.#ws.close();
			} catch {
				/* ignore */
			}
			this.#ws = null;
		}
		this.connected = false;
		this.id = null;
		this.peers = 0;
		this.broadcasting = false;
		this.broadcastName = null;
		this.peerId = null;
		this.cursors = new Map();
	}

	broadcast(name?: string) {
		if (this.#ws?.readyState !== WebSocket.OPEN) return;
		this.#ws.send(JSON.stringify({ type: 'broadcast', name }));
	}

	unbroadcast() {
		if (this.#ws?.readyState !== WebSocket.OPEN) return;
		this.#ws.send(JSON.stringify({ type: 'unbroadcast' }));
	}

	/**
	 * Queue a cursor update (normalized 0..1 coords). Coalesced to one send
	 * per requestAnimationFrame so a fast-moving pointer becomes ~60 Hz on
	 * the wire instead of hundreds of events.
	 */
	sendCursor(x: number, y: number) {
		if (!this.connected) return;
		this.#pendingCursor = { x, y };
		if (this.#cursorScheduled) return;
		this.#cursorScheduled = true;
		requestAnimationFrame(() => {
			this.#cursorScheduled = false;
			const c = this.#pendingCursor;
			this.#pendingCursor = null;
			if (!c || this.#ws?.readyState !== WebSocket.OPEN) return;
			this.#ws.send(JSON.stringify({ type: 'cursor', x: c.x, y: c.y }));
		});
	}

	#teardownSubscription() {
		if (this.#unsub) {
			this.#unsub();
			this.#unsub = null;
		}
	}

	#onMessage(raw: unknown) {
		if (typeof raw !== 'string') return;
		let msg: { type?: string } & Record<string, unknown>;
		try {
			msg = JSON.parse(raw);
		} catch {
			return;
		}

		if (msg.type === 'hello') {
			audio.loadPatch(msg.patch, 'remote');
			if (typeof msg.presence === 'number') this.peers = msg.presence;
			this.broadcasting = msg.broadcast === true;
			this.broadcastName = typeof msg.name === 'string' ? msg.name : null;
			this.peerId = typeof msg.peerId === 'string' ? msg.peerId : null;
		} else if (msg.type === 'patch') {
			audio.loadPatch(msg.patch, 'remote');
		} else if (msg.type === 'section') {
			const section = msg.section as 'osc1' | 'osc2' | 'env' | 'filter' | 'lfo1' | 'lfo2';
			const value = msg.value as Record<string, unknown>;
			if (section === 'osc1') audio.setOsc1(value, 'remote');
			else if (section === 'osc2') audio.setOsc2(value, 'remote');
			else if (section === 'env') audio.setEnvelope(value, 'remote');
			else if (section === 'filter') audio.setFilter(value, 'remote');
			else if (section === 'lfo1') audio.setLFO1(value, 'remote');
			else if (section === 'lfo2') audio.setLFO2(value, 'remote');
		} else if (msg.type === 'presence') {
			if (typeof msg.count === 'number') this.peers = msg.count;
		} else if (msg.type === 'broadcastState') {
			this.broadcasting = msg.broadcast === true;
			this.broadcastName = typeof msg.name === 'string' ? msg.name : null;
		} else if (msg.type === 'cursor') {
			const from = msg.from as string | undefined;
			const x = msg.x as number | undefined;
			const y = msg.y as number | undefined;
			if (!from || typeof x !== 'number' || typeof y !== 'number') return;
			const next = new Map(this.cursors);
			next.set(from, { x, y, color: colorFor(from), updatedAt: Date.now() });
			this.cursors = next;
		} else if (msg.type === 'leave') {
			const from = msg.from as string | undefined;
			if (!from) return;
			const next = new Map(this.cursors);
			next.delete(from);
			this.cursors = next;
		}
	}

	#onLocalWrite(ev: WriteEvent) {
		if (!this.#ws || this.#ws.readyState !== WebSocket.OPEN) return;
		if (ev.source !== 'ui' && ev.source !== 'editor') return;

		if (ev.section === 'all') {
			this.#ws.send(JSON.stringify({ type: 'patch', patch: ev.value }));
			return;
		}

		const key = ev.section;
		this.#pending.set(key, { ...(this.#pending.get(key) as object | undefined), ...ev.value });

		if (!this.#flushScheduled) {
			this.#flushScheduled = true;
			requestAnimationFrame(() => this.#flush());
		}
	}

	#flush() {
		this.#flushScheduled = false;
		if (!this.#ws || this.#ws.readyState !== WebSocket.OPEN) {
			this.#pending.clear();
			return;
		}
		for (const [section, value] of this.#pending) {
			this.#ws.send(JSON.stringify({ type: 'section', section, value }));
		}
		this.#pending.clear();
	}
}

export const session = new SessionClient();

/** Generate a short, URL-friendly session id. */
export function newSessionId(): string {
	const bytes = new Uint8Array(6);
	crypto.getRandomValues(bytes);
	return Array.from(bytes, (b) => b.toString(36).padStart(2, '0')).join('');
}
