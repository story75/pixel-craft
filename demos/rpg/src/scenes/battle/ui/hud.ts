import type { InputManager } from '@pixel-craft/input';
import type { Translator } from '@pixel-craft/translation';
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import healingIcon from './healing_spell.png';
import characterSprite from './story75-Recovered.png';

@customElement('pixel-craft-page-battle-hud')
export class BattleHUD extends LitElement {
  static styles = css`
      :host {
          display: flex;
          flex-direction: column;
          width: 100dvw;
          height: 100dvh;
      }

      .container {
          display: flex;
          flex-direction: column;
          position: relative;
          box-sizing: border-box;
          width: calc(100% - 2rem);
          height: calc(100% - 2rem);
          margin: auto;
      }

      .turn-order {
          display: flex;
          flex-direction: row;
          position: absolute;
          top: 0;
          left: 0;

          .actor {
              display: block;
              position: relative;
              margin-left: -0.125rem;
              width: 1.5rem;
              height: 1.5rem;
          }

          .background {
              display: flex;
              position: absolute;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              background-color: rgba(0, 0, 0, 0.1);
              background-gradiant-filter: blur(15px);
              border: 1px solid rgba(255, 255, 255, 0.8);
              transform: rotate(45deg);

              .background-gradiant {
                  display: flex;
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  background: linear-gradient(to top left, rgba(0, 225, 255, 0.8) 0%, transparent 80%);
              }
          }

          .enemy .background-gradiant {
              background: linear-gradient(to top left, rgba(255, 0, 0, 0.8) 0%, transparent 80%);
          }

          .sprite {
              display: block;
              width: 2rem;
              height: 2rem;
              margin-top: -0.25rem;
              margin-left: -0.25rem;
              z-index: 1;
              background-repeat: no-repeat;
              clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
          }

          .actor:first-child {
              width: 2.5rem;
              height: 2.5rem;
              margin-left: 0;
              margin-right: 0.75rem;

              .background {
                  border-width: 2px;

                  .background-gradiant:before {
                      content: '';
                      display: flex;
                      border-width: 2px;
                      border-style: solid;
                      border-image-slice: 1;
                      border-image-source: linear-gradient(
                              to top left,
                              transparent 15%,
                              rgba(255, 255, 255, 0.8) 50%,
                              transparent 85%
                      );
                      width: calc(100% - 1rem);
                      height: calc(100% - 1rem);
                      margin: auto;
                  }
              }

              .sprite {
                  width: 3.5rem;
                  height: 3.5rem;
                  margin-top: -0.5rem;
                  margin-left: -0.5rem;
              }
          }
      }

      .limit-bar {
          display: grid;
          grid-template-areas: 'indicator label label' 'indicator bar bar';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);

          .indicator {
              grid-area: indicator;
              display: block;
              position: relative;
              width: 2rem;
              height: 2rem;
              margin-right: 0.5rem;

              .background {
                  display: flex;
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  box-sizing: border-box;
                  background-color: rgba(0, 0, 0, 0.1);
                  background-gradiant-filter: blur(15px);
                  border: 1px solid rgba(255, 255, 255, 0.8);
                  transform: rotate(45deg);
              }

              .turn-counter {
                  display: block;
                  position: absolute;
                  top: -0.5rem;
                  color: var(--color-inverse);
                  z-index: 1;
              }

              .icon {
                  display: block;
                  width: 2.5rem;
                  height: 2.5rem;
                  margin-top: -0.25rem;
                  margin-left: -0.25rem;
                  z-index: 1;
                  background-repeat: no-repeat;
                  background-size: 1.5rem;
                  background-position-x: 0.5rem;
                  background-position-y: 0.5rem;
                  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
              }
          }

          .label {
              grid-area: label;
              margin-top: -0.625rem;
          }

          .bar {
              grid-area: bar;
              display: flex;
              flex-direction: row;
              position: relative;
              height: 0.5rem;
              width: 15rem;
              margin-top: -0.625rem;

              .fill {
                  display: flex;
                  height: 100%;
              }

              .cursor {
                  display: block;
                  box-sizing: border-box;
                  position: absolute;
                  width: 1rem;
                  height: 0.75rem;
                  background: var(--color-inverse);
                  top: 0.25rem;
                  margin-left: -0.5rem;
                  clip-path: polygon(15% 51%, 0 0, 10% 0, 100% 50%, 10% 100%, 0 100%);
                  transform: rotate(270deg);
              }

              .next-cursor {
                  width: 0.5rem;
                  height: 0.5rem;
                  top: 0.5rem;
                  margin-left: -0.25rem;
              }
          }
      }

      .characters {
          display: flex;
          flex-direction: column;
          position: absolute;
          top: 0;
          right: 0;
          font-size: 0.75rem;
          color: var(--color-inverse);

          .actor {
              display: flex;
              flex-direction: column;
              width: 7.5rem;
              margin-bottom: 1rem;
              padding: 0.25rem;
              backdrop-filter: blur(15px);

              &.active {
                  background-color: rgba(0, 0, 0, 0.1);
                  border: 1px solid rgba(255, 255, 255, 0.1);
                  border-radius: 0.125rem;
                  margin-left: -2rem;

                  .name {
                      color: #0098dc;
                  }
              }

              .hp, .sp {
                  display: flex;
                  flex-direction: column;

                  .label {
                      display: flex;
                      flex-direction: row;
                      justify-content: space-between;

                      .type {
                          font-size: 0.5rem;
                          margin-top: auto;
                          color: #92a1b9;
                      }

                      .current {
                          font-size: 0.875rem;
                          margin-right: 0.125rem;
                      }

                      .max {
                          font-size: 0.75rem;
                          margin-left: 0.125rem;
                      }
                  }

                  .bar {
                      display: flex;
                      flex-direction: row;
                      height: 0.375rem;
                      width: 100%;
                      background-color: #424c6e;

                      .fill {
                          display: flex;
                          height: 100%;
                          width: 100%;
                          transform-origin: left;
                      }
                  }
              }

              .hp .fill {
                  background-color: #5ac54f;
              }

              .sp {
                  margin-left: 2rem;
                  
                  .fill {
                      background-color: #0098dc;
                  }
              }
          }
      }

      .game-speed {
          display: flex;
          flex-direction: column;
          position: absolute;
          bottom: 0;
          left: 0;
          color: var(--color-inverse);
      }
  `;

