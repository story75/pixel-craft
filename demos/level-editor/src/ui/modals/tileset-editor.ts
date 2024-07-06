import { LitElement, css, html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { map } from 'lit/directives/map.js';
import { range } from 'lit/directives/range.js';
import { styleMap } from 'lit/directives/style-map.js';
import { editorState } from '../../editor-state';
import '../components/button';
import '../components/checkerboard';
import '../components/container';
import '../components/file-upload';
import type { FileEvent } from '../components/file-upload';
import '../components/icon';
import '../components/inspector/inspector';
import '../components/inspector/inspector-column';
import '../components/inspector/inspector-row';
import '../components/layer';
import '../components/select';
import type { SelectChangeEvent } from '../components/select';

@customElement('pixel-craft-modal-tileset-editor')
export class TilesetEditor extends LitElement {
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

    pixel-craft-inspector {
      margin-bottom: 1rem;
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

  private readonly state = editorState;

  private width = 0;
  private height = 0;
  private x = 0;
  private y = 0;

  private readonly onTilesetChange = (file: File | undefined) => {
    this.state.tilesetFile = file;
  };

  private readonly updateState = () => {
    const doubledMargin = this.state.margin * 2;

    this.x = (this.width - doubledMargin) / this.state.tileSize;
    this.y = (this.height - doubledMargin) / this.state.tileSize;

    this.style.setProperty('--zoom', `${this.state.zoom}px`);
    this.style.setProperty('--tile-size', `${this.state.tileSize * this.state.zoom}px`);
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
    const index = this.state.selectedTiles.indexOf(key);

    if (index !== -1) {
      this.state.selectedTiles = this.state.selectedTiles.toSpliced(index, 1);
    } else {
      this.state.selectedTiles = [...this.state.selectedTiles, key];
    }
  };

  private readonly onZoomChange = (event: SelectChangeEvent) => {
    this.state.zoom = Number(event.detail);
  };

  private readonly onTileSizeChange = (event: SelectChangeEvent) => {
    this.state.tileSize = Number(event.detail);
  };

  private readonly onMarginChange = (event: SelectChangeEvent) => {
    this.state.margin = Number(event.detail);
  };

  private readonly saveDisabled = () => this.state.selectedTiles.length === 0;

  private readonly onSave = () => {
    if (this.saveDisabled()) {
      return;
    }

    this.state.palette = this.state.selectedTiles.map((key) => {
      const [x, y] = key.split(':').map(Number);
      return {
        x: this.state.margin + x * this.state.tileSize,
        y: this.state.margin + y * this.state.tileSize,
        width: this.state.tileSize,
        height: this.state.tileSize,
      };
    });

    this.dispatchEvent(new CustomEvent('save'));
  };

  connectedCallback() {
    super.connectedCallback();

    this.state.addEventListener('change', () => {
      this.updateState();
    });
  }

  render() {
    return html`
      <pixel-craft-editor-layer>
        <pixel-craft-editor-container>
          ${
            this.state.tilesetFile
              ? nothing
              : html` <pixel-craft-editor-file-upload
                @file=${(event: FileEvent) => this.onTilesetChange(event.detail.file)}
              ></pixel-craft-editor-file-upload>`
          }
          ${
            !this.state.tilesetFile
              ? nothing
              : html`
                <pixel-craft-inspector>
                  <pixel-craft-inspector-row>
                    <pixel-craft-inspector-column>
                      <pixel-craft-inspector-row label="Zoom">
                        <pixel-craft-editor-select
                          @change=${this.onZoomChange}
                          type="number"
                          value=${this.state.zoom}
                          .formatter=${(value: number) => `${value}x`}
                          .options=${[1, 2, 4]}
                        ></pixel-craft-editor-select>
                      </pixel-craft-inspector-row>
                      <pixel-craft-inspector-row label="Tile size">
                        <pixel-craft-editor-select
                          @change=${this.onTileSizeChange}
                          type="number"
                          value=${this.state.tileSize}
                          .formatter=${(value: number) => `${value}px`}
                          .options=${[16, 32, 48]}
                        ></pixel-craft-editor-select>
                      </pixel-craft-inspector-row>
                      <pixel-craft-inspector-row label="Margin">
                        <pixel-craft-editor-select
                          @change=${this.onMarginChange}
                          type="number"
                          value=${this.state.margin}
                          .formatter=${(value: number) => `${value}px`}
                          .options=${[0, 16, 32]}
                        ></pixel-craft-editor-select>
                      </pixel-craft-inspector-row>
                    </pixel-craft-inspector-column>
                    <pixel-craft-inspector-column fill>
                      <pixel-craft-inspector-row vertical-center>
                        <pixel-craft-editor-file-upload
                          .file=${this.state.tilesetFile}
                          @file=${(event: FileEvent) => this.onTilesetChange(event.detail.file)}
                        ></pixel-craft-editor-file-upload>
                        <pixel-craft-editor-button @click=${this.onSave} class="save" ?disabled=${this.saveDisabled()}>
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
                      padding: this.state.margin ? `${this.state.margin * this.state.zoom}px` : undefined,
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
                                  selected: this.state.selectedTiles.includes(this.tileKey(x, y)),
                                })}
                                @click=${() => this.onTileClick(x, y)}
                              ></div>
                            `,
                          )}
                        </div>
                      `,
                    )}
                  </div>
                  <pixel-craft-editor-checkerboard size=${this.state.tileSize * this.state.zoom}>
                    <img
                      src="${this.state.tilesetImage}"
                      alt=${this.state.tilesetFile.name}
                      style=${styleMap({ zoom: this.state.zoom })}
                      @load=${this.onTilesetLoad}
                    />
                  </pixel-craft-editor-checkerboard>
                </div>
              `
          }
        </pixel-craft-editor-container>
      </pixel-craft-editor-layer>
    `;
  }
}
