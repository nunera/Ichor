/**
 * Standalone arpeggiator. Owns its own scheduler (Tone.Transport.scheduleRepeat)
 * and routes notes through audio.attack/release — same path as keyboard/MIDI.
 *
 * Keyboard.svelte funnels press/release through arp.hold/unhold; when the arp
 * is disabled those calls passthrough directly to the engine.
 *
 * `toStrudel()` snapshots the current/last chord and builds a Strudel
 * mini-notation pattern that the user can drop into the Strudel drawer.
 */

import * as Tone from 'tone';
import { audio } from './engine.svelte';

export type ArpPattern = 'up' | 'down' | 'updown' | 'random' | 'as-played';
export type ArpRate = '4n' | '8n' | '16n' | '8t' | '16t';

const RATE_LABEL: Record<ArpRate, string> = {
	'4n': '1/4',
	'8n': '1/8',
	'16n': '1/16',
	'8t': '1/8T',
	'16t': '1/16T'
};

const RATES: ArpRate[] = ['4n', '8n', '16n', '8t', '16t'];

class Arp {
	enabled = $state(false);
	pattern = $state<ArpPattern>('up');
	rate = $state<ArpRate>('8n');
	octaves = $state(1); // 1..4
	gate = $state(0.5); // 0.05..1.0 (fraction of a step)
	latch = $state(false);
	bpm = $state(120);

	readonly RATES = RATES;
	readonly RATE_LABEL = RATE_LABEL;

	#held = new Set<string>();
	#latched: string[] = [];
	#playOrder: string[] = [];
	#idx = 0;
	#updownDir: 1 | -1 = 1;
	#repeatId: number | null = null;
	#lastNote: string | null = null;
	#lastChord: string[] = [];

