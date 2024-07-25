import { clamp } from '@pixel-craft/math';
import { LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('x-transition')
export class Transition extends LitElement {
  static styles = css`
    :host {
      --transition-color: black;
      --transition-duration: 0.25s;

      display: flex;
      position: absolute;
      top: 0;
      left: 0;
      width: 100dvw;
      height: 100dvh;
      background: var(--transition-color);
      opacity: 1;
      transition: opacity var(--transition-duration) ease-in-out;
    }

    @starting-style {
      :host {
        opacity: 0;
      }
    }
  `;

  private _color = 'black';

  get color() {
    return this._color;
  }

  @property()
  set color(c: string) {
    this._color = c;
    this.style.setProperty('--transition-color', this._color);
  }

  private _duration = 0.25;

  get duration() {
    return this._duration;
  }

  @property()
  set duration(d: number | string) {
    this._duration = clamp(Number(d), 0, 10);
    this.style.setProperty('--duration', `${this._duration}s`);
  }

  render() {
    return '';
  }
}
