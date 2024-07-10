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
  setOption,
} from '@pixel-craft/state';
import type { Translator } from '@pixel-craft/translation';
import { LitElement, css, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import '../components/modal';
import '../components/option';
import '../components/option-list';
import '../components/slider';
import type { State } from '../../state';
import icon from '../pointer.png';

@customElement('pixel-craft-modal-settings-setting')
export class ModalSettingsSetting extends LitElement {
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

@customElement('pixel-craft-modal-settings')
export class ModalSettings extends LitElement {
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
  accessor state!: State;

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
        init: (option) => {
          const optionList = option as OptionList<Option>;
          const activeLanguage = optionList.options.find((o) => o.value === this.state.language);
          if (activeLanguage && activeLanguage.active !== true) {
            setOption(optionList, activeLanguage);
          }
        },
        change: (option) => {
          this.state.language = option.value as string;
        },
      },
      {
        type: 'option-list',
        label: 'TITLE_SCREEN.SETTINGS.FONT.LABEL',
        options: [
          {
            label: 'Open Sans',
            value: 'Open Sans',
            active: true,
          },
          {
            label: 'Monocraft',
            value: 'Monocraft',
          },
          {
            label: 'Arial',
            value: 'Arial',
          },
        ],
        init: (option) => {
          const optionList = option as OptionList<Option>;
          const activeFont = optionList.options.find((o) => o.value === this.state.font);
          if (activeFont && activeFont.active !== true) {
            setOption(optionList, activeFont);
          }
        },
        change: (option) => {
          this.state.font = option.value as string;
        },
      },
      {
        type: 'slider',
        label: 'TITLE_SCREEN.SETTINGS.VOLUME.MASTER',
        value: 100,
        min: 0,
        max: 100,
        step: 1,
        init: (masterVolume) => {
          masterVolume.value = this.state.masterVolume * 100;
        },
        change: (masterVolume) => {
          this.state.masterVolume = masterVolume.value / 100;
        },
      },
      {
        type: 'slider',
        label: 'TITLE_SCREEN.SETTINGS.VOLUME.BGM',
        value: 100,
        min: 0,
        max: 100,
        step: 1,
        init: (bgmVolume) => {
          bgmVolume.value = this.state.bgmVolume * 100;
        },
        change: (bgmVolume) => {
          this.state.bgmVolume = bgmVolume.value / 100;
        },
      },
      {
        type: 'slider',
        label: 'TITLE_SCREEN.SETTINGS.VOLUME.SFX',
        value: 100,
        min: 0,
        max: 100,
        step: 1,
        init: (sfxVolume) => {
          sfxVolume.value = this.state.sfxVolume * 100;
        },
        change: (sfxVolume) => {
          this.state.sfxVolume = sfxVolume.value / 100;

          if (sfxVolume.value === 99 || sfxVolume.value % 5 === 0) {
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
        init: (voiceVolume) => {
          voiceVolume.value = this.state.voiceVolume * 100;
        },
        change: (voiceVolume) => {
          this.state.voiceVolume = voiceVolume.value / 100;

          if (voiceVolume.value === 99 || voiceVolume.value % 10 === 0) {
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

    if (!this.state) {
      throw new Error('State is required');
    }

    for (const option of this.settings.options) {
      if (option.init) {
        option.init(option);
      }
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
                <pixel-craft-modal-settings-setting
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
                </pixel-craft-modal-settings-setting>
              `;
            case isSlider(setting):
              return html`
                <pixel-craft-modal-settings-setting
                  label=${this.translator.translate(setting.label)}
                  ?active=${setting.active}
                >
                  <pixel-craft-slider
                    value=${setting.value}
                    min=${setting.min}
                    max=${setting.max}
                    step=${setting.step}
                  ></pixel-craft-slider>
                </pixel-craft-modal-settings-setting>
              `;
          }
        })}
      </pixel-craft-modal>
    `;
  }
}
