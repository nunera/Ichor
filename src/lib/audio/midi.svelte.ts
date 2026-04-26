import { audio } from './engine.svelte';

/**
 * Web MIDI bridge. Requests access lazily (first call to enable()), then
 * listens to every input port. Note On / Off are forwarded to the engine
 * with source 'midi' so the bidirectional sync layer treats them as
 * authoritative-but-non-echoable writes.
 */

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function midiToNote(n: number): string {
	const octave = Math.floor(n / 12) - 1;
	return `${NOTE_NAMES[n % 12]}${octave}`;
}

class MIDIBridge {
	supported = $state(typeof navigator !== 'undefined' && 'requestMIDIAccess' in navigator);
	enabled = $state(false);
	error = $state<string | null>(null);
	inputs = $state<string[]>([]);

	#access: MIDIAccess | null = null;
	#held = new Set<string>();

	async enable() {
		if (!this.supported) {
			this.error = 'Web MIDI not supported in this browser';
			return;
		}
		if (this.enabled) return;
		try {
			this.#access = await navigator.requestMIDIAccess({ sysex: false });
			this.#refreshInputs();
			this.#access.onstatechange = () => this.#refreshInputs();
			this.enabled = true;
			this.error = null;
		} catch (e) {
			this.error = e instanceof Error ? e.message : String(e);
		}
	}

	disable() {
		if (!this.#access) return;
		for (const input of this.#access.inputs.values()) input.onmidimessage = null;
		this.#access = null;
		this.enabled = false;
		this.inputs = [];
		// Release any notes the MIDI device might still think it's holding.
		for (const note of this.#held) audio.release(note);
		this.#held.clear();
	}

	#refreshInputs() {
		if (!this.#access) return;
		const names: string[] = [];
		for (const input of this.#access.inputs.values()) {
			names.push(input.name ?? input.id);
			input.onmidimessage = (ev) => this.#onMessage(ev);
		}
		this.inputs = names;
	}

	async #onMessage(ev: MIDIMessageEvent) {
		const data = ev.data;
		if (!data || data.length < 2) return;
		const status = data[0] & 0xf0;

		if (status === 0x90 && data[2] > 0) {
			// Audio context needs a user gesture; MIDI events count.
			await audio.start();
			const note = midiToNote(data[1]);
			this.#held.add(note);
			audio.attack(note);
		} else if (status === 0x80 || (status === 0x90 && data[2] === 0)) {
			const note = midiToNote(data[1]);
			this.#held.delete(note);
			audio.release(note);
		}
		// CCs (0xB0) ignored for now; mapping them to patch setters with
		// source 'midi' is the next step.
	}
}

export const midi = new MIDIBridge();
