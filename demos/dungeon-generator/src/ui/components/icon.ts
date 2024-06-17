import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('pixel-craft-editor-icon')
export class Button extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      font-style: normal;
      font-family: 'Phosphor-Thin' !important;
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}
