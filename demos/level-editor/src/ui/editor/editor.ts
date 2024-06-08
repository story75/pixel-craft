import { Sprite, createContext, createTextureLoader, pipeline, sprite } from '@pixel-craft/renderer';
import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { map } from 'lit/directives/map.js';
import { range } from 'lit/directives/range.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';
import '../components/icon';
import '../components/toolbar';
import { editorState } from './editor-state';
import './tileset-editor';

@customElement('pixel-craft-editor')
export class Editor extends LitElement {
  static styles = css`
    :host {
      --tile-size: 32px;

      display: flex;
      flex-direction: column;
      position: absolute;
      top: 0;
      left: 0;
      width: 100dvw;
      height: 100dvh;
      overflow: hidden;
    }

    pixel-craft-editor-toolbar {
      .active {
        background-color: var(--pc-color-primary-300);
      }
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

    .painter {
      display: flex;
      flex-direction: column;
      max-width: 90dvw;
      max-height: 90dvh;
      margin: auto;
      overflow: auto;

      .tile .tile {
        opacity: 0.3;
      }
    }

    .palette {
      display: grid;
      position: absolute;
      grid-template-columns: repeat(6, 1fr);
      gap: 0.5rem;
      padding: 0.5rem;
      background-color: var(--pc-color-dark-300);
      border-radius: 0.25rem;
      bottom: 0.5rem;
      left: 0.5rem;

      .tile {
        filter: grayscale(1);
        transition:
          filter 0.2s,
          outline 0.2s;
      }

      .active {
        filter: none;
        outline: 1px solid rgba(255, 0, 0, 0.4);
        outline-offset: 4px;
      }
    }

    .hide {
      transition:
        opacity 0.1s,
        display 0.1s;
      transition-behavior: allow-discrete;
      opacity: 0;
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

  accessor canvas!: HTMLCanvasElement;
  private renderPass!: () => void;
  private texture: GPUTexture | undefined;

  private readonly state = editorState;

  private readonly getTileStyle = (layer: number, x: number, y: number) => {
    const tileIndex = this.state.map[layer]?.[x]?.[y];
    if (!tileIndex && tileIndex !== 0) {
      return {};
    }

    return {
      background: `url(${this.state.tilesetImage})`,
      'background-position': `-${this.state.palette[tileIndex].x}px -${this.state.palette[tileIndex].y}px`,
    };
  };

  readonly paintTile = (x: number, y: number, mode: 'auto' | 'add' | 'remove' = 'auto') => {
    this.state.paintTile(x, y, mode);
    this.requestUpdate();
    this.renderPass();
  };

  async connectedCallback() {
    super.connectedCallback();

    const context = await createContext(this.canvas);
    const textureLoader = createTextureLoader(context.device);
    const renderPass = pipeline(context);

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.state.addEventListener('change', async (event) => {
      if (event.detail.property === 'tilesetFile' && event.detail.value instanceof File) {
        this.texture = await textureLoader(event.detail.value);
      }

      this.requestUpdate();
    });

    this.renderPass = () => {
      if (!this.texture) {
        return;
      }

      const sprites: Sprite[] = [];

      for (let layer = 0; layer < this.state.map.length; layer++) {
        for (let y = 0; y < this.state.height; y++) {
          for (let x = 0; x < this.state.width; x++) {
            const tileIndex = this.state.map[layer][x][y];
            if (!tileIndex && tileIndex !== 0) {
              continue;
            }

            const layerCorrectedX = x - layer;
            const layerCorrectedY = y - layer;

            sprites.push(
              sprite({
                texture: this.texture,
                x:
                  this.state.tileSize * (this.state.width / 2) +
                  ((layerCorrectedX * this.state.tileSize) / 2 + (layerCorrectedY * -this.state.tileSize) / 2),
                y: (layerCorrectedX * this.state.tileSize) / 4 + (layerCorrectedY * this.state.tileSize) / 4,
                frame: this.state.palette[tileIndex],
              }),
            );
          }
        }
      }

      renderPass(sprites.reverse());
    };

    this.renderPass();
    this.requestUpdate();
  }

  render() {
    return html`
      <pixel-craft-editor-toolbar>
        <pixel-craft-editor-button @click=${this.state.openTilesetInspector}>
          <pixel-craft-editor-icon></pixel-craft-editor-icon>
        </pixel-craft-editor-button>
        <pixel-craft-editor-button class=${classMap({ active: this.state.showGrid })} @click=${this.state.toggleGrid}>
          ${when(
            this.state.showGrid,
            () => html` <pixel-craft-editor-icon></pixel-craft-editor-icon>`,
            () => html` <pixel-craft-editor-icon></pixel-craft-editor-icon>`,
          )}
        </pixel-craft-editor-button>
        <pixel-craft-editor-button
          class=${classMap({ active: this.state.showPalette })}
          @click=${this.state.togglePalette}
        >
          <pixel-craft-editor-icon></pixel-craft-editor-icon>
        </pixel-craft-editor-button>
        <pixel-craft-editor-button>
          <pixel-craft-editor-icon></pixel-craft-editor-icon>
        </pixel-craft-editor-button>
      </pixel-craft-editor-toolbar>

      <div class=${classMap({ palette: true, hide: !this.state.showPalette })}>
        ${map(
          this.state.palette,
          (rect, i) =>
            html` <div
              @click=${() => this.state.selectTile(i)}
              class=${classMap({ tile: true, active: this.state.selectedTileIndex === i })}
              style=${styleMap({
                background: `url(${this.state.tilesetImage})`,
                'background-position': `-${rect.x}px -${rect.y}px`,
              })}
            ></div>`,
        )}
      </div>

      ${when(
        !this.state.showTilesetInspector,
        () =>
          html` <div class=${classMap({ painter: true, hide: !this.state.showGrid })}>
              ${map(
                range(this.state.height),
                (y) => html`
                  <div class="row">
                    ${map(
                      range(this.state.width),
                      (x) =>
                        html` <div
                          class="tile"
                          @mousemove=${() => this.paintTile(x, y)}
                          @click=${() => this.paintTile(x, y, 'add')}
                          @contextmenu=${() => this.paintTile(x, y, 'remove')}
                          style=${styleMap(this.getTileStyle(this.state.selectedLayer, x, y))}
                        >
                          ${when(
                            this.state.selectedLayer > 0 &&
                              this.state.map[this.state.selectedLayer - 1][x][y] !== undefined,
                            () =>
                              html`<div
                                class="tile"
                                style=${styleMap(this.getTileStyle(this.state.selectedLayer - 1, x, y))}
                              ></div>`,
                          )}
                        </div>`,
                    )}
                  </div>
                `,
              )}
            </div>
            <div class="layer-navigation">
              <pixel-craft-editor-button @click=${this.state.removeLayer}>
                <pixel-craft-editor-icon></pixel-craft-editor-icon>
              </pixel-craft-editor-button>
              ${map(
                range(this.state.map.length),
                (i) =>
                  html` <pixel-craft-editor-button
                    class=${classMap({ active: i === this.state.selectedLayer })}
                    @click=${() => this.state.setActiveLayer(i)}
                  >
                    <span>${i + 1}</span>
                  </pixel-craft-editor-button>`,
              )}
              <pixel-craft-editor-button @click=${this.state.addLayer}>
                <pixel-craft-editor-icon></pixel-craft-editor-icon>
              </pixel-craft-editor-button>
            </div>`,
        () =>
          html` <pixel-craft-tileset-editor @save=${this.state.closeTilesetInspector}></pixel-craft-tileset-editor>`,
      )}
    `;
  }
}
