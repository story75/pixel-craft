import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('pixel-craft-painter')
export class Painter extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width: 80dvw;
      height: 80dvh;
      margin: auto;
    }
  `;

  @property({ attribute: 'show-overlay' })
  accessor showOverlay = true;

  render() {
    return html` Hello there `;
  }
}
