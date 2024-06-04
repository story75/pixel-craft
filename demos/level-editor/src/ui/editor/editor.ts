import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { map } from 'lit/directives/map.js';
import { range } from 'lit/directives/range.js';
import { when } from 'lit/directives/when.js';
import '../components/icon';
import '../components/toolbar';
import './painter';
import './tileset-editor';

@customElement('pixel-craft-editor')
export class Editor extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 0;
      left: 0;
      width: 100dvw;
      height: 100dvh;
      overflow: hidden;
    }

    .layer-navigation {
      display: flex;
      position: absolute;
      flex-direction: row;
      padding: 0.5rem;
      gap: 0.5rem;
      color: var(--pc-color-light-50);
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);

      pixel-craft-editor-button {
        width: 1.5rem;
        height: 1.5rem;

        pixel-craft-editor-icon,
        span {
          margin: auto;
        }

        pixel-craft-editor-icon {
          font-size: 1.5rem;
        }
      }

      .active {
        background-color: var(--pc-color-primary-300);
      }
    }
  `;

  @state()
  private accessor painting = true;

  @state()
  private accessor hideOverlay = false;

  @state()
  private accessor showPalette = false;

  @state()
  private accessor layers = 3;

  @state()
  private accessor currentLayer = 1;

  private readonly openTilesetEditor = () => {
    this.painting = false;
  };

  private readonly closeTilesetEditor = () => {
    this.painting = true;
  };

  private readonly toggleOverlay = () => {
    this.hideOverlay = !this.hideOverlay;
  };

  private readonly togglePalette = () => {
    this.showPalette = !this.showPalette;
  };

  private readonly setActiveLayer = (layer: number) => {
    this.currentLayer = layer;
  };

  private readonly addLayer = () => {
    this.layers++;
  };

  private readonly removeLayer = () => {
    this.layers = Math.max(1, this.layers - 1);
  };

  render() {
    return html`
      <pixel-craft-editor-toolbar>
        <pixel-craft-editor-button @click=${this.openTilesetEditor}>
          <pixel-craft-editor-icon></pixel-craft-editor-icon>
        </pixel-craft-editor-button>
        <pixel-craft-editor-button @click=${this.toggleOverlay}>
          ${when(
            this.hideOverlay,
            () => html`<pixel-craft-editor-icon></pixel-craft-editor-icon>`,
            () => html`<pixel-craft-editor-icon></pixel-craft-editor-icon>`,
          )}
        </pixel-craft-editor-button>
        <pixel-craft-editor-button @click=${this.togglePalette}>
          <pixel-craft-editor-icon></pixel-craft-editor-icon>
        </pixel-craft-editor-button>
        <pixel-craft-editor-button>
          <pixel-craft-editor-icon></pixel-craft-editor-icon>
        </pixel-craft-editor-button>
      </pixel-craft-editor-toolbar>

      ${when(
        this.painting,
        () =>
          html` <pixel-craft-painter ?hide-overlay=${this.hideOverlay}></pixel-craft-painter>
            <div class="layer-navigation">
              <pixel-craft-editor-button @click=${this.removeLayer}>
                <pixel-craft-editor-icon></pixel-craft-editor-icon>
              </pixel-craft-editor-button>
              ${map(
                range(this.layers),
                (i) =>
                  html` <pixel-craft-editor-button
                    class=${classMap({ active: i === this.currentLayer })}
                    @click=${() => this.setActiveLayer(i)}
                  >
                    <span>${i + 1}</span>
                  </pixel-craft-editor-button>`,
              )}
              <pixel-craft-editor-button @click=${this.addLayer}>
                <pixel-craft-editor-icon></pixel-craft-editor-icon>
              </pixel-craft-editor-button>
            </div>`,
        () => html` <pixel-craft-tileset-editor @save=${this.closeTilesetEditor}></pixel-craft-tileset-editor>`,
      )}
    `;
  }
}
