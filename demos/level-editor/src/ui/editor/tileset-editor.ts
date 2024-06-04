import { LitElement, css, html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { map } from 'lit/directives/map.js';
import { range } from 'lit/directives/range.js';
import { styleMap } from 'lit/directives/style-map.js';
import '../components/button';
import '../components/checkerboard';
import '../components/container';
import '../components/file-upload';
import { FileEvent } from '../components/file-upload';
import '../components/icon';
import '../components/inspector/inspector';
import '../components/inspector/inspector-column';
import '../components/inspector/inspector-row';
import '../components/layer';
import '../components/select';
import { EditorOptions, optionKey, storageKey } from './editor-options';

@customElement('pixel-craft-tileset-editor')
export class Editor extends LitElement {
  static styles = css`
    :host {
      --tile-size: 32px;
      --zoom: 1px;

      display: flex;
      flex-direction: column;
      position: absolute;
      top: 0;
      left: 0;
      width: 100dvw;
      height: 100dvh;
      overflow: hidden;
    }

    pixel-craft-editor-container {
      min-width: 35rem;
      max-width: 70dvw;
      margin: auto;

      > pixel-craft-editor-file-upload {
        margin: 0 auto;
      }
    }

    .tileset {
      position: absolute;
      display: flex;
      flex-direction: column;

      .row {
        display: flex;
        flex-direction: row;
      }

      .tile {
        display: flex;
        box-sizing: border-box;
        width: var(--tile-size);
        height: var(--tile-size);
        cursor: pointer;
        border: var(--zoom) solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.5);
        transition:
          border 0.1s,
          background 0.1s;

        &.selected {
          border: var(--zoom) solid rgba(255, 0, 0, 0.4);
          background: rgba(0, 0, 0, 0);
        }
      }
    }

    .save {
      width: 4rem;
      height: 4rem;
      margin: auto 0 auto auto;

      pixel-craft-editor-icon {
        margin: auto;
        font-size: 3rem;
      }
    }
  `;

  private readonly storageKey = storageKey;
  private readonly optionKey = optionKey;
  private image = '';
  private tileset: File | undefined = undefined;
  private zoom = 1;
  private tileSize = 32;
  private margin = 0;
  private width = 0;
  private height = 0;
  private x = 0;
  private y = 0;
  private selectedTiles: string[] = [];

  private readonly onTilesetChange = (file: File | undefined) => {
    this.tileset = file;
    if (this.image && !this.tileset) {
      URL.revokeObjectURL(this.image);
    }
    this.image = this.tileset ? URL.createObjectURL(this.tileset) : '';
    this.requestUpdate();
  };

  private readonly updateState = () => {
    const doubledMargin = this.margin * 2;

    this.x = (this.width - doubledMargin) / this.tileSize;
    this.y = (this.height - doubledMargin) / this.tileSize;

    this.style.setProperty('--zoom', `${this.zoom}px`);
    this.style.setProperty('--tile-size', `${this.tileSize * this.zoom}px`);
    this.requestUpdate();
  };

  private readonly onTilesetLoad = (event: Event) => {
    const image = event.target as HTMLImageElement;
    this.width = image.width;
    this.height = image.height;
    this.updateState();
  };

  private readonly tileKey = (x: number, y: number) => `${x}:${y}`;

  private readonly onTileClick = (x: number, y: number) => {
    const key = this.tileKey(x, y);
    const index = this.selectedTiles.indexOf(key);

    if (index !== -1) {
      this.selectedTiles.splice(index, 1);
    } else {
      this.selectedTiles.push(key);
    }
    this.requestUpdate();
  };

  private readonly onZoomChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    this.zoom = Number(target.value);
    this.updateState();
  };

  private readonly onTileSizeChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    this.tileSize = Number(target.value);
    this.updateState();
  };

  private readonly onMarginChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    this.margin = Number(target.value);
    this.updateState();
  };

  private readonly onSave = () => {
    const options: EditorOptions = {
      tileSize: this.tileSize,
      margin: this.margin,
      zoom: this.zoom,
      selectedTiles: this.selectedTiles,
      spriteFrames: this.selectedTiles.map((key) => {
        const [x, y] = key.split(':').map(Number);
        return {
          x: this.margin + x * this.tileSize,
          y: this.margin + y * this.tileSize,
          width: this.tileSize,
          height: this.tileSize,
        };
      }),
    };

    localStorage.setItem(this.optionKey, JSON.stringify(options));
    this.dispatchEvent(new CustomEvent('save', { detail: options }));
  };

  connectedCallback() {
    super.connectedCallback();

    const options = localStorage.getItem(this.optionKey);
    if (options) {
      const { tileSize, margin, zoom, selectedTiles } = JSON.parse(options) as EditorOptions;
      this.tileSize = tileSize;
      this.margin = margin;
      this.zoom = zoom;
      this.selectedTiles = selectedTiles;
      this.updateState();
    }
  }

  render() {
    return html`
      <pixel-craft-editor-layer>
        <pixel-craft-editor-container>
          ${this.tileset
            ? nothing
            : html` <pixel-craft-editor-file-upload
                storage-key=${this.storageKey}
                @file=${(event: FileEvent) => this.onTilesetChange(event.detail.file)}
              ></pixel-craft-editor-file-upload>`}
          ${!this.tileset
            ? nothing
            : html`
                <pixel-craft-inspector>
                  <pixel-craft-inspector-row>
                    <pixel-craft-inspector-column>
                      <pixel-craft-inspector-row label="Zoom">
                        <pixel-craft-editor-select
                          @change=${this.onZoomChange}
                          type="number"
                          value=${this.zoom}
                          .formatter=${(value: number) => `${value}x`}
                          .options=${[1, 2, 4]}
                        ></pixel-craft-editor-select>
                      </pixel-craft-inspector-row>
                      <pixel-craft-inspector-row label="Tile size">
                        <pixel-craft-editor-select
                          @change=${this.onTileSizeChange}
                          type="number"
                          value=${this.tileSize}
                          .formatter=${(value: number) => `${value}px`}
                          .options=${[16, 32, 48]}
                        ></pixel-craft-editor-select>
                      </pixel-craft-inspector-row>
                      <pixel-craft-inspector-row label="Margin">
                        <pixel-craft-editor-select
                          @change=${this.onMarginChange}
                          type="number"
                          value=${this.margin}
                          .formatter=${(value: number) => `${value}px`}
                          .options=${[0, 16, 32]}
                        ></pixel-craft-editor-select>
                      </pixel-craft-inspector-row>
                    </pixel-craft-inspector-column>
                    <pixel-craft-inspector-column fill>
                      <pixel-craft-inspector-row vertical-center>
                        <pixel-craft-editor-file-upload
                          storage-key=${this.storageKey}
                          @file=${(event: FileEvent) => this.onTilesetChange(event.detail.file)}
                        ></pixel-craft-editor-file-upload>
                        <pixel-craft-editor-button
                          @click=${this.onSave}
                          class="save"
                          ?disabled=${this.selectedTiles.length === 0}
                        >
                          <pixel-craft-editor-icon></pixel-craft-editor-icon>
                        </pixel-craft-editor-button>
                      </pixel-craft-inspector-row>
                    </pixel-craft-inspector-column>
                  </pixel-craft-inspector-row>
                </pixel-craft-inspector>
                <div>
                  <div
                    class="tileset"
                    style=${styleMap({
                      padding: this.margin ? `${this.margin * this.zoom}px` : undefined,
                    })}
                  >
                    ${map(
                      range(this.y),
                      (y) => html`
                        <div class="row">
                          ${map(
                            range(this.x),
                            (x) => html`
                              <div
                                class=${classMap({
                                  tile: true,
                                  selected: this.selectedTiles.includes(this.tileKey(x, y)),
                                })}
                                @click=${() => this.onTileClick(x, y)}
                              ></div>
                            `,
                          )}
                        </div>
                      `,
                    )}
                  </div>
                  <pixel-craft-editor-checkerboard size=${this.tileSize * this.zoom}>
                    <img
                      src="${this.image}"
                      alt=${this.tileset.name}
                      style=${styleMap({ zoom: this.zoom })}
                      @load=${this.onTilesetLoad}
                    />
                  </pixel-craft-editor-checkerboard>
                </div>
              `}
        </pixel-craft-editor-container>
      </pixel-craft-editor-layer>
    `;
  }
}
