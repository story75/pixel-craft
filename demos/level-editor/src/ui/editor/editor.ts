import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
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

  render() {
    return html`
      <pixel-craft-editor-header>
        <pixel-craft-editor-button>
          <span>list-magnifying-glass</span>
        </pixel-craft-editor-button>
      </pixel-craft-editor-header>

      <pixel-craft-tileset-editor></pixel-craft-tileset-editor>
    `;
  }
}
