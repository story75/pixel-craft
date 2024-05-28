import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../components/pulse-text';
import './main-menu';
import './wake-up-prompt';

@customElement('example-ui-title-screen')
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
      ? html`<example-ui-title-screen-wake-up-prompt>
          <pixel-craft-ui-pulse-text
            text="Press any key"
          ></pixel-craft-ui-pulse-text>
        </example-ui-title-screen-wake-up-prompt>`
      : html`<example-ui-title-screen-main-menu></example-ui-title-screen-main-menu>`;
  }
}
