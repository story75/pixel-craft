import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
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
  `;

  @state()
  private accessor editing = false;

  @state()
  private accessor showOverlay = true;

  @state()
  private accessor showPalette = false;

  private readonly openTilesetEditor = () => {
    this.editing = true;
  };

  private readonly closeTilesetEditor = () => {
    this.editing = false;
  };

  private readonly toggleOverlay = () => {
    this.showOverlay = !this.showOverlay;
  };

  private readonly togglePalette = () => {
    this.showPalette = !this.showPalette;
  };

  render() {
    return html`
      <pixel-craft-editor-toolbar>
        <pixel-craft-editor-button @click=${this.openTilesetEditor}>
          <pixel-craft-editor-icon></pixel-craft-editor-icon>
        </pixel-craft-editor-button>
        <pixel-craft-editor-button @click=${this.toggleOverlay}>
          ${this.showOverlay
            ? html` <pixel-craft-editor-icon></pixel-craft-editor-icon>`
            : html` <pixel-craft-editor-icon></pixel-craft-editor-icon>`}
        </pixel-craft-editor-button>
        <pixel-craft-editor-button @click=${this.togglePalette}>
          <pixel-craft-editor-icon></pixel-craft-editor-icon>
        </pixel-craft-editor-button>
        <pixel-craft-editor-button>
          <pixel-craft-editor-icon></pixel-craft-editor-icon>
        </pixel-craft-editor-button>
      </pixel-craft-editor-toolbar>

      ${when(
        this.editing,
        () =>
          html` <pixel-craft-tileset-editor
            @save=${this.closeTilesetEditor}
          ></pixel-craft-tileset-editor>`,
        () =>
          html` <pixel-craft-painter
            ?show-overlay=${this.showOverlay}
          ></pixel-craft-painter>`,
      )}
    `;
  }
}
