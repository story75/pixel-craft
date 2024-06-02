import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('pixel-craft-inspector-column')
export class InspectorColumn extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    :host([fill]) {
      flex: 1;
    }
  `;

  @property()
  accessor fill = false;

  render() {
    return html`<slot></slot>`;
  }
}
