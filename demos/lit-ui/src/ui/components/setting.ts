import { LitElement, css, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import icon from '../../../public/assets/kenney_1-bit-input-prompts-pixel-16/Tiles (White)/tile_0584.png';

@customElement('pixel-craft-ui-setting')
export class Setting extends LitElement {
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
