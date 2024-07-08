import type { InputManager } from '@pixel-craft/input';
import type { Translator } from '@pixel-craft/translation';
import { LitElement, css, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { map } from 'lit/directives/map.js';
import '../components/modal';
import { formatTime } from '../../format-time';
import type { SaveState } from '../../state';
import icon from '../pointer.png';
@customElement('pixel-craft-modal-save-states-save-state')
export class ModalSaveStatesSaveState extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      margin-bottom: 1rem;
      opacity: 0.2;
      transition: opacity 0.2s;
    }

    :host:before {
      content: '';
      display: inline-block;
      width: 1rem;
      height: 1rem;
      background: url('${unsafeCSS(icon)}') no-repeat;
      background-size: 1rem;
      animation: point 2s ease-in-out infinite alternate;
      opacity: 0;
      margin: auto 0.5rem;
    }

    :host([active]) {
      opacity: 1;
    }

    :host([active]):before {
      opacity: 1;
    }

    ul, li {
      margin: 0;
      padding: 0;
    }

    li {
      list-style: none;
    }

    .box {
      display: grid;
      grid-template-areas: 'location protagonist team status';
      padding: 1rem;
      gap: 0.5rem;
      flex: 1;
      border-radius: 0.5rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: background-color 0.2s;
    }

    :host([active]) .box {
      background-color: rgba(0, 0, 0, 0.3);
    }

    .location {
      display: flex;
      flex-direction: column;
      grid-area: location;
      position: relative;
    }

    .protagonist {
      display: flex;
      flex-direction: column;
      grid-area: protagonist;
    }

    .team {
      display: flex;
      flex-direction: column;
      grid-area: team;
    }

    .status {
      display: flex;
      flex-direction: column;
      grid-area: status;
      text-align: right;
    }

    .save-type {
      font-size: 0.75rem;
    }

    .save-time {
      font-size: 0.75rem;
      opacity: 0.5;
    }

    .version {
      font-size: 0.5rem;
      opacity: 0.5;
    }

    .save-time, .location-name {
      margin-top: auto;
    }

    @keyframes point {
      0% {
        transform: translateX(-0.5rem);
      }
      100% {
        transform: translateX(0);
      }
    }
  `;

  @property()
  accessor saveState: SaveState = {
    type: 'manual',
    id: 'skeleton',
    updatedAt: new Date().getTime(),
    createdAt: new Date().getTime(),
    playtime: 0,
    version: '0.0.1',
  };

  @property()
  accessor active = false;

  render() {
    return html`
        <div class=${classMap({ box: true, [this.saveState.type]: true })}>
            <div class="location">
                <span class="location-name">Nexus Square</span>
            </div>
            <div class="protagonist"></div>
            <div class="team">
              <ul>
                <li></li>
              </ul>
              <span class="save-time">${new Date(this.saveState.updatedAt).toLocaleString()}</span>
            </div>
            <ul class="status">
                <li class="save-type">${this.saveState.type}</li>
                <li>${formatTime(this.saveState.playtime)}</li>
                <li class="version">v${this.saveState.version}</li>
            </ul>
        </div>`;
  }
}

@customElement('pixel-craft-modal-save-states')
export class ModalSaveStates extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width: 100dvw;
      height: 100dvh;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      transition: opacity 0.5s;
    }

    pixel-craft-modal {
      margin: auto;
      min-width: 35rem;
      max-width: 70dvw;
      height: 80dvh;
    }
  `;

  @property()
  accessor active = false;

  @property()
  accessor inputManager!: InputManager;

  @property()
  accessor translator!: Translator;

  @property()
  accessor saveStates: SaveState[] = [
    {
      type: 'autosave',
      id: 'autosave',
      updatedAt: new Date().getTime(),
      createdAt: new Date().getTime() - 50000,
      playtime: 0,
      version: '0.0.1',
    },
    {
      type: 'manual',
      id: 'manual-1',
      updatedAt: new Date().getTime() - 50000,
      createdAt: new Date().getTime() - 50000,
      playtime: 5000,
      version: '0.0.2',
    },
    {
      type: 'manual',
      id: 'manual-2',
      updatedAt: new Date().getTime() - 40000,
      createdAt: new Date().getTime() - 50000,
      playtime: 15000,
      version: '0.0.3',
    },
  ];

  @property()
  accessor selectedSave = 'autosave';

  #subscriptions: (() => void)[] = [];
  connectedCallback() {
    super.connectedCallback();
    this.active = true;

    if (!this.inputManager) {
      throw new Error('InputManager is required');
    }

    if (!this.translator) {
      throw new Error('Translator is required');
    }

    this.#subscriptions.push(
      this.inputManager.addEventListener('up', () => {
        if (!this.active) {
          return;
        }

        const index = this.saveStates.findIndex((saveState) => saveState.id === this.selectedSave);
        this.selectedSave = this.saveStates[Math.max(index - 1, 0)].id;

        this.requestUpdate();
      }),
    );

    this.#subscriptions.push(
      this.inputManager.addEventListener('down', () => {
        if (!this.active) {
          return;
        }

        const index = this.saveStates.findIndex((saveState) => saveState.id === this.selectedSave);
        this.selectedSave = this.saveStates[Math.min(index + 1, this.saveStates.length - 1)].id;

        this.requestUpdate();
      }),
    );

    this.#subscriptions.push(
      this.inputManager.addEventListener('cancel', () => {
        if (!this.active) {
          return;
        }

        this.dispatchEvent(new CustomEvent('cancel'));
      }),
    );

    this.#subscriptions.push(
      this.inputManager.addEventListener('accept', () => {
        if (!this.active) {
          return;
        }

        const saveState = this.saveStates.find((saveState) => saveState.id === this.selectedSave);
        if (!saveState) {
          return;
        }
        this.dispatchEvent(new CustomEvent('load-state', { detail: saveState }));
      }),
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.active = false;

    for (const unsubscribe of this.#subscriptions) {
      unsubscribe();
    }
  }

  render() {
    return html`
      <pixel-craft-modal>
        ${map(this.saveStates, (saveState, index) => {
          return html`<pixel-craft-modal-save-states-save-state
                .saveState=${saveState}
                ?active=${this.selectedSave === saveState.id}
            ></pixel-craft-modal-save-states-save-state>`;
        })}
      </pixel-craft-modal>
    `;
  }
}
