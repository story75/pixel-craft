import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../components/pulse';

@customElement('pixel-craft-page-title-screen-wake-up-prompt')
export class TitleScreenWakeUpPrompt extends LitElement {
  static styles = css`
    :host {
      display: flex;
      width: 100dvw;
      height: 100dvh;
    }

    .wake-up-prompt {
      display: flex;
      margin-left: auto;
      margin-right: auto;
      margin-top: 70dvh;
      color: var(--color-inverse);
    }
  `;

  @property()
  accessor prompt: string = 'Press any key';

  render() {
    return html` <pixel-craft-pulse class="wake-up-prompt">${this.prompt}</pixel-craft-pulse>`;
  }
}
