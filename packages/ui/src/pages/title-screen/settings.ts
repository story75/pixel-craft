import { OptionList, Slider } from '@pixel-craft/state';
import { LitElement, css, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import '../../components/modal';
import '../../components/option';
import '../../components/option-list';
import '../../components/slider';
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
  accessor settings: OptionList<string | number> = new OptionList<string | number>({
    label: 'Settings',
    options: [
      new OptionList({
        label: 'Language',
        options: [{ label: 'English', active: true }, { label: 'German' }, { label: 'Spanish' }],
      }),
      new OptionList({
        label: 'Font Face',
        options: [{ label: 'Monocraft', active: true }, { label: 'Arial' }],
      }),
      new Slider({
        label: 'Master Volume',
        value: 100,
        min: 0,
        max: 100,
        step: 1,
      }),
      new Slider({
        label: 'BGM Volume',
        value: 100,
        min: 0,
        max: 100,
        step: 1,
      }),
      new Slider({
        label: 'SFX Volume',
        value: 100,
        min: 0,
        max: 100,
        step: 1,
      }),
      new Slider({
        label: 'Voice Volume',
        value: 100,
        min: 0,
        max: 100,
        step: 1,
      }),
    ],
  });

  connectedCallback() {
    super.connectedCallback();
    this.settings.addEventListener('change', () => this.requestUpdate());
  }
  render() {
    return html`
      <pixel-craft-modal>
        ${map(this.settings.options, (setting) => {
          switch (setting.type) {
            case 'option-list':
              const optionList = setting as OptionList;
              return html`
                <pixel-craft-page-title-screen-settings-setting label=${optionList.label} ?active=${optionList.active}>
                  <pixel-craft-option-list>
                    ${optionList.options.map((option) => {
                      return html`
                        <pixel-craft-option text=${option.label} ?active=${option.active}></pixel-craft-option>
                      `;
                    })}
                  </pixel-craft-option-list>
                </pixel-craft-page-title-screen-settings-setting>
              `;
            case 'slider':
              const slider = setting as Slider;
              return html`
                <pixel-craft-page-title-screen-settings-setting label=${slider.label} ?active=${slider.active}>
                  <pixel-craft-slider
                    value=${slider.value}
                    min=${slider.min}
                    max=${slider.max}
                    step=${slider.step}
                  ></pixel-craft-slider>
                </pixel-craft-page-title-screen-settings-setting>
              `;
          }
        })}
      </pixel-craft-modal>
    `;
  }
}
