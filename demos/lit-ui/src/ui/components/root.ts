import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('pixel-craft-ui-root')
export class Root extends LitElement {
  static styles = css`
    :host {
      display: flex;
      position: absolute;
      top: 0;
      left: 0;
      width: 100dvw;
      height: 100dvh;
      overflow: hidden;
    }

    :root {
      --color-inverse: rgb(255, 255, 255);
      --color-primary: rgb(0, 225, 255);
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}
