import type { InputManager } from '@pixel-craft/input';
import {
  type Option,
  type OptionList,
  type Slider,
  decrementSlider,
  getOption,
  incrementSlider,
  isOptionList,
  isSlider,
  nextOption,
  previousOption,
} from '@pixel-craft/state';
import type { Translator } from '@pixel-craft/translation';
import { LitElement, css, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import '../../ui/components/modal';
import '../../ui/components/option';
import '../../ui/components/option-list';
import '../../ui/components/slider';
import type { AudioMixer } from '@pixel-craft/audio';
import icon from './pointer.png';

@customElement('pixel-craft-page-title-screen-settings-setting')
export class TitleScreenSettingsSetting extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      height: 2rem;
      margin-left: 2rem;
      margin-bottom: 1rem;
      opacity: 0.2;

      > .label {
        margin: auto auto auto 0;
        position: relative;
      }
    }

    :host([active]) {
      opacity: 1;
    }

    :host([active]) > .label:before {
      content: '';
      display: inline-block;
      position: absolute;
      width: 1rem;
      height: 1rem;
      background: url('${unsafeCSS(icon)}') no-repeat;
      background-size: 1rem;
      margin-left: -1.5rem;
      bottom: 0;
      animation: point 2s ease-in-out infinite alternate;
    }

    @keyframes point {
      0% {
        transform: translateX(-0.5rem);
      }
      100% {
        transform: translateX(0);
      }
    }
  `;

  @property()
  accessor label = '';

  @property()
  accessor active = false;

  render() {
    return html`
      <span class="label">${this.label}</span>
      <slot></slot>
    `;
  }
}

@customElement('pixel-craft-page-title-screen-settings')
export class TitleScreenSettings extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width: 100dvw;
      height: 100dvh;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      transition: opacity 0.5s;
    }

    pixel-craft-modal {
      margin: auto;
      min-width: 35rem;
      max-width: 70dvw;
      height: 80dvh;
    }

    pixel-craft-slider {
      margin: auto 0;
    }
  `;

  @property()
  accessor active = false;

  @property()
  accessor inputManager!: InputManager;

  @property()
  accessor audioMixer!: AudioMixer;

  @property()
  accessor translator!: Translator;

  @property()
  accessor settings: OptionList<OptionList<Option<string>> | Slider> = {
    type: 'option-list',
    label: 'Settings',
    options: [
      {
        type: 'option-list',
        label: 'TITLE_SCREEN.SETTINGS.LANGUAGE.LABEL',
        active: true,
        options: [
          {
            label: 'TITLE_SCREEN.SETTINGS.LANGUAGE.ENGLISH',
            value: 'en',
            active: true,
          },
          {
            label: 'TITLE_SCREEN.SETTINGS.LANGUAGE.GERMAN',
            value: 'de',
          },
          {
            label: 'TITLE_SCREEN.SETTINGS.LANGUAGE.SPANISH',
            value: 'es',
          },
        ],
        change: (option) => {
          this.translator.currentLanguage = (option?.value as string) || 'en';
        },
      },
      {
        type: 'option-list',
        label: 'TITLE_SCREEN.SETTINGS.FONT.LABEL',
        options: [
          {
            label: 'Monocraft',
            value: 'Monocraft',
            active: true,
          },
          {
            label: 'Arial',
            value: 'Arial',
          },
        ],
        change: (option) => {
          document.body.style.fontFamily = (option?.value as string) || 'Monocraft';
        },
      },
      {
        type: 'slider',
        label: 'TITLE_SCREEN.SETTINGS.VOLUME.MASTER',
        value: 100,
        min: 0,
        max: 100,
        step: 1,
        change: (masterVolume) => {
          const volume = masterVolume?.value ?? 100;
          this.audioMixer.masterVolume = volume / 100;
        },
      },
      {
        type: 'slider',
        label: 'TITLE_SCREEN.SETTINGS.VOLUME.BGM',
        value: 100,
        min: 0,
        max: 100,
        step: 1,
        change: (bgmVolume) => {
          const volume = bgmVolume?.value ?? 100;
          this.audioMixer.bgmVolume = volume / 100;
        },
      },
      {
        type: 'slider',
        label: 'TITLE_SCREEN.SETTINGS.VOLUME.SFX',
        value: 100,
        min: 0,
        max: 100,
        step: 1,
        change: (sfxVolume) => {
          const volume = sfxVolume?.value ?? 100;
          this.audioMixer.sfxVolume = volume / 100;

          if (volume === 99 || volume % 5 === 0) {
            this.dispatchEvent(new CustomEvent('play-sfx'));
          }
        },
        accept: () => {
          this.dispatchEvent(new CustomEvent('play-sfx'));
        },
      },
      {
        type: 'slider',
        label: 'TITLE_SCREEN.SETTINGS.VOLUME.VOICE',
        value: 100,
        min: 0,
        max: 100,
        step: 1,
        change: (voiceVolume) => {
          const volume = voiceVolume?.value ?? 100;
          this.audioMixer.voiceVolume = volume / 100;

          if (volume === 99 || volume % 10 === 0) {
            this.dispatchEvent(new CustomEvent('play-voice'));
          }
        },
        accept: () => {
          this.dispatchEvent(new CustomEvent('play-voice'));
        },
      },
    ],
  };

  #subscriptions: (() => void)[] = [];

  connectedCallback() {
    super.connectedCallback();
    this.active = true;

    if (!this.inputManager) {
      throw new Error('InputManager is required');
    }

    if (!this.translator) {
      throw new Error('Translator is required');
    }

    if (!this.audioMixer) {
      throw new Error('AudioMixer is required');
    }

    this.#subscriptions.push(
      this.inputManager.addEventListener('up', () => {
        if (!this.active) {
          return;
        }

        previousOption(this.settings);
        this.requestUpdate();
      }),
    );

    this.#subscriptions.push(
      this.inputManager.addEventListener('down', () => {
        if (!this.active) {
          return;
        }

        nextOption(this.settings);
        this.requestUpdate();
      }),
    );

    this.#subscriptions.push(
      this.inputManager.addEventListener('left', () => {
        if (!this.active) {
          return;
        }

        const option = getOption(this.settings);
        switch (true) {
          case isSlider(option):
            decrementSlider(option);
            break;
          case isOptionList(option):
            previousOption(option);
            break;
        }
        this.requestUpdate();
      }),
    );

    this.#subscriptions.push(
      this.inputManager.addEventListener('right', () => {
        if (!this.active) {
          return;
        }

        const option = getOption(this.settings);
        switch (true) {
          case isSlider(option):
            incrementSlider(option);
            break;
          case isOptionList(option):
            nextOption(option);
            break;
        }
        this.requestUpdate();
      }),
    );

    this.#subscriptions.push(
      this.inputManager.addEventListener('cancel', () => {
        if (!this.active) {
          return;
        }

        this.dispatchEvent(new CustomEvent('cancel'));
      }),
    );

    this.#subscriptions.push(
      this.inputManager.addEventListener('accept', () => {
        if (!this.active) {
          return;
        }

        const option = getOption(this.settings);
        if (option.accept) {
          option.accept(option);
        }
      }),
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.active = false;

    for (const unsubscribe of this.#subscriptions) {
      unsubscribe();
    }
  }

  render() {
    return html`
      <pixel-craft-modal>
        ${map(this.settings.options, (setting) => {
          switch (true) {
            case isOptionList(setting):
              return html`
                <pixel-craft-page-title-screen-settings-setting
                  label=${this.translator.translate(setting.label)}
                  ?active=${setting.active}
                >
                  <pixel-craft-option-list>
                    ${setting.options.map(
                      (option) => html`
                        <pixel-craft-option
                          text=${this.translator.translate(option.label)}
                          ?active=${option.active}
                        ></pixel-craft-option>
                      `,
                    )}
                  </pixel-craft-option-list>
                </pixel-craft-page-title-screen-settings-setting>
              `;
            case isSlider(setting):
              return html`
                <pixel-craft-page-title-screen-settings-setting
                  label=${this.translator.translate(setting.label)}
                  ?active=${setting.active}
                >
                  <pixel-craft-slider
                    value=${setting.value}
                    min=${setting.min}
                    max=${setting.max}
                    step=${setting.step}
                  ></pixel-craft-slider>
                </pixel-craft-page-title-screen-settings-setting>
              `;
          }
        })}
      </pixel-craft-modal>
    `;
  }
}
