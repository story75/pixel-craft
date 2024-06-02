import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('pixel-craft-editor-checkerboard')
export class Checkerboard extends LitElement {
  static styles = css`
    :host {
      --checkerboard-color: #a80f7580;
      --checkerboard-size: 32px 32px;

      display: block;
      background-image: conic-gradient(
        color-mix(in srgb, var(--checkerboard-color), white 10%) 90deg,
        var(--checkerboard-color) 90deg 180deg,
        color-mix(in srgb, var(--checkerboard-color), white 10%) 180deg 270deg,
        var(--checkerboard-color) 270deg
      );
      background-repeat: repeat;
      background-size: var(--checkerboard-size);
      transition:
        background-color 0.2s,
        background-size 0.2s;
    }
  `;

  private _color = '#a80f7580';

  get color(): string {
    return this._color;
  }

  @property()
  set color(value: string) {
    this._color = value;
    this.style.setProperty('--checkerboard-color', value);
  }

  private _size = 32;

  get size(): number {
    return this._size;
  }

  @property()
  set size(value: number) {
    this._size = value;
    this.style.setProperty('--checkerboard-size', `${value}px ${value}px`);
  }

  render() {
    return html` <slot></slot>`;
  }
}
