import { Rect } from '@pixel-craft/math';
import { Sprite, createContext, createTextureLoader, pipeline, sprite } from '@pixel-craft/renderer';
import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { map } from 'lit/directives/map.js';
import { range } from 'lit/directives/range.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';
import { loadFile } from '../../file-storage';
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

  private readonly state = editorState;

  private isRightMouseDown = false;
  private isMouseDown = false;

  @state()
  private accessor painting = true;

  @state()
  private accessor showOverlay = true;

  @state()
  private accessor showPalette = true;

  @state()
  private accessor currentLayer = 0;

  @state()
  private accessor currentTile = 0;

  private readonly width = 50;
  private readonly height = 50;
  private image = '';
  private palette: Rect[] = [];
  // eslint-disable-next-line @typescript-eslint/array-type
  private map: (number | undefined)[][][] = [];

  private readonly openTilesetEditor = () => {
    this.painting = false;
  };

  private readonly closeTilesetEditor = () => {
    this.painting = true;
  };

  private readonly toggleOverlay = () => {
    this.showOverlay = !this.showOverlay;
  };

  private readonly togglePalette = () => {
    this.showPalette = !this.showPalette;
  };

  private readonly setActiveLayer = (layer: number) => {
    this.currentLayer = layer;
  };

  private readonly addLayer = () => {
    this.map.push([...new Array(this.width)].map(() => [...new Array(this.height)]));
    this.requestUpdate();
  };

  private readonly removeLayer = () => {
    if (this.map.length === 1) {
      return;
    }

    this.map.pop();
    this.requestUpdate();
  };

  private readonly onPaletteTileClick = (i: number) => {
    this.currentTile = i;
  };

  private readonly onPainterTileClick = (x: number, y: number, mode: 'auto' | 'add' | 'remove' = 'auto') => {
    if (mode === 'auto') {
      if (!this.isMouseDown) {
        return;
      }

      mode = this.isRightMouseDown ? 'remove' : 'add';
    }

    this.map[this.currentLayer][x][y] = mode === 'add' ? this.currentTile : undefined;
    this.requestUpdate();
    this.renderPass();
  };

  private readonly getTileStyle = (layer: number, x: number, y: number) => {
    const tileIndex = this.map[layer]?.[x]?.[y];
    if (tileIndex === undefined) {
      return {};
    }

    return {
      background: `url(${this.image})`,
      'background-position': `-${this.palette[tileIndex].x}px -${this.palette[tileIndex].y}px`,
    };
  };

  async connectedCallback() {
    super.connectedCallback();

    document.addEventListener('contextmenu', (event) => {
      this.isRightMouseDown = true;
      event.preventDefault();
      return false;
    });
    document.addEventListener('mousedown', () => {
      this.isMouseDown = true;
    });
    document.addEventListener('mouseup', () => {
      this.isMouseDown = false;
      this.isRightMouseDown = false;
    });

    const tileset = await loadFile(this.storageKey);
    if (tileset) {
      this.image = URL.createObjectURL(tileset);
    }

    const options = localStorage.getItem(this.optionKey);
    let tileSize = 32;
    if (options) {
      const parsed = JSON.parse(options) as EditorOptions;
      this.palette = parsed.spriteFrames;
      tileSize = parsed.tileSize;
    }

    this.map = [[...new Array(this.width)].map(() => [...new Array(this.height)])];

    const context = await createContext(this.canvas);
    const textureLoader = createTextureLoader(context.device);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const texture = await textureLoader(tileset!);
    const renderPass = pipeline(context);

    this.renderPass = () => {
      const sprites: Sprite[] = [];

      for (let layer = 0; layer < this.map.length; layer++) {
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            const tileIndex = this.map[layer][x][y];
            if (tileIndex === undefined) {
              continue;
            }

            const layerCorrectedX = x - layer;
            const layerCorrectedY = y - layer;

            sprites.push(
              sprite({
                texture,
                x: tileSize * (this.width / 2) + ((layerCorrectedX * tileSize) / 2 + (layerCorrectedY * -tileSize) / 2),
                y: (layerCorrectedX * tileSize) / 4 + (layerCorrectedY * tileSize) / 4,
                frame: this.palette[tileIndex],
              }),
            );
          }
        }
      }

      renderPass(sprites.reverse());
    };

    this.requestUpdate();
  }

  render() {
    return html`
      <pixel-craft-editor-toolbar>
        <pixel-craft-editor-button @click=${this.openTilesetEditor}>
          <pixel-craft-editor-icon></pixel-craft-editor-icon>
        </pixel-craft-editor-button>
        <pixel-craft-editor-button class=${classMap({ active: this.showOverlay })} @click=${this.toggleOverlay}>
          ${when(
            this.showOverlay,
            () => html` <pixel-craft-editor-icon></pixel-craft-editor-icon>`,
            () => html` <pixel-craft-editor-icon></pixel-craft-editor-icon>`,
          )}
        </pixel-craft-editor-button>
        <pixel-craft-editor-button class=${classMap({ active: this.showPalette })} @click=${this.togglePalette}>
          <pixel-craft-editor-icon></pixel-craft-editor-icon>
        </pixel-craft-editor-button>
        <pixel-craft-editor-button>
          <pixel-craft-editor-icon></pixel-craft-editor-icon>
        </pixel-craft-editor-button>
      </pixel-craft-editor-toolbar>

      <div class=${classMap({ palette: true, hide: !this.showPalette })}>
        ${map(
          this.palette,
          (rect, i) =>
            html` <div
              @click=${() => this.onPaletteTileClick(i)}
              class=${classMap({ tile: true, active: this.currentTile === i })}
              style=${styleMap({
                background: `url(${this.image})`,
                'background-position': `-${rect.x}px -${rect.y}px`,
              })}
            ></div>`,
        )}
      </div>

      ${when(
        this.painting,
        () =>
          html` <div class=${classMap({ painter: true, hide: !this.showOverlay })}>
              ${map(
                range(this.height),
                (y) => html`
                  <div class="row">
                    ${map(
                      range(this.width),
                      (x) =>
                        html` <div
                          class="tile"
                          @mousemove=${() => this.onPainterTileClick(x, y)}
                          @click=${() => this.onPainterTileClick(x, y, 'add')}
                          @contextmenu=${() => this.onPainterTileClick(x, y, 'remove')}
                          style=${styleMap(this.getTileStyle(this.currentLayer, x, y))}
                        >
                          ${when(
                            this.currentLayer > 0 && this.map[this.currentLayer - 1][x][y] !== undefined,
                            () =>
                              html`<div
                                class="tile"
                                style=${styleMap(this.getTileStyle(this.currentLayer - 1, x, y))}
                              ></div>`,
                          )}
                        </div>`,
                    )}
                  </div>
                `,
              )}
            </div>
            <div class="layer-navigation">
              <pixel-craft-editor-button @click=${this.removeLayer}>
                <pixel-craft-editor-icon></pixel-craft-editor-icon>
              </pixel-craft-editor-button>
              ${map(
                range(this.map.length),
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
