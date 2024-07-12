import { EventBus } from '@pixel-craft/event-bus';
import type { AudioMixer } from './audio-mixer';

type EventMap = {
  ended: CustomEvent;
  play: CustomEvent;
  stop: CustomEvent;
};

export class Sound extends EventBus<EventMap> {
  accessor loop = false;
  accessor stack = false;

  #playing = false;
  readonly #audioMixer: AudioMixer;
  readonly #audioBuffer: AudioBuffer;
  #source: AudioBufferSourceNode | undefined;

  constructor(audioMixer: AudioMixer, audioBuffer: AudioBuffer) {
    super();
    this.#audioMixer = audioMixer;
    this.#audioBuffer = audioBuffer;
  }

  get playing(): boolean {
    return this.#playing;
  }

  /**
   * @internal
   */
  stop(): void {
    if (!this.#playing) {
      return;
    }

    this.dispatchEvent(new CustomEvent('stop'));
    this.#source?.stop();
    this.#playing = false;
    this.#source = undefined;
  }

  /**
   * @internal
   */
  play(gain: GainNode): void {
    if (!this.stack) {
      this.stop();
    }

    this.#source = this.#audioMixer.createSource(this.#audioBuffer);
    this.#source.loop = this.loop;
    this.#source.addEventListener('ended', () => {
      this.#playing = false;
      this.dispatchEvent(new CustomEvent('ended'));
    });
    this.#source.connect(gain);
    this.dispatchEvent(new CustomEvent('play'));
    this.#source.start();
    this.#playing = true;
  }
}
