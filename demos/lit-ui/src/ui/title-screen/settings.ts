import { InputManager } from '@pixel-craft/input';
import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../components/container';
import '../components/option';
import '../components/option-list';
import '../components/setting';
import '../components/slider';

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

@customElement('example-ui-title-screen-settings')
export class Settings extends LitElement {
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

    pixel-craft-ui-container {
      margin: auto;
      min-width: 35rem;
      max-width: 70dvw;
      height: 80dvh;
    }

    pixel-craft-ui-slider {
      margin: auto 0;
    }
  `;

  @state()
  private accessor settings: Setting[] = [
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

  @state()
  private accessor currentSetting = 0;

  connectedCallback() {
    super.connectedCallback();

    InputManager.Instance?.observables['up'].subscribe(() => {
      this.currentSetting = Math.max(this.currentSetting - 1, 0);
    });

    InputManager.Instance?.observables['down'].subscribe(() => {
      this.currentSetting = Math.min(this.currentSetting + 1, this.settings.length - 1);
    });

    InputManager.Instance?.observables['left'].subscribe(() => {
      const setting = this.settings[this.currentSetting];
      if (setting.type === 'option-list') {
        const index = setting.options.indexOf(setting.value);
        setting.value = setting.options[(index - 1 + setting.options.length) % setting.options.length];
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      } else if (setting.type === 'slider') {
        setting.value = Math.max(setting.value - setting.step, setting.min);
      }
      this.requestUpdate();
    });

    InputManager.Instance?.observables['right'].subscribe(() => {
      const setting = this.settings[this.currentSetting];
      if (setting.type === 'option-list') {
        const index = setting.options.indexOf(setting.value);
        setting.value = setting.options[(index + 1) % setting.options.length];
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      } else if (setting.type === 'slider') {
        setting.value = Math.min(setting.value + setting.step, setting.max);
      }
      this.requestUpdate();
    });

    InputManager.Instance?.observables['cancel'].subscribe(() => {
      this.dispatchEvent(new CustomEvent('close'));
    });
  }

  render() {
    return html`
      <pixel-craft-ui-container>
        ${this.settings.map((setting, index) => {
          const active = this.currentSetting === index || nothing;
          switch (setting.type) {
            case 'option-list':
              return html`
                <pixel-craft-ui-setting label=${setting.label} active=${active}>
                  <pixel-craft-ui-option-list>
                    ${setting.options.map((option) => {
                      return html`
                        <pixel-craft-ui-option
                          text=${option}
                          ?active=${setting.value === option}
                        ></pixel-craft-ui-option>
                      `;
                    })}
                  </pixel-craft-ui-option-list>
                </pixel-craft-ui-setting>
              `;
            case 'slider':
              return html`
                <pixel-craft-ui-setting label=${setting.label} active=${active}>
                  <pixel-craft-ui-slider
                    value=${setting.value}
                    min=${setting.min}
                    max=${setting.max}
                    step=${setting.step}
                  ></pixel-craft-ui-slider>
                </pixel-craft-ui-setting>
              `;
          }
        })}
      </pixel-craft-ui-container>
    `;
  }
}
