import { LitElement, css, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { InputController, bindInput } from '../../../ui/controllers/input-controller';
import { Option } from '../../../ui/form/option';
import { Select } from '../../../ui/form/select';
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

  accessor select = new Select({
    label: '',
    options: [
      new Option({
        label: 'TITLE_SCREEN.MAIN_MENU.NEW_GAME',
        onAccept: () => {
          this.dispatchEvent(new CustomEvent('new-game'));
        },
        active: true,
      }),
      new Option({
        label: 'TITLE_SCREEN.MAIN_MENU.CONTINUE',
        onAccept: () => {
          this.dispatchEvent(new CustomEvent('continue'));
        },
      }),
      new Option({
        label: 'TITLE_SCREEN.MAIN_MENU.SETTINGS',
        onAccept: () => {
          this.dispatchEvent(new CustomEvent('settings'));
        },
      }),
      new Option({
        label: 'TITLE_SCREEN.MAIN_MENU.QUIT',
        onAccept: () => {
          this.dispatchEvent(new CustomEvent('quit'));
        },
      }),
    ],
  });

  @bindInput('up')
  previousOption() {
    this.select.previous();
    this.requestUpdate();
  }

  @bindInput('down')
  nextOption() {
    this.select.next();
    this.requestUpdate();
  }

  @bindInput('accept')
  acceptOption() {
    this.select.option?.accept();
  }

  render() {
    return map(
      this.select.options,
      (option) =>
        html`<x-title-screen-main-menu-option
                            ?active=${option.active}
                            text=${translate(option.label)}
                    ></x-title-screen-main-menu-option>`,
    );
  }
}
