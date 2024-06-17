import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('pixel-craft-editor-button')
export class Button extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      background-color: var(--pc-color-dark-300);
      padding: 0.5rem;
      border-radius: 0.25rem;
      cursor: pointer;
      color: var(--pc-color-light-50);
      transition:
        color 0.2s,
        background-color 0.2s;
    }

    :host(:hover) {
      background-color: color-mix(in srgb, var(--pc-color-dark-300), white 10%);
    }

    :host(:active) {
      background-color: color-mix(in srgb, var(--pc-color-dark-300), black 10%);
    }

    :host([disabled]) {
      cursor: not-allowed;
      color: var(--pc-color-light-100);
      background-color: color-mix(in srgb, var(--pc-color-dark-300), transparent 40%);
    }
  `;

  @property()
  accessor disabled = false;

  render() {
    return html`<slot></slot>`;
  }
}
