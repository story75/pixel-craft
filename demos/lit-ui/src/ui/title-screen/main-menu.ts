import { InputManager } from '@pixel-craft/input';
import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { map } from 'lit/directives/map.js';

@customElement('ui-title-screen-main-menu')
export class MainMenu extends LitElement {
  static styles = css`
    :host {
      display: flex;
      margin-left: auto;
      margin-right: auto;
      margin-top: 60dvh;
      color: rgba(255, 255, 255, 0.1);
    }

    div {
      position: relative;
      margin-bottom: 0.5rem;
      padding: 0.5rem 5rem;
      box-sizing: border-box;
      border-bottom: 0.05rem solid transparent;
      transition:
        color 0.2s ease-in-out,
        background 0.2s ease-in-out;

      &.active {
        color: rgba(255, 255, 255, 1);
        background: radial-gradient(
          ellipse at bottom center,
          rgba(0, 212, 255, 0.2) 0%,
          rgba(0, 0, 0, 0) 60%
        );
        border-bottom: 0.05rem solid;
        border-image: linear-gradient(
            90deg,
            transparent 15%,
            white 50%,
            transparent 85%
          )
          30;

        &:before {
          content: '';
          display: inline-block;
          position: absolute;
          width: 1rem;
          height: 1rem;
          background: url('assets/kenney_1-bit-input-prompts-pixel-16/Tiles (White)/tile_0584.png')
            no-repeat;
          background-size: 1rem;
          margin-left: -2.5rem;
          margin-top: 0.25rem;
          animation: point 2s ease-in-out infinite alternate;
        }
      }
    }

    @keyframes point {
      0% {
        margin-left: -2.5rem;
      }
      100% {
        margin-left: -1.5rem;
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
