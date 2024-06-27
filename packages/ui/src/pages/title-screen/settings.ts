import { LitElement, css, html, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../components/modal';
import '../../components/option';
import '../../components/option-list';
import '../../components/slider';
import icon from './pointer.png';

type Setting = {
  label: string;
} & (OptionList<string> | Slider);

type OptionList<T> = {
  type: 'option-list';
  value: T;
  options: T[];
};

type Slider = {
  type: 'slider';
  value: number;
  min: number;
  max: number;
  step: number;
};

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
      margin-top: 0.25rem;
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
  accessor settings: Setting[] = [
    {
      label: 'Language',
      type: 'option-list',
      value: 'English',
      options: ['English', 'Spanish', 'German'],
    },
    {
      label: 'Font Face',
      type: 'option-list',
      value: 'Monocraft',
      options: ['Monocraft', 'Arial'],
    },
    {
      label: 'Master Volume',
      type: 'slider',
      value: 100,
      min: 0,
      max: 100,
      step: 1,
    },
    {
      label: 'BGM Volume',
      type: 'slider',
      value: 100,
      min: 0,
      max: 100,
      step: 1,
    },
    {
      label: 'SFX Volume',
      type: 'slider',
      value: 100,
      min: 0,
      max: 100,
      step: 1,
    },
    {
      label: 'Voice Volume',
      type: 'slider',
      value: 100,
      min: 0,
      max: 100,
      step: 1,
    },
  ];

  @property()
  accessor currentSetting = 0;

  nextSetting() {
    this.currentSetting = Math.min(this.currentSetting + 1, this.settings.length - 1);
  }

  previousSetting() {
    this.currentSetting = Math.max(this.currentSetting - 1, 0);
  }

  nextOption() {
    const setting = this.settings[this.currentSetting];
    if (setting.type === 'option-list') {
      const index = setting.options.indexOf(setting.value);
      setting.value = setting.options[(index + 1) % setting.options.length];
    } else if (setting.type === 'slider') {
      setting.value = Math.min(setting.value + setting.step, setting.max);
    }
    this.requestUpdate();
  }

  previousOption() {
    const setting = this.settings[this.currentSetting];
    if (setting.type === 'option-list') {
      const index = setting.options.indexOf(setting.value);
      setting.value = setting.options[(index - 1 + setting.options.length) % setting.options.length];
    } else if (setting.type === 'slider') {
      setting.value = Math.max(setting.value - setting.step, setting.min);
    }
    this.requestUpdate();
  }

  render() {
    return html`
      <pixel-craft-modal>
        ${this.settings.map((setting, index) => {
          const active = this.currentSetting === index || nothing;
          switch (setting.type) {
            case 'option-list':
              return html`
                <pixel-craft-page-title-screen-settings-setting label=${setting.label} active=${active}>
                  <pixel-craft-option-list>
                    ${setting.options.map((option) => {
                      return html`
                        <pixel-craft-option text=${option} ?active=${setting.value === option}></pixel-craft-option>
                      `;
                    })}
                  </pixel-craft-option-list>
                </pixel-craft-page-title-screen-settings-setting>
              `;
            case 'slider':
              return html`
                <pixel-craft-page-title-screen-settings-setting label=${setting.label} active=${active}>
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
