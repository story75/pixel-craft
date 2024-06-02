import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('pixel-craft-editor-container')
export class Container extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      background-color: var(--pc-color-dark-300);
      border-radius: 0.5rem;
      padding: 1rem;
      color: var(--pc-color-light-50);
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}
