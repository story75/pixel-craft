import { LitElement, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('ui-title-screen-wake-up-prompt')
export class WakeUpPrompt extends LitElement {
  static styles = css`
    :host {
      display: flex;
      margin-left: auto;
      margin-right: auto;
      margin-top: 70dvh;
      color: white;
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

  render() {
    return 'Press any button';
  }
}
