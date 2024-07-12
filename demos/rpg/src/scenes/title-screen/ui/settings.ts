import { LitElement, css, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import '../../../ui/components/modal';
import '../../../ui/components/option';
import '../../../ui/components/option-list';
import '../../../ui/components/slider';
import { InputController, bindInput } from '../../../ui/controllers/input-controller';
import {
  type OptionTypes,
  changeOption,
  decrementSlider,
  getOption,
  incrementSlider,
  isOptionList,
  isSlider,
  nextOption,
  previousOption,
} from '../../../ui/option';
import icon from '../../../ui/pointer.png';
import { translate } from '../../../ui/translate';

@customElement('x-title-screen-settings-setting')
class Setting extends LitElement {
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

@customElement('x-title-screen-settings')
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

    x-modal {
      margin: auto;
      min-width: 35rem;
      max-width: 70dvw;
      height: 80dvh;
    }

    x-slider {
      margin: auto 0;
    }
  `;

  inputController = new InputController(this);

  @property()
  accessor settings = [
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
    },
    {
      type: 'slider',
      label: 'TITLE_SCREEN.SETTINGS.VOLUME.MASTER',
      value: 100,
      min: 0,
      max: 100,
      step: 1,
    },
    {
      type: 'slider',
      label: 'TITLE_SCREEN.SETTINGS.VOLUME.BGM',
      value: 100,
      min: 0,
      max: 100,
      step: 1,
    },
    {
      type: 'slider',
      label: 'TITLE_SCREEN.SETTINGS.VOLUME.SFX',
      value: 100,
      min: 0,
      max: 100,
      step: 1,
      change: (sfxVolume) => {
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
      change: (voiceVolume) => {
        if (voiceVolume.value === 99 || voiceVolume.value % 10 === 0) {
          this.dispatchEvent(new CustomEvent('play-voice'));
        }
      },
      accept: () => {
        this.dispatchEvent(new CustomEvent('play-voice'));
      },
    },
  ] satisfies OptionTypes[];

  @bindInput('up')
  previousSetting() {
    previousOption(this.settings, true);
    this.requestUpdate();
  }

  @bindInput('down')
  nextSetting() {
    nextOption(this.settings, true);
    this.requestUpdate();
  }

  @bindInput('left')
  decrementSlider() {
    const slider = getOption(this.settings);
    if (slider && isSlider(slider)) {
      decrementSlider(slider);
      this.requestUpdate();
    }
  }

  @bindInput('right')
  incrementSlider() {
    const slider = getOption(this.settings);
    if (slider && isSlider(slider)) {
      incrementSlider(slider);
      this.requestUpdate();
    }
  }

  @bindInput('left')
  previousOption() {
    const optionList = getOption(this.settings);
    if (optionList && isOptionList(optionList)) {
      previousOption(optionList.options);
      changeOption(optionList);
      this.requestUpdate();
    }
  }

  @bindInput('right')
  nextOption() {
    const optionList = getOption(this.settings);
    if (optionList && isOptionList(optionList)) {
      nextOption(optionList.options);
      changeOption(optionList);
      this.requestUpdate();
    }
  }

  @bindInput('cancel')
  cancel() {
    this.dispatchEvent(new CustomEvent('cancel'));
  }

  // connectedCallback() {
  //   super.connectedCallback();
  //   this.active = true;
  //
  //   if (!this.inputManager) {
  //     throw new Error('InputManager is required');
  //   }
  //
  //   if (!this.translator) {
  //     throw new Error('Translator is required');
  //   }
  //
  //   if (!this.state) {
  //     throw new Error('State is required');
  //   }
  //
  //   for (const option of this.settings) {
  //     if (option.init) {
  //       // biome-ignore lint/suspicious/noExplicitAny: TS cannot infer that option is the type we expect
  //       option.init(option as any);
  //     }
  //   }
  //
  //   this.#subscriptions.push(
  //     this.inputManager.addEventListener('up', () => {
  //       if (!this.active) {
  //         return;
  //       }
  //
  //       previousOption(this.settings);
  //       this.requestUpdate();
  //     }),
  //   );
  //
  //   this.#subscriptions.push(
  //     this.inputManager.addEventListener('down', () => {
  //       if (!this.active) {
  //         return;
  //       }
  //
  //       nextOption(this.settings);
  //       this.requestUpdate();
  //     }),
  //   );
  //
  //   this.#subscriptions.push(
  //     this.inputManager.addEventListener('left', () => {
  //       if (!this.active) {
  //         return;
  //       }
  //
  //       const option = getOption(this.settings);
  //       switch (true) {
  //         case isSlider(option):
  //           decrementSlider(option);
  //           break;
  //         case isOptionList(option):
  //           previousOption(option);
  //           break;
  //       }
  //       this.requestUpdate();
  //     }),
  //   );
  //
  //   this.#subscriptions.push(
  //     this.inputManager.addEventListener('right', () => {
  //       if (!this.active) {
  //         return;
  //       }
  //
  //       const option = getOption(this.settings);
  //       switch (true) {
  //         case isSlider(option):
  //           incrementSlider(option);
  //           break;
  //         case isOptionList(option):
  //           nextOption(option);
  //           break;
  //       }
  //       this.requestUpdate();
  //     }),
  //   );
  //
  //   this.#subscriptions.push(
  //     this.inputManager.addEventListener('cancel', () => {
  //       if (!this.active) {
  //         return;
  //       }
  //
  //       this.dispatchEvent(new CustomEvent('cancel'));
  //     }),
  //   );
  //
  //   this.#subscriptions.push(
  //     this.inputManager.addEventListener('accept', () => {
  //       if (!this.active) {
  //         return;
  //       }
  //
  //       const option = getOption(this.settings);
  //       if (option.accept) {
  //         option.accept(option);
  //       }
  //     }),
  //   );
  // }

  render() {
    return html`
      <x-modal>
        ${map(this.settings, (setting) => {
          switch (true) {
            case isOptionList(setting):
              return html`
                <x-title-screen-settings-setting
                  label=${translate(setting.label)}
                  ?active=${setting.active}
                >
                  <x-option-list>
                    ${setting.options.map(
                      (option) => html`
                        <x-option
                          text=${translate(option.label)}
                          ?active=${option.active}
                        ></x-option>
                      `,
                    )}
                  </x-option-list>
                </x-title-screen-settings-setting>
              `;
            case isSlider(setting):
              return html`
                <x-title-screen-settings-setting
                  label=${translate(setting.label)}
                  ?active=${setting.active}
                >
                  <x-slider
                    value=${setting.value}
                    min=${setting.min}
                    max=${setting.max}
                    step=${setting.step}
                  ></x-slider>
                </x-title-screen-settings-setting>
              `;
          }
        })}
      </x-modal>
    `;
  }
}
