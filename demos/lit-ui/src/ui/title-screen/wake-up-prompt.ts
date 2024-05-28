import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('example-ui-title-screen-wake-up-prompt')
export class WakeUpPrompt extends LitElement {
  static styles = css`
    :host {
      display: flex;
      margin-left: auto;
      margin-right: auto;
      margin-top: 70dvh;
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}
