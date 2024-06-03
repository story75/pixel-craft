import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('pixel-craft-editor-toolbar')
export class Toolbar extends LitElement {
  static styles = css`
    :host {
      display: flex;
      position: absolute;
      flex-direction: column;
      padding: 0.5rem;
      gap: 0.5rem;
      color: var(--pc-color-light-50);
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}
