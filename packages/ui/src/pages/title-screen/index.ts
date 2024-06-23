import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import '../../components/pulse';
import './settings';

@customElement('pixel-craft-page-title-screen')
export class TitleScreen extends LitElement {
  static styles = css`
    :host {
      display: flex;
      width: 100dvw;
      height: 100dvh;
    }

    .wake-up-prompt {
      display: flex;
      margin-left: auto;
      margin-right: auto;
      margin-top: 70dvh;
      color: var(--color-inverse);
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
    return when(
      this.sleeping,
      () => html`<pixel-craft-pulse class="wake-up-prompt">Press any key</pixel-craft-pulse>`,
      () => html`<pixel-craft-page-title-screen-settings></pixel-craft-page-title-screen-settings>`,
    );
  }
}
