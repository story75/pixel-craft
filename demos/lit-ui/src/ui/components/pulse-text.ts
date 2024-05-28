import { LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('pixel-craft-ui-pulse-text')
export class PulseText extends LitElement {
  static styles = css`
    :host {
      color: var(--color-inverse);
      animation: pulse 4s infinite;
    }

    @keyframes pulse {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.2;
      }
      100% {
        opacity: 1;
      }
    }
  `;

  @property()
  accessor text = '';

  render() {
    return this.text;
  }
}
