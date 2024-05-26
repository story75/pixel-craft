import { InputManager } from '@pixel-craft/input';
import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { map } from 'lit/directives/map.js';

@customElement('ui-title-screen-main-menu')
export class MainMenu extends LitElement {
  static styles = css`
    :host {
      display: flex-column;
      margin-left: auto;
      margin-right: auto;
      margin-top: 60dvh;
      color: rgba(255, 255, 255, 0.2);
    }

    div {
      margin-bottom: 0.5rem;
      padding: 0.5rem 2rem;
      box-sizing: border-box;
      border-bottom: 0.1rem solid transparent;

      &.active {
        color: rgba(255, 255, 255, 1);
        background: linear-gradient(
          0deg,
          rgba(0, 212, 255, 0.2) 0%,
          rgba(0, 0, 0, 0) 60%
        );
        border-bottom: 0.1rem solid white;
      }
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
        html`<div class=${classMap({ active: index === this.activeOption })}>
          ${option}
        </div>`,
    );
  }
}
