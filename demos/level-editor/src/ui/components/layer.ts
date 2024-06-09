import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('pixel-craft-editor-layer')
export class Layer extends LitElement {
  static styles = css`
    :host {
      display: flex;
      position: absolute;
      top: 0;
      left: 0;
      width: 100dvw;
      height: 100dvh;
      overflow: hidden;
      background: rgba(0, 0, 0, 0.75);
      opacity: 1;
      transition: opacity 0.25s;
      pointer-events: auto;
    }

    @starting-style {
      :host {
        opacity: 0;
      }
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}
