import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('pixel-craft-ui-container')
export class Container extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      background-color: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(15px);
      border-radius: 0.5rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 1rem;
      color: var(--color-inverse);
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}
