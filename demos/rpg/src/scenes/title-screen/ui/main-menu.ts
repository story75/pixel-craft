import type { InputManager } from '@pixel-craft/input';
import { type Option, type OptionList, getOption, nextOption, previousOption } from '@pixel-craft/state';
import type { Translator } from '@pixel-craft/translation';
import { LitElement, css, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import icon from '../../../ui/pointer.png';

@customElement('pixel-craft-page-title-screen-main-menu-option')
export class TitleScreenMainMenuOption extends LitElement {
  static styles = css`
    :host {
      position: relative;
      margin-bottom: 0.5rem;
      padding: 0.5rem 5rem;
      box-sizing: border-box;
      border-bottom: 0.05rem solid transparent;
      color: rgba(from var(--color-inverse) r g b / 0.1);
      text-align: center;
      transition:
        color 0.2s ease-in-out,
        background 0.2s ease-in-out;
    }

    :host([active]) {
      color: var(--color-inverse);
      background: radial-gradient(
        ellipse at bottom center,
        rgba(from var(--color-primary) r g b / 0.2) 0%,
        rgba(0, 0, 0, 0) 60%
      );
      border-bottom: 0.05rem solid;
      border-image: linear-gradient(90deg, transparent 15%, var(--color-inverse) 50%, transparent 85%) 30;

      &:before {
        content: '';
        display: inline-block;
        position: absolute;
        width: 1rem;
        height: 1rem;
        background: url('${unsafeCSS(icon)}') no-repeat;
        background-size: 1rem;
        margin-left: -2.5rem;
        margin-top: 0.25rem;
        animation: point 2s ease-in-out infinite alternate;
      }
    }

    @keyframes point {
      0% {
        margin-left: -2.5rem;
      }
      100% {
        margin-left: -1.5rem;
      }
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

@customElement('pixel-craft-page-title-screen-main-menu')
export class TitleScreenMainMenu extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      margin: auto auto 10dvh;
    }
  `;

  @property()
  accessor active = false;

  @property()
  accessor inputManager!: InputManager;

  @property()
  accessor translator!: Translator;

  @property()
  accessor optionList: OptionList<Option> = {
    type: 'option-list',
    label: 'Main Menu',
    options: [
      {
        label: 'TITLE_SCREEN.MAIN_MENU.NEW_GAME',
        active: true,
        accept: () => this.dispatchEvent(new CustomEvent('new-game')),
      },
      { label: 'TITLE_SCREEN.MAIN_MENU.CONTINUE', accept: () => this.dispatchEvent(new CustomEvent('continue')) },
      { label: 'TITLE_SCREEN.MAIN_MENU.SETTINGS', accept: () => this.dispatchEvent(new CustomEvent('settings')) },
      { label: 'TITLE_SCREEN.MAIN_MENU.QUIT', accept: () => this.dispatchEvent(new CustomEvent('quit')) },
    ],
  };

  #subscriptions: (() => void)[] = [];

  connectedCallback() {
    super.connectedCallback();
    this.active = true;

    if (!this.inputManager) {
      throw new Error('InputManager is required');
    }

    if (!this.translator) {
      throw new Error('Translator is required');
    }

    this.#subscriptions.push(
      this.inputManager.addEventListener('up', () => {
        if (!this.active) {
          return;
        }

        previousOption(this.optionList);
        this.requestUpdate();
      }),
    );

    this.#subscriptions.push(
      this.inputManager.addEventListener('down', () => {
        if (!this.active) {
          return;
        }

        nextOption(this.optionList);
        this.requestUpdate();
      }),
    );

    this.#subscriptions.push(
      this.inputManager.addEventListener('accept', () => {
        if (!this.active) {
          return;
        }

        const option = getOption(this.optionList);
        option.accept?.(option);
      }),
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.active = false;

    for (const unsubscribe of this.#subscriptions) {
      unsubscribe();
    }
  }

  render() {
    return map(
      this.optionList.options,
      (option) =>
        html` <pixel-craft-page-title-screen-main-menu-option
          ?active=${option.active}
          text=${this.translator.translate(option.label)}
        ></pixel-craft-page-title-screen-main-menu-option>`,
    );
  }
}
