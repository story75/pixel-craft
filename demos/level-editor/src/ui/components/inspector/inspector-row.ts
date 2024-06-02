import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('pixel-craft-inspector-row')
export class InspectorRow extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      gap: 1rem;
    }

    span {
      color: var(--pc-color-light-50);
      margin: auto 0;
      width: 5rem;
      text-overflow: ellipsis;
    }

    :host([vertical-center]) {
      margin: auto 0;
    }
  `;

  @property()
  accessor label = '';

  @property({ attribute: 'vertical-center' })
  accessor verticalCenter = false;

  render() {
    return html`
      ${this.label ? html`<span>${this.label}</span>` : nothing}
      <slot></slot>
    `;
  }
}
