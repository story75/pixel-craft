import { LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('pixel-craft-ui-option')
export class OptionList extends LitElement {
  static styles = css`
    :host {
      background: rgba(0, 0, 0, 0.5);
      padding: 0.25rem 0.75rem;
      border-radius: 0.25rem;
      color: rgba(255, 255, 255, 0.1);
      transition:
        color 0.2s,
        background 0.2s,
        border 0.2s;
    }

    :host([active]) {
      color: rgba(255, 255, 255, 1);
      background: rgba(0, 0, 0, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
  `;

  @property()
  accessor text = '';

  @property()
  accessor active = false;

  render() {
    return this.text;
  }
}
