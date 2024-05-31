import { InputManager } from '@pixel-craft/input';
import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import '../components/main-menu-option';
import './settings';

@customElement('example-ui-title-screen-main-menu')
export class MainMenu extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      margin-left: auto;
      margin-right: auto;
      margin-top: 60dvh;
    }
  `;

  private readonly options = ['New Game', 'Continue', 'Settings'] as const;

  @state()
  private accessor activeOption = 0;

  @state()
  private accessor settingsOpen = false;

  connectedCallback() {
    super.connectedCallback();

    InputManager.Instance?.observables['up'].subscribe(() => {
      if (this.settingsOpen) {
        return;
      }

      this.activeOption = Math.max(this.activeOption - 1, 0);
    });

    InputManager.Instance?.observables['down'].subscribe(() => {
      if (this.settingsOpen) {
        return;
      }

      this.activeOption = Math.min(
        this.activeOption + 1,
        this.options.length - 1,
      );
    });

    InputManager.Instance?.observables['accept'].subscribe(() => {
      if (this.activeOption === this.options.indexOf('Settings')) {
        this.settingsOpen = true;
      }
    });
  }

  private onSettingsClose() {
    this.settingsOpen = false;
  }

  render() {
    return html` ${this.settingsOpen
      ? html` <example-ui-title-screen-settings
          @close=${() => this.onSettingsClose()}
        ></example-ui-title-screen-settings>`
      : nothing}
    ${map(
      this.options,
      (option, index) =>
        html` <pixel-craft-ui-main-menu-option
          active=${index === this.activeOption || nothing}
          text=${option}
        ></pixel-craft-ui-main-menu-option>`,
    )}`;
  }
}
