import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('x-root')
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
  `;

  render() {
    return html`<slot></slot>`;
  }
}
