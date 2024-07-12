import { LitElement, css, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { InputController, bindInput } from '../../../ui/controllers/input-controller';
import { type Option, acceptOption, nextOption, previousOption } from '../../../ui/option';
import icon from '../../../ui/pointer.png';
import { translate } from '../../../ui/translate';

@customElement('x-title-screen-main-menu-option')
class MenuOption extends LitElement {
  static styles = css`
        :host {
            position: relative;
            margin-bottom: 0.5rem;
            padding: 0.5rem 5rem;
            box-sizing: border-box;
            border-bottom: 0.05rem solid transparent;
            color: rgba(from var(--color-inverse) r g b / 0.1);
            text-align: center;
            transition: color 0.2s ease-in-out,
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

@customElement('x-title-screen-main-menu')
export class TitleScreenMainMenu extends LitElement {
  static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            margin: auto auto 10dvh;
        }
    `;

  inputController = new InputController(this);

  accessor options = [
    {
      label: 'TITLE_SCREEN.MAIN_MENU.NEW_GAME',
      accept: () => {
        this.dispatchEvent(new CustomEvent('new-game'));
      },
      active: true,
    },
    {
      label: 'TITLE_SCREEN.MAIN_MENU.CONTINUE',
      accept: () => {
        this.dispatchEvent(new CustomEvent('continue'));
      },
    },
    {
      label: 'TITLE_SCREEN.MAIN_MENU.SETTINGS',
      accept: () => {
        this.dispatchEvent(new CustomEvent('settings'));
      },
    },
    {
      label: 'TITLE_SCREEN.MAIN_MENU.QUIT',
      accept: () => {
        this.dispatchEvent(new CustomEvent('quit'));
      },
    },
  ] satisfies Option[];

  @bindInput('up')
  previousOption() {
    previousOption(this.options);
    this.requestUpdate();
  }

  @bindInput('down')
  nextOption() {
    nextOption(this.options);
    this.requestUpdate();
  }

  @bindInput('accept')
  acceptOption() {
    acceptOption(this.options);
  }

  render() {
    return map(
      this.options,
      (option) =>
        html`<x-title-screen-main-menu-option
                            ?active=${option.active}
                            text=${translate(option.label)}
                    ></x-title-screen-main-menu-option>`,
    );
  }
}
