import { LitElement, css, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import icon from './pointer.png';
import './settings';

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
  accessor options = ['New Game', 'Continue', 'Settings'];

  @property()
  accessor activeOption = 0;

  nextOption() {
    this.activeOption = Math.min(this.activeOption + 1, this.options.length - 1);
  }

  previousOption() {
    this.activeOption = Math.max(this.activeOption - 1, 0);
  }

  render() {
    return map(
      this.options,
      (option, index) =>
        html` <pixel-craft-page-title-screen-main-menu-option
          ?active=${index === this.activeOption}
          text=${option}
        ></pixel-craft-page-title-screen-main-menu-option>`,
    );
  }
}
