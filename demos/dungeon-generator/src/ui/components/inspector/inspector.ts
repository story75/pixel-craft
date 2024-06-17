import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('pixel-craft-inspector')
export class Inspector extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      background: var(--pc-color-dark-200);
      padding: 0.5rem 1rem;
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}
