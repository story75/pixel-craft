import { InputChangeEvent } from '@pixel-craft/demo-level-editor/dist/src/ui/components/input';
import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { generatorState } from '../generator-state';
import './components/button';
import './components/icon';
import './components/input';
import './components/inspector/inspector';
import './components/inspector/inspector-column';
import './components/inspector/inspector-row';

@customElement('pixel-craft-editor')
export class Editor extends LitElement {
  static styles = css`
    :host {
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

    .floating-container {
      pointer-events: auto;
      display: block;
      position: absolute;
      right: 0.5rem;
      top: 0.5rem;
    }
  `;

  private readonly state = generatorState;

  private readonly onSeedChange = (event: InputChangeEvent) => {
    this.state.seed = String(event.detail);
  };

  private readonly onWidthChange = (event: InputChangeEvent) => {
    this.state.width = Number(event.detail);
  };

  private readonly onHeightChange = (event: InputChangeEvent) => {
    this.state.height = Number(event.detail);
  };

  private readonly onSmoothIterationsChange = (event: InputChangeEvent) => {
    this.state.smoothIterations = Number(event.detail);
  };

  private readonly onCullSizeChange = (event: InputChangeEvent) => {
    this.state.cullSize = Number(event.detail);
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
      <div class="floating-container">
        <pixel-craft-inspector>
          <pixel-craft-inspector-column>
            <pixel-craft-inspector-row label="Seed">
              <pixel-craft-editor-input
                type="string"
                value=${this.state.seed}
                @change=${this.onSeedChange}
              ></pixel-craft-editor-input>
            </pixel-craft-inspector-row>
            <pixel-craft-inspector-row label="Width">
              <pixel-craft-editor-input
                type="number"
                value=${this.state.width}
                @change=${this.onWidthChange}
              ></pixel-craft-editor-input>
            </pixel-craft-inspector-row>
            <pixel-craft-inspector-row label="Height">
              <pixel-craft-editor-input
                type="number"
                value=${this.state.height}
                @change=${this.onHeightChange}
              ></pixel-craft-editor-input>
            </pixel-craft-inspector-row>
            <pixel-craft-inspector-row label="Smooth Iterations">
              <pixel-craft-editor-input
                type="number"
                value=${this.state.smoothIterations}
                @change=${this.onSmoothIterationsChange}
              ></pixel-craft-editor-input>
            </pixel-craft-inspector-row>
            <pixel-craft-inspector-row label="Cull Size">
              <pixel-craft-editor-input
                type="number"
                value=${this.state.cullSize}
                @change=${this.onCullSizeChange}
              ></pixel-craft-editor-input>
            </pixel-craft-inspector-row>
          </pixel-craft-inspector-column>
        </pixel-craft-inspector>
      </div>
    `;
  }
}
