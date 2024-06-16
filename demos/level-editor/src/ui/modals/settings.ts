import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { editorState } from '../../editor-state';
import '../components/button';
import '../components/container';
import '../components/icon';
import '../components/input';
import '../components/inspector/inspector';
import '../components/inspector/inspector-row';
import '../components/layer';

@customElement('pixel-craft-modal-settings')
export class Settings extends LitElement {
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

    pixel-craft-editor-container {
      margin: auto;
    }

    pixel-craft-editor-button {
      width: 4rem;
      height: 4rem;

      pixel-craft-editor-icon {
        margin: auto;
        font-size: 3rem;
      }
    }
  `;

  private readonly state = editorState;

  private readonly onReset = () => {
    this.state.reset();
    this.dispatchEvent(new CustomEvent('reset'));
  };

  private readonly onSave = async () => {
    await this.state.save();
    this.dispatchEvent(new CustomEvent('save'));
  };

  private readonly onUpload = async () => {
    await this.state.upload();
    this.dispatchEvent(new CustomEvent('upload'));
  };

  render() {
    return html`
      <pixel-craft-editor-layer>
        <pixel-craft-editor-container>
          <pixel-craft-inspector>
            <pixel-craft-inspector-row>
              <pixel-craft-editor-button @click=${this.onReset}>
                <pixel-craft-editor-icon></pixel-craft-editor-icon>
              </pixel-craft-editor-button>
              <pixel-craft-editor-button @click=${this.onUpload}>
                <pixel-craft-editor-icon></pixel-craft-editor-icon>
              </pixel-craft-editor-button>
              <pixel-craft-editor-button @click=${this.onSave}>
                <pixel-craft-editor-icon></pixel-craft-editor-icon>
              </pixel-craft-editor-button>
            </pixel-craft-inspector-row>
          </pixel-craft-inspector>
        </pixel-craft-editor-container>
      </pixel-craft-editor-layer>
    `;
  }
}
