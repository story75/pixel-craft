import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../../../ui/components/pulse';
import { InputController, bindInput } from '../../../ui/controllers/input-controller';
import { translate } from '../../../ui/translate';

@customElement('x-title-screen-wake-up-prompt')
export class TitleScreenWakeUpPrompt extends LitElement {
  static styles = css`
    :host {
      display: flex;
      width: 100dvw;
      height: 100dvh;
    }

    x-pulse {
      display: flex;
      margin-left: auto;
      margin-right: auto;
      margin-top: 70dvh;
      color: var(--color-inverse);
    }
  `;

  inputController = new InputController(this);

  @bindInput('keydown')
  unlock() {
    this.dispatchEvent(new CustomEvent('unlocked'));
  }

  render() {
    return html` <x-pulse>${translate('TITLE_SCREEN.WAKE_UP.PROMPT')}</x-pulse>`;
  }
}
