import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('x-option-list')
export class OptionList extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
    }

    ::slotted(x-option) {
      margin-left: 0.5rem;

      &:first-child {
        margin-left: 0;
      }
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}
