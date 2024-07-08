import type { AudioMixer } from '@pixel-craft/audio';
import { State as Store, persist, property } from '@pixel-craft/state';
import { storeName } from '@pixel-craft/state';
import type { Translator } from '@pixel-craft/translation';

export type SaveState = {
  type: 'autosave' | 'manual';
  id: string;
  updatedAt: number;
  createdAt: number;
  playtime: number;
  version: string;
};

@storeName('Autosave')
export class State extends Store {
  #audioMixer: AudioMixer;
  #translator: Translator;

  @property
  @persist()
  accessor language = 'en';

  @property
  @persist()
  accessor font = 'Monocraft';

  @property
  @persist()
  accessor masterVolume = 1;

  @property
  @persist()
  accessor bgmVolume = 1;

  @property
  @persist()
  accessor sfxVolume = 1;

  @property
  @persist()
  accessor voiceVolume = 1;

  constructor(audioMixer: AudioMixer, translator: Translator) {
    super();

    this.#audioMixer = audioMixer;
    this.#translator = translator;

    this.addEventListener('change', (event) => {
      const { property } = event.detail;
      switch (property) {
        case 'language':
          this.#translator.currentLanguage = this.language;
          break;
        case 'font':
          document.body.style.fontFamily = this.font;
          break;
        case 'masterVolume':
          this.#audioMixer.masterVolume = this.masterVolume;
          break;
        case 'bgmVolume':
          this.#audioMixer.bgmVolume = this.bgmVolume;
          break;
        case 'sfxVolume':
          this.#audioMixer.sfxVolume = this.sfxVolume;
          break;
        case 'voiceVolume':
          this.#audioMixer.voiceVolume = this.voiceVolume;
          break;
      }
    });
  }
}
