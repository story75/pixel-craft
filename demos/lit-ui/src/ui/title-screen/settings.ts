import { InputManager } from '@pixel-craft/input';
import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../components/container';
import '../components/option';
import '../components/option-list';
import '../components/setting';
import '../components/slider';

@customElement('example-ui-title-screen-settings')
export class Settings extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width: 100dvw;
      height: 100dvh;
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
  private accessor currentSetting = 0;
  private readonly settings = 5;

  @state()
  private accessor language = 'English';

  connectedCallback() {
    super.connectedCallback();

    InputManager.Instance?.observables['up'].subscribe(() => {
      this.currentSetting = Math.max(this.currentSetting - 1, 0);
    });
    InputManager.Instance?.observables['down'].subscribe(() => {
      this.currentSetting = Math.min(this.currentSetting + 1, this.settings);
    });
  }

  render() {
    return html`
      <pixel-craft-ui-container>
        <pixel-craft-ui-setting
          label="Language"
          active=${this.currentSetting === 0 || nothing}
        >
          <pixel-craft-ui-option-list>
            <pixel-craft-ui-option
              text="English"
              active=${this.language === 'English' || nothing}
            ></pixel-craft-ui-option>
            <pixel-craft-ui-option
              text="Spanish"
              active=${this.language === 'Spanish' || nothing}
            ></pixel-craft-ui-option>
            <pixel-craft-ui-option
              text="German"
              active=${this.language === 'German' || nothing}
            ></pixel-craft-ui-option>
          </pixel-craft-ui-option-list>
        </pixel-craft-ui-setting>
        <pixel-craft-ui-setting
          label="Font Face"
          active=${this.currentSetting === 1 || nothing}
        >
          <pixel-craft-ui-option-list>
            <pixel-craft-ui-option
              text="Monocraft"
              active
            ></pixel-craft-ui-option>
            <pixel-craft-ui-option text="Arial"></pixel-craft-ui-option>
          </pixel-craft-ui-option-list>
        </pixel-craft-ui-setting>
        <pixel-craft-ui-setting
          label="Master Volume"
          active=${this.currentSetting === 2 || nothing}
        >
          <pixel-craft-ui-slider></pixel-craft-ui-slider>
        </pixel-craft-ui-setting>
        <pixel-craft-ui-setting
          label="BGM Volume"
          active=${this.currentSetting === 3 || nothing}
        >
          <pixel-craft-ui-slider></pixel-craft-ui-slider>
        </pixel-craft-ui-setting>
        <pixel-craft-ui-setting
          label="SFX Volume"
          active=${this.currentSetting === 4 || nothing}
        >
          <pixel-craft-ui-slider></pixel-craft-ui-slider>
        </pixel-craft-ui-setting>
        <pixel-craft-ui-setting
          label="Voice Volume"
          active=${this.currentSetting === 5 || nothing}
        >
          <pixel-craft-ui-slider></pixel-craft-ui-slider>
        </pixel-craft-ui-setting>
      </pixel-craft-ui-container>
    `;
  }
}
