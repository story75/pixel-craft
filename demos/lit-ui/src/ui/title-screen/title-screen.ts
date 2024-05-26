import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './main-menu';
import './wake-up-prompt';

@customElement('ui-title-screen')
export class TitleScreen extends LitElement {
  static styles = css`
    :host {
      display: flex;
      width: 100dvw;
      height: 100dvh;
    }
  `;

  @state()
  private accessor sleeping = true;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener(
      'keydown',
      () => {
        this.sleeping = false;
      },
      { once: true },
    );
  }

  render() {
    return this.sleeping
      ? html`<ui-title-screen-wake-up-prompt></ui-title-screen-wake-up-prompt>`
      : html`<ui-title-screen-main-menu></ui-title-screen-main-menu>`;
  }
}
