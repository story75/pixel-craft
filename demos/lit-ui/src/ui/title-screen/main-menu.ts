import { InputManager } from '@pixel-craft/input';
import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import '../components/main-menu-option';

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

  @state()
  private accessor activeOption = 0;

  private readonly options = ['New Game', 'Continue', 'Settings'];

  connectedCallback() {
    super.connectedCallback();
    InputManager.Instance?.observables['up'].subscribe(() => {
      this.activeOption = Math.max(this.activeOption - 1, 0);
    });
    InputManager.Instance?.observables['down'].subscribe(() => {
      this.activeOption = Math.min(
        this.activeOption + 1,
        this.options.length - 1,
      );
    });
  }

  render() {
    return map(
      this.options,
      (option, index) =>
        html`<pixel-craft-ui-main-menu-option
          active=${index === this.activeOption || nothing}
          text=${option}
        ></pixel-craft-ui-main-menu-option>`,
    );
  }
}
