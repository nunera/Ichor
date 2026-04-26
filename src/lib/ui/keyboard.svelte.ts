/**
 * Shared keyboard octave state. Lives outside the Keyboard component so the
 * page footer (or any sibling) can render the octave controls separately
 * while still referencing the same source of truth.
 */
import { audio } from '$lib/audio/engine.svelte';

class KeyboardState {
	octaveBase = $state(3);

	shift(delta: number) {
		audio.releaseAll();
		this.octaveBase = Math.max(0, Math.min(8, this.octaveBase + delta));
	}
}

export const keyboardState = new KeyboardState();
