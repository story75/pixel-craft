import type { InputManager } from '@pixel-craft/input';
import type { Translator } from '@pixel-craft/translation';
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../../ui/components/pulse';

@customElement('pixel-craft-page-title-screen-wake-up-prompt')
export class TitleScreenWakeUpPrompt extends LitElement {
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

  @property()
  accessor inputManager!: InputManager;

  @property()
  accessor translator!: Translator;

  @property()
  accessor prompt = 'TITLE_SCREEN.WAKE_UP.PROMPT';

  @property()
  accessor unlocked = false;

  connectedCallback() {
    super.connectedCallback();

    if (!this.inputManager) {
      throw new Error('InputManager is required');
    }

    if (!this.translator) {
      throw new Error('Translator is required');
    }

    if (this.unlocked) {
      return;
    }

    this.inputManager.addEventListener(
      'keydown',
      () => {
        this.unlocked = true;
        this.dispatchEvent(new CustomEvent('unlocked'));
      },
      { once: true },
    );
  }

  render() {
    return html` <pixel-craft-pulse class="wake-up-prompt"
      >${this.translator.translate(this.prompt)}</pixel-craft-pulse
    >`;
  }
}
