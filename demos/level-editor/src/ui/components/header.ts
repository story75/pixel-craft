import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('pixel-craft-editor-header')
export class Header extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      padding: 0.5rem;
      color: var(--pc-color-light-50);
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}
