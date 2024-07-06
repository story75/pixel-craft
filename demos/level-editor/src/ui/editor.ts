import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { map } from 'lit/directives/map.js';
import { range } from 'lit/directives/range.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';
import { type PaintMode, editorState } from '../editor-state';
import './components/icon';
import './modals/map-size';
import './modals/settings';
import './modals/tileset-editor';

@customElement('pixel-craft-editor')
export class Editor extends LitElement {
  static styles = css`
    :host {
      --tile-size: 32px;

      pointer-events: none;
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 0;
      left: 0;
      width: 100dvw;
      height: 100dvh;
      overflow: hidden;
    }

    .toolbar {
      pointer-events: auto;
      display: flex;
      position: absolute;
      flex-direction: column;
      padding: 0.5rem;
      gap: 0.5rem;
      color: var(--pc-color-light-50);

      .active {
        background-color: var(--pc-color-primary-300);
      }
    }

    .layer-navigation {
      pointer-events: auto;
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
      pointer-events: auto;
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

    .element-grid {
      pointer-events: auto;
      display: grid;
      position: absolute;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
      padding: 0.5rem;
      background-color: var(--pc-color-dark-300);
      border-radius: 0.25rem;

      .element {
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

    .palette {
      bottom: 0.5rem;
      left: 0.5rem;
    }

    .tools {
      top: 0.5rem;
      right: 0.5rem;

      .active {
        background-color: var(--pc-color-primary-300);
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

  private readonly addLayer = () => {
    this.state.addLayer();
    this.requestUpdate();
  };

  private readonly removeLayer = () => {
    this.state.removeLayer();
    this.requestUpdate();
  };

  private readonly paintTile = (x: number, y: number, mode: PaintMode = 'auto') => {
    this.state.paintTile(x, y, mode);
    this.requestUpdate();
  };

  connectedCallback() {
    super.connectedCallback();

    this.state.addEventListener('change', () => {
      this.requestUpdate();
    });

    this.requestUpdate();
  }

  render() {
    return html`
      <div class="toolbar">
        <pixel-craft-editor-button @click=${this.state.openSettings}>
          <pixel-craft-editor-icon></pixel-craft-editor-icon>
        </pixel-craft-editor-button>
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
        <pixel-craft-editor-button class=${classMap({ active: this.state.showTools })} @click=${this.state.toggleTools}>
          <pixel-craft-editor-icon></pixel-craft-editor-icon>
        </pixel-craft-editor-button>
        <pixel-craft-editor-button @click=${this.state.openMapSize}>
          <pixel-craft-editor-icon></pixel-craft-editor-icon>
        </pixel-craft-editor-button>
      </div>

      <div class=${classMap({ 'element-grid': true, palette: true, hide: !this.state.showPalette })}>
        ${map(
          this.state.palette,
          (rect, i) =>
            html` <div
              @click=${() => this.state.selectTile(i)}
              class=${classMap({ element: true, tile: true, active: this.state.selectedTileIndex === i })}
              style=${styleMap({
                background: `url(${this.state.tilesetImage})`,
                'background-position': `-${rect.x}px -${rect.y}px`,
              })}
            ></div>`,
        )}
      </div>

      <div class=${classMap({ 'element-grid': true, tools: true, hide: !this.state.showTools })}>
        ${map(
          this.state.tools,
          (tool, i) =>
            html` <pixel-craft-editor-button
              @click=${() => this.state.selectTool(i)}
              class=${classMap({ element: true, active: this.state.selectedToolIndex === i })}
            >
              <pixel-craft-editor-icon>${tool.icon}</pixel-craft-editor-icon>
            </pixel-craft-editor-button>`,
        )}
      </div>

      ${when(
        !this.state.isModalOpen(),
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
                              html` <div
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
              <pixel-craft-editor-button @click=${this.removeLayer}>
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
              <pixel-craft-editor-button @click=${this.addLayer}>
                <pixel-craft-editor-icon></pixel-craft-editor-icon>
              </pixel-craft-editor-button>
            </div>`,
      )}
      ${when(
        this.state.showTilesetInspector,
        () =>
          html`<pixel-craft-modal-tileset-editor
            @save=${this.state.closeTilesetInspector}
          ></pixel-craft-modal-tileset-editor>`,
      )}
      ${when(
        this.state.showMapSize,
        () =>
          html` <pixel-craft-modal-map-size
            width=${this.state.width}
            height=${this.state.height}
            @save=${this.state.closeMapSize}
          ></pixel-craft-modal-map-size>`,
      )}
      ${when(
        this.state.showSettings,
        () => html`<pixel-craft-modal-settings @close=${this.state.closeSettings}></pixel-craft-modal-settings>`,
      )}
    `;
  }
}
