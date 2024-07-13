import { clamp } from '@pixel-craft/math';
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('x-slider')
export class Slider extends LitElement {
  static styles = css`
    :host {
      position: relative;
      width: 15rem;
      height: 0.25rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 0.125rem;

      --value: 100%;
      --scale: 1;
    }

    .fill {
      position: absolute;
      height: 100%;
      width: 100%;
      background: rgb(0 225 255);
      border-radius: 0.125rem;
      transform: scaleX(var(--scale));
      transform-origin: left center;
      transition: transform 0.1s ease-in-out;
    }

    .knob {
      position: absolute;
      width: 0.75rem;
      height: 100%;
      background: rgb(255, 255, 255);
      border-radius: 0.125rem;
      margin-left: -0.75rem;
      left: var(--value);
      transition: left 0.1s ease-in-out;
    }

    .label {
      display: inline-block;
      position: absolute;
      font-size: 0.75rem;
      text-align: center;
      padding: 0.125rem 0.25rem;
      width: 1.5rem;
      background: rgb(255, 255, 255, 0.1);
      color: rgba(255, 255, 255);
      margin-left: -0.625rem;
      margin-top: 0.5rem;
      border-radius: 0.125rem;
    }
  `;

  private _value = 100;

  get value() {
    return this._value;
  }

  @property()
  set value(v: number | string) {
    this._value = Number(v);
    this.style.setProperty('--value', `${this._value}%`);
    this.style.setProperty('--scale', String(this._value / 100));
  }

  render() {
    return html`
      <div class="fill"></div>
      <div class="knob">
        <div class="label">${this._value}</div>
      </div>
    `;
  }
}
