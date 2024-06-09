import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../components/button';
import '../components/container';
import '../components/icon';
import '../components/input';
import { InputChangeEvent } from '../components/input';
import '../components/inspector/inspector';
import '../components/inspector/inspector-column';
import '../components/inspector/inspector-row';
import '../components/layer';
import { editorState } from '../editor-state';

@customElement('pixel-craft-modal-map-size')
export class MapSize extends LitElement {
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
      min-width: 35rem;
      max-width: 70dvw;
      margin: auto;
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

  @property()
  accessor width = 0;

  @property()
  accessor height = 0;

  private readonly onWidthChange = (event: InputChangeEvent) => {
    this.width = Number(event.detail);
  };

  private readonly onHeightChange = (event: InputChangeEvent) => {
    this.height = Number(event.detail);
  };

  private readonly onSave = () => {
    this.state.resizeMap(this.width, this.height);
    this.dispatchEvent(new CustomEvent('save'));
  };

  render() {
    return html`
      <pixel-craft-editor-layer>
        <pixel-craft-editor-container>
          <pixel-craft-inspector>
            <pixel-craft-inspector-row>
              <pixel-craft-inspector-column>
                <pixel-craft-inspector-row label="Width">
                  <pixel-craft-editor-input
                    type="number"
                    value=${this.width}
                    @change=${this.onWidthChange}
                  ></pixel-craft-editor-input>
                </pixel-craft-inspector-row>
                <pixel-craft-inspector-row label="Height">
                  <pixel-craft-editor-input
                    type="number"
                    value=${this.height}
                    @change=${this.onHeightChange}
                  ></pixel-craft-editor-input>
                </pixel-craft-inspector-row>
              </pixel-craft-inspector-column>
              <pixel-craft-inspector-column fill>
                <pixel-craft-inspector-row vertical-center>
                  <pixel-craft-editor-button
                    @click=${this.onSave}
                    class="save"
                    ?disabled=${this.width < 0 || this.height < 0}
                  >
                    <pixel-craft-editor-icon></pixel-craft-editor-icon>
                  </pixel-craft-editor-button>
                </pixel-craft-inspector-row>
              </pixel-craft-inspector-column>
            </pixel-craft-inspector-row>
          </pixel-craft-inspector>
        </pixel-craft-editor-container>
      </pixel-craft-editor-layer>
    `;
  }
}
