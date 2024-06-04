import { LitElement, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import icon from '../../../public/assets/kenney_1-bit-input-prompts-pixel-16/Tiles (White)/tile_0584.png';

@customElement('pixel-craft-ui-main-menu-option')
export class MainMenu extends LitElement {
  static styles = css`
    :host {
      position: relative;
      margin-bottom: 0.5rem;
      padding: 0.5rem 5rem;
      box-sizing: border-box;
      border-bottom: 0.05rem solid transparent;
      color: rgba(from var(--color-inverse) r g b / 0.1);
      transition:
        color 0.2s ease-in-out,
        background 0.2s ease-in-out;
    }

    :host([active]) {
      color: var(--color-inverse);
      background: radial-gradient(
        ellipse at bottom center,
        rgba(from var(--color-primary) r g b / 0.2) 0%,
        rgba(0, 0, 0, 0) 60%
      );
      border-bottom: 0.05rem solid;
      border-image: linear-gradient(90deg, transparent 15%, var(--color-inverse) 50%, transparent 85%) 30;

      &:before {
        content: '';
        display: inline-block;
        position: absolute;
        width: 1rem;
        height: 1rem;
        background: url('${unsafeCSS(icon)}') no-repeat;
        background-size: 1rem;
        margin-left: -2.5rem;
        margin-top: 0.25rem;
        animation: point 2s ease-in-out infinite alternate;
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

  @property()
  accessor text = '';

  @property()
  accessor active = false;

  render() {
    return this.text;
  }
}
