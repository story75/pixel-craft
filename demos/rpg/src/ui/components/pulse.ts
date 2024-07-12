import { clamp } from '@pixel-craft/math';
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('x-pulse')
export class Pulse extends LitElement {
  static styles = css`
    :host {
      --duration: 4s;

      animation: pulse var(--duration) infinite;
    }

    @keyframes pulse {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.2;
      }
      100% {
        opacity: 1;
      }
    }
  `;

  private _duration = 4;

  get duration() {
    return this._duration;
  }

  @property()
  set duration(d: number | string) {
    this._duration = clamp(Number(d), 0, 10);
    this.style.setProperty('--duration', `${this._duration}s`);
  }

  render() {
    return html`<slot></slot>`;
  }
}