  @property()
  accessor active = false;

  @property()
  accessor inputManager!: InputManager;

  @property()
  accessor translator!: Translator;

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
        this.requestUpdate();
      }),
    );

    this.#subscriptions.push(
      this.inputManager.addEventListener('down', () => {
        if (!this.active) {
          return;
        }
        this.requestUpdate();
      }),
    );

    this.#subscriptions.push(
      this.inputManager.addEventListener('accept', () => {
        if (!this.active) {
          return;
        }
        this.requestUpdate();
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
        <div class="container">
            <div class="turn-order">
                <div class="actor">
                    <div class="background">
                        <div class="background-gradiant"></div>
                    </div>
                    <div class="sprite" style=${styleMap({
                      'background-image': `url(${characterSprite})`,
                      'background-size': '48px 96px',
                      'background-position-y': '5px',
                      'background-position-x': '20px',
                    })}></div>
                </div>
                <div class="actor">
                    <div class="background">
                        <div class="background-gradiant"></div>
                    </div>
                    <div class="sprite" style=${styleMap({
                      'background-image': `url(${characterSprite})`,
                      'background-size': '48px 96px',
                    })}></div>
                </div>
                <div class="actor enemy">
                    <div class="background">
                        <div class="background-gradiant"></div>
                    </div>
                    <div class="sprite" style=${styleMap({
                      'background-image': `url(${characterSprite})`,
                      'background-size': '48px 96px',
                    })}></div>
                </div>
                <div class="actor enemy">
                    <div class="background">
                        <div class="background-gradiant"></div>
                    </div>
                    <div class="sprite" style=${styleMap({
                      'background-image': `url(${characterSprite})`,
                      'background-size': '48px 96px',
                    })}></div>
                </div>
                <div class="actor">
                    <div class="background">
                        <div class="background-gradiant"></div>
                    </div>
                    <div class="sprite" style=${styleMap({
                      'background-image': `url(${characterSprite})`,
                      'background-size': '48px 96px',
                    })}></div>
                </div>
                <div class="actor enemy">
                    <div class="background">
                        <div class="background-gradiant"></div>
                    </div>
                    <div class="sprite" style=${styleMap({
                      'background-image': `url(${characterSprite})`,
                      'background-size': '48px 96px',
                    })}></div>
                </div>
            </div>
            <div class="limit-bar">
                <div class="indicator">
                    <div class="background"></div>
                    <span class="turn-counter">3</span>
                    <span class="icon" style=${styleMap({
                      'background-image': `url(${healingIcon})`,
                    })}></span>
                </div>
                <div class="label" style="color: #0098dc;">SYNCHRONIZED</div>
                <div class="bar">
                    <div class="fill" style="background-color: #ee8201; width: 45%;"></div>
                    <div class="fill" style="background-color: #0098dc; width: 45%;"></div>
                    <div class="fill" style="background-color: #b3102b; width: 10%;"></div>
                    <div class="cursor" style="left: 89%"></div>
                    <div class="cursor next-cursor" style="background-color: #b3102b; left: 91%"></div>
                </div>
            </div>
            <div class="characters">
                <div class="actor">
                    <span class="name">Omegamon</span>
                    <div class="hp">
                        <div class="label">
                            <div class="type">HP</div>
                            <div class="values">
                                <span class="current">1884</span>/<span class="max">1884</span>
                            </div>
                        </div>
                        <div class="bar">
                            <div class="fill"></div>
                        </div>
                    </div>
                    <div class="sp">
                        <div class="label">
                            <div class="type">SP</div>
                            <div class="values">
                                <span class="current">254</span>/<span class="max">254</span>
                            </div>
                        </div>
                        <div class="bar">
                            <div class="fill"></div>
                        </div>
                    </div>
                </div>
                <div class="actor active">
                    <span class="name">Omegamon</span>
                    <div class="hp">
                        <div class="label">
                            <div class="type">HP</div>
                            <div class="values">
                                <span class="current">1884</span>/<span class="max">1884</span>
                            </div>
                        </div>
                        <div class="bar">
                            <div class="fill"></div>
                        </div>
                    </div>
                    <div class="sp">
                        <div class="label">
                            <div class="type">SP</div>
                            <div class="values">
                                <span class="current">254</span>/<span class="max">254</span>
                            </div>
                        </div>
                        <div class="bar">
                            <div class="fill"></div>
                        </div>
                    </div>
                </div>
                <div class="actor">
                    <span class="name">Omegamon</span>
                    <div class="hp">
                        <div class="label">
                            <div class="type">HP</div>
                            <div class="values">
                                <span class="current">1884</span>/<span class="max">1884</span>
                            </div>
                        </div>
                        <div class="bar">
                            <div class="fill"></div>
                        </div>
                    </div>
                    <div class="sp">
                        <div class="label">
                            <div class="type">SP</div>
                            <div class="values">
                                <span class="current">254</span>/<span class="max">254</span>
                            </div>
                        </div>
                        <div class="bar">
                            <div class="fill"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="game-speed">
                Game Speed x 2
            </div>
        </div>`;
  }
}
