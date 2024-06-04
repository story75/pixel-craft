import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { range } from 'lit/directives/range.js';

@customElement('pixel-craft-painter')
export class Painter extends LitElement {
  static styles = css`
    :host {
      --tile-size: 32px;

      display: flex;
      flex-direction: column;
      margin: auto;
    }

    :host([hide-overlay]) .tile {
      display: none;
    }

    .row {
      display: flex;
      flex-direction: row;
    }

    .tile {
      display: flex;
      cursor: pointer;
      box-sizing: border-box;
      margin: 2px;
      width: var(--tile-size);
      height: var(--tile-size);
      image-rendering: pixelated;
      background: rgba(0, 0, 0, 0.5);
    }
  `;

  @property({ attribute: 'hide-overlay' })
  accessor hideOverlay = false;

  @property()
  accessor width = 30;

  @property()
  accessor height = 25;

  private readonly onTileClick = (x: number, y: number) => {
    console.log(`Clicked on tile (${x}, ${y})`);
  };

  render() {
    return map(
      range(this.height),
      (y) => html`
        <div class="row">
          ${map(range(this.width), (x) => html`<div class="tile" @click=${() => this.onTileClick(x, y)}></div>`)}
        </div>
      `,
    );
  }
}