	/** UI: keyboard or MIDI sends a held note here. */
	hold(note: string) {
		if (!this.enabled) {
			audio.attack(note);
			return;
		}
		// Latched arp: when starting a new chord (no keys currently held),
		// clear the latched set so we don't accumulate forever.
		if (this.latch && this.#held.size === 0) this.#latched = [];
		this.#held.add(note);
		if (this.latch) {
			if (!this.#latched.includes(note)) this.#latched.push(note);
		}
		this.#rebuild();
	}

	/** UI: keyboard or MIDI lets go of a held note. */
	unhold(note: string) {
		if (!this.enabled) {
			audio.release(note);
			return;
		}
		this.#held.delete(note);
		// When latched, the note stays in #latched until the next fresh chord.
		this.#rebuild();
	}

	/** Stop everything. Called on panic/blur. */
	panic() {
		this.#held.clear();
		this.#latched = [];
		this.#playOrder = [];
		this.#lastNote = null;
		audio.releaseAll();
	}

	setEnabled(v: boolean) {
		if (this.enabled === v) return;
		this.enabled = v;
		if (v) this.#startScheduler();
		else this.#stopScheduler(true);
	}

	setPattern(p: ArpPattern) {
		this.pattern = p;
		this.#idx = 0;
		this.#updownDir = 1;
		this.#rebuild();
	}

	setRate(r: ArpRate) {
		this.rate = r;
		if (this.enabled) {
			this.#clearRepeat();
			this.#scheduleRepeat();
		}
	}

	setOctaves(n: number) {
		this.octaves = Math.max(1, Math.min(4, Math.round(n)));
		this.#rebuild();
	}

	setGate(g: number) {
		this.gate = Math.max(0.05, Math.min(1, g));
	}

	setLatch(l: boolean) {
		this.latch = l;
		if (!l) this.#latched = [];
		this.#rebuild();
	}

	setBpm(bpm: number) {
		this.bpm = Math.max(20, Math.min(300, bpm));
		Tone.getTransport().bpm.value = this.bpm;
	}

	/** Build a Strudel mini-notation pattern from the last/current chord. */
	toStrudel(): string {
		const chord = this.#lastChord.length ? this.#lastChord : [...this.#held];
		if (chord.length === 0) return `note("c3 eb3 g3 bb3").s("ichor")`;
		const seq = this.#buildSequence(chord).map((n) => n.toLowerCase());
		// Strudel: each cycle = 1 bar; step count chosen from rate.
		// 4n=4 steps/cycle, 8n=8, 16n=16, 8t=12, 16t=24.
		const stepsPerCycle: Record<ArpRate, number> = {
			'4n': 4,
			'8n': 8,
			'16n': 16,
			'8t': 12,
			'16t': 24
		};
		const cycles = Math.max(1, Math.ceil(seq.length / stepsPerCycle[this.rate]));
		const inner = seq.join(' ');
		// Use .fast() so the sequence runs at the chosen subdivision.
		// Length-aware: pattern auto-stretches to fit cycle.
		return `// arp: ${this.pattern} · ${RATE_LABEL[this.rate]} · ${this.octaves} oct\nnote("${inner}").s("ichor").fast(${cycles})`;
	}

	/* ---- internals ---- */

	#rebuild() {
		const source = this.latch && this.#latched.length ? this.#latched : [...this.#held];
		if (source.length === 0) {
			this.#playOrder = [];
			return;
		}
		this.#lastChord = source.slice();
		this.#playOrder = this.#buildSequence(source);
		if (this.#idx >= this.#playOrder.length) this.#idx = 0;
	}

	#buildSequence(notes: string[]): string[] {
		// Sort ascending by frequency unless 'as-played'.
		const ordered =
			this.pattern === 'as-played'
				? notes.slice()
				: notes
						.slice()
						.sort(
							(a, b) =>
								Tone.Frequency(a as Tone.Unit.Frequency).toFrequency() -
								Tone.Frequency(b as Tone.Unit.Frequency).toFrequency()
						);

		// Expand octaves upward.
		const expanded: string[] = [];
		for (let o = 0; o < this.octaves; o++) {
			for (const n of ordered) {
				expanded.push(
					Tone.Frequency(n as Tone.Unit.Frequency)
						.transpose(o * 12)
						.toNote()
				);
			}
		}

		switch (this.pattern) {
			case 'down':
				return expanded.reverse();
			case 'updown': {
				if (expanded.length <= 1) return expanded;
				return [...expanded, ...expanded.slice(1, -1).reverse()];
			}
			case 'random':
			case 'up':
			case 'as-played':
			default:
				return expanded;
		}
	}

	#startScheduler() {
		Tone.getTransport().bpm.value = this.bpm;
		if (Tone.getTransport().state !== 'started') Tone.getTransport().start();
		this.#scheduleRepeat();
	}

	#stopScheduler(releaseAll: boolean) {
		this.#clearRepeat();
		if (releaseAll) {
			audio.releaseAll();
			this.#lastNote = null;
		}
	}

	#clearRepeat() {
		if (this.#repeatId !== null) {
			Tone.getTransport().clear(this.#repeatId);
			this.#repeatId = null;
		}
	}

	#scheduleRepeat() {
		this.#repeatId = Tone.getTransport().scheduleRepeat((time) => this.#tick(time), this.rate);
	}

	#tick(time: number) {
		if (this.#playOrder.length === 0) return;

		let note: string;
		if (this.pattern === 'random') {
			note = this.#playOrder[Math.floor(Math.random() * this.#playOrder.length)];
		} else {
			note = this.#playOrder[this.#idx % this.#playOrder.length];
			this.#idx = (this.#idx + 1) % this.#playOrder.length;
		}

		const stepSec = Tone.Time(this.rate).toSeconds();
		const dur = Math.max(0.01, stepSec * this.gate);

		// audio.attack/release update #held synchronously even when `time` is in
		// the future, so back-to-back attack+release leaves #held empty and the
		// next tick can retrigger the same note.
		audio.attack(note, time);
		audio.release(note, time + dur);
		this.#lastNote = note;
	}
}

export const arp = new Arp();
