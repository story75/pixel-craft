import { LitElement, css, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import '../../../ui/components/modal';
import '../../../ui/components/option';
import '../../../ui/components/option-list';
import '../../../ui/components/slider';
import { InputController, bindInput } from '../../../ui/controllers/input-controller';
import { Option } from '../../../ui/form/option';
import { Select } from '../../../ui/form/select';
import { Slider } from '../../../ui/form/slider';
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
  accessor settings = new Select({
    label: '',
    cycle: true,
    options: [
      new Select({
        label: 'TITLE_SCREEN.SETTINGS.LANGUAGE.LABEL',
        active: true,
        binding: [window.pixelCraft.translator.language, 'value'],
        options: [
          new Option({
            label: 'TITLE_SCREEN.SETTINGS.LANGUAGE.ENGLISH',
            value: 'en',
            active: true,
          }),
          new Option({
            label: 'TITLE_SCREEN.SETTINGS.LANGUAGE.GERMAN',
            value: 'de',
          }),
          new Option({
            label: 'TITLE_SCREEN.SETTINGS.LANGUAGE.SPANISH',
            value: 'es',
          }),
        ],
      }),
      new Select({
        label: 'TITLE_SCREEN.SETTINGS.FONT.LABEL',
        binding: [document.body.style, 'fontFamily'],
        options: [
          new Option({
            label: 'Open Sans',
            value: 'Open Sans',
            active: true,
          }),
          new Option({
            label: 'Monocraft',
            value: 'Monocraft',
          }),
          new Option({
            label: 'Arial',
            value: 'Arial',
          }),
        ],
      }),
      new Slider({
        label: 'TITLE_SCREEN.SETTINGS.VOLUME.MASTER',
        binding: [window.pixelCraft.audioMixer.masterVolume, 'value'],
        min: 0,
        max: 100,
        step: 1,
      }),
      new Slider({
        label: 'TITLE_SCREEN.SETTINGS.VOLUME.BGM',
        binding: [window.pixelCraft.audioMixer.bgmVolume, 'value'],
        min: 0,
        max: 100,
        step: 1,
      }),
      new Slider({
        label: 'TITLE_SCREEN.SETTINGS.VOLUME.SFX',
        binding: [window.pixelCraft.audioMixer.sfxVolume, 'value'],
        min: 0,
        max: 100,
        step: 1,
        onChange: (sfxVolume) => {
          if (sfxVolume.value === 99 || sfxVolume.value % 5 === 0) {
            this.dispatchEvent(new CustomEvent('play-sfx'));
          }
        },
        onAccept: () => {
          this.dispatchEvent(new CustomEvent('play-sfx', { detail: { force: true } }));
        },
      }),
      new Slider({
        label: 'TITLE_SCREEN.SETTINGS.VOLUME.VOICE',
        binding: [window.pixelCraft.audioMixer.voiceVolume, 'value'],
        min: 0,
        max: 100,
        step: 1,
        onChange: (voiceVolume) => {
          if (voiceVolume.value === 99 || voiceVolume.value % 10 === 0) {
            this.dispatchEvent(new CustomEvent('play-voice'));
          }
        },
        onAccept: () => {
          this.dispatchEvent(new CustomEvent('play-voice', { detail: { force: true } }));
        },
      }),
    ],
  });

  @bindInput('up')
  previousSetting() {
    this.settings.previous();
    this.requestUpdate();
  }

  @bindInput('down')
  nextSetting() {
    this.settings.next();
    this.requestUpdate();
  }

  @bindInput('left')
  decrementSlider() {
    const slider = this.settings.option;
    if (slider && slider instanceof Slider) {
      slider.decrement();
      this.requestUpdate();
    }
  }

  @bindInput('right')
  incrementSlider() {
    const slider = this.settings.option;
    if (slider && slider instanceof Slider) {
      slider.increment();
      this.requestUpdate();
    }
  }

  @bindInput('left')
  previousOption() {
    const select = this.settings.option;
    if (select && select instanceof Select) {
      select.previous();
      this.requestUpdate();
    }
  }

  @bindInput('right')
  nextOption() {
    const select = this.settings.option;
    if (select && select instanceof Select) {
      select.next();
      this.requestUpdate();
    }
  }

  @bindInput('cancel')
  cancel() {
    this.dispatchEvent(new CustomEvent('cancel'));
  }

  @bindInput('accept')
  accept() {
    this.settings.option?.accept();
  }

  render() {
    return html`
      <x-modal>
        ${map(this.settings.options, (setting) => {
          switch (true) {
            case setting instanceof Select:
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
            case setting instanceof Slider:
              return html`
                <x-title-screen-settings-setting
                  label=${translate(setting.label)}
                  ?active=${setting.active}
                >
                  <x-slider value=${setting.value}></x-slider>
                </x-title-screen-settings-setting>
              `;
          }
        })}
      </x-modal>
    `;
  }
}
