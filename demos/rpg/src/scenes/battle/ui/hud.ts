import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { map } from 'lit/directives/map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { InputController, bindInput } from '../../../ui/controllers/input-controller';
import { Option } from '../../../ui/form/option';
import { Select } from '../../../ui/form/select';
import { translate } from '../../../ui/translate';
import healingIcon from './healing_spell.png';
import characterSprite from './story75-Recovered.png';

type Actor = {
  id: string;
  name: string;
  sprite: string;
  spriteSize: [number, number];
  spriteOffset: [number, number];
  hp: {
    current: number;
    max: number;
  };
  sp: {
    current: number;
    max: number;
  };
  party: 'player' | 'enemy';
};

@customElement('x-battle-action-item')
class ActionItem extends LitElement {
  static styles = css`
        :host {
            display: flex;
            position: relative;
            background-color: rgba(0, 0, 0, 0.1);
            border-radius: 0.125rem;
            padding: 0.25rem;
            color: rgba(255, 255, 255, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.4);
            transition: all 0.2s;
        }

          :host([active]) {
              color: rgba(255, 255, 255, 1);
              border-color: rgba(255, 255, 255, 0.8);
              background-color: rgba(0, 0, 0, 0.2);
              transform: translateX(-0.5rem);

              .highlight {
                  opacity: 1;
              }
          }

        .highlight {
            display: inline-block;
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to top left, rgba(0, 225, 255, 0.4) 0%, transparent 80%);
            transition: opacity 0.2s;
        }
    `;

  @property({ type: Boolean })
  accessor active = false;

  @property()
  accessor label = '';

  render() {
    return html`
            <div class="highlight"></div>
            <div class="label">${translate(this.label)}</div>
        `;
  }
}

@customElement('x-battle-action-menu')
class ActionMenu extends LitElement {
  static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            position: absolute;
            background-color: rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(15px);
            border-radius: 0.125rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 0.75rem;
            padding: 0.25rem 0.75rem;
            color: var(--color-inverse);
            min-width: 7.5rem;
        }
    `;

  render() {
    return html`<slot></slot>`;
  }
}

@customElement('x-battle-actor')
class BattleActor extends LitElement {
  static styles = css`
        :host {
          display: flex;
          flex-direction: column;
          width: 7.5rem;
          margin-bottom: 1rem;
          padding: 0.25rem;
          backdrop-filter: blur(15px);
          transition: all 0.2s;
        }

        :host([active]) {
            background-color: rgba(0, 0, 0, 0.1);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 0.125rem;
              transform: translateX(-2rem);

              .name {
                  color: #0098dc;
              }
        }

        .hp, .sp {
            display: flex;
            flex-direction: column;
        }

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
                    transition: transform 0.2s;
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
    `;

  @property({ type: Boolean })
  accessor active = false;

  @property()
  accessor name = '';

  @property()
  accessor currentHp = 0;

  @property()
  accessor maxHp = 0;

  @property()
  accessor currentSp = 0;

  @property()
  accessor maxSp = 0;

  fillPercentage(current: number, max: number) {
    return max <= 0 ? '0' : `${(current / max) * 100}%`;
  }

  render() {
    return html`
        <span class="name">${this.name}</span>
        <div class="hp">
            <div class="label">
                <div class="type">HP</div>
                <div class="values">
                    <span class="current">${this.currentHp}</span>/<span class="max">${this.maxHp}</span>
                </div>
            </div>
            <div class="bar">
                <div class="fill" style="transform: scaleX(${this.fillPercentage(this.currentHp, this.maxHp)})"></div>
            </div>
        </div>
        <div class="sp">
            <div class="label">
                <div class="type">SP</div>
                <div class="values">
                    <span class="current">${this.currentSp}</span>/<span class="max">${this.maxSp}</span>
                </div>
            </div>
            <div class="bar">
                <div class="fill" style="transform: scaleX(${this.fillPercentage(this.currentSp, this.maxSp)})"></div>
            </div>
        </div>
    `;
  }
}

@customElement('x-battle-limit-bar')
class LimitBar extends LitElement {
  static styles = css`
        :host {
            display: flex;
            flex-direction: row;
        }

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

        .container {
            display: flex;
            flex-direction: column;
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
                transition: left 0.2s;
            }

            .next-cursor {
                width: 0.5rem;
                height: 0.5rem;
                top: 0.5rem;
                margin-left: -0.25rem;
            }
        }
    `;

  @property()
  accessor icon = '';

  @property()
  accessor progress = 0;

  @property()
  accessor nextProgress = 0;

  breakpoints = [
    { state: 'BATTLE.LIMIT_BAR.STATE.BOOTING', color: '#ee8201', progress: 45 },
    { state: 'BATTLE.LIMIT_BAR.STATE.SYNCHRONIZED', color: '#0098dc', progress: 45 },
    { state: 'BATTLE.LIMIT_BAR.STATE.OVERCHARGED', color: '#b3102b', progress: 10 },
  ];

  findBreakpoint(progressThreshold: number) {
    let progress = 0;
    for (const breakpoint of this.breakpoints) {
      progress += breakpoint.progress;
      if (progressThreshold < progress) {
        return breakpoint;
      }
    }

    return this.breakpoints[this.breakpoints.length - 1];
  }

  get breakpoint() {
    return this.findBreakpoint(this.progress);
  }

  get nextBreakpoint() {
    return this.findBreakpoint(this.nextProgress);
  }

  render() {
    return html`<div class="indicator">
            <div class="background"></div>
            <span class="turn-counter">3</span>
            <span class="icon" style=${styleMap({
              'background-image': `url(${this.icon})`,
            })}></span>
        </div>
        <div class="container">
            <div class="label" style="color: ${this.breakpoint.color};">${translate(this.breakpoint.state)}</div>
            <div class="bar">
                ${map(this.breakpoints, (breakpoint) => html`<div class="fill" style="background-color: ${breakpoint.color}; width: ${breakpoint.progress}%;"></div>`)}
                <div class="cursor" style="left: ${this.progress}%"></div>
                <div class="cursor next-cursor" style="background-color: ${this.nextBreakpoint.color}; left: ${this.nextProgress}%"></div>
            </div>
        </div>`;
  }
}

@customElement('x-battle-turn-indicator')
class TurnIndicator extends LitElement {
  static styles = css`
    :host {
        display: block;
        position: relative;
        margin-left: -0.125rem;
        width: 1.5rem;
        height: 1.5rem;
    }

    :host([enemy]) {
        .background-gradiant {
            background: linear-gradient(to top left, rgba(255, 0, 0, 0.8) 0%, transparent 80%);
        }
    }

    :host([current]) {
        width: 2.5rem;
        height: 2.5rem;
        margin-left: 0;
        margin-right: 0.75rem;

        .sprite {
            width: 3.5rem;
            height: 3.5rem;
            margin-top: -0.5rem;
            margin-left: -0.5rem;
        }

        .background {
            border-width: 2px;
        }

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

    .background-gradiant {
        display: flex;
        position: absolute;
        width: 100%;
        height: 100%;
        background: linear-gradient(to top left, rgba(0, 225, 255, 0.8) 0%, transparent 80%);
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
  `;

  @property({ type: Boolean })
  accessor enemy = false;

  @property({ type: Boolean })
  accessor current = false;

  @property()
  accessor sprite = '';

  @property()
  accessor spriteSize = [48, 96];

  @property()
  accessor spriteOffset = [20, 5];

  render() {
    return html`
    <div class="background">
        <div class="background-gradiant"></div>
    </div>
    <div class="sprite" style=${styleMap({
      'background-image': `url(${this.sprite})`,
      'background-size': `${this.spriteSize[0]}px ${this.spriteSize[1]}px`,
      'background-position-x': this.current ? `${this.spriteOffset[0]}px` : '0',
      'background-position-y': this.current ? `${this.spriteOffset[1]}px` : '0',
    })}></div>`;
  }
}

@customElement('x-battle-hud')
export class BattleHUD extends LitElement {
  static styles = css`
  :host {
          display: flex;
          flex-direction: column;
          width: 100dvw;
          height: 100dvh;
      }

      .container {
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        grid-template-rows: repeat(10, 1fr);
        width: calc(100% - 2rem);
        height: calc(100% - 2rem);
        margin: auto;
      }

        .turn-order {
            display: flex;
            flex-direction: row;
            grid-column: span 3 / span 3;
            grid-row: span 2 / span 2;
        }

        .limit-bar {
            display: flex;
            grid-column: span 4 / span 4;
            grid-row: span 2 / span 2;
            grid-column-start: 4;

            x-battle-limit-bar {
                margin: 0 auto;
            }
        }

        .characters {
            display: flex;
            flex-direction: column;
            grid-column: span 2 / span 2;
            grid-row: span 5 / span 5;
            grid-column-start: 9;
            font-size: 0.75rem;
            color: var(--color-inverse);

            x-battle-actor {
                margin-left: auto;
            }
        }


      .game-speed {
        display: flex;
        grid-column: span 3 / span 3;
        grid-row-start: 10;
        font-size: 0.75rem;
        color: var(--color-inverse);

        > span {
         margin-top: auto;
        }
      }

      .action-menus {
        grid-column: span 5 / span 5;
        grid-row: span 5 / span 5;
        grid-column-start: 6;
        grid-row-start: 6;
      }
  `;

  inputController = new InputController(this);

  @property()
  accessor actors = [
    {
      id: 'player-1',
      name: 'Omegamon',
      sprite: characterSprite,
      spriteSize: [48, 96],
      spriteOffset: [20, 5],
      hp: {
        current: 1884,
        max: 1884,
      },
      sp: {
        current: 254,
        max: 254,
      },
      party: 'player',
    },
    {
      id: 'player-2',
      name: 'Imperialdramon PM',
      sprite: characterSprite,
      spriteSize: [48, 96],
      spriteOffset: [20, 5],
      hp: {
        current: 2650,
        max: 2650,
      },
      sp: {
        current: 187,
        max: 187,
      },
      party: 'player',
    },
    {
      id: 'enemy-1',
      name: 'MachineDramon',
      sprite: characterSprite,
      spriteSize: [48, 96],
      spriteOffset: [20, 5],
      hp: {
        current: 2650,
        max: 2650,
      },
      sp: {
        current: 187,
        max: 187,
      },
      party: 'enemy',
    },
    {
      id: 'enemy-2',
      name: 'Myotismon',
      sprite: characterSprite,
      spriteSize: [48, 96],
      spriteOffset: [20, 5],
      hp: {
        current: 2650,
        max: 2650,
      },
      sp: {
        current: 187,
        max: 187,
      },
      party: 'enemy',
    },
  ] satisfies Actor[];

  @property()
  accessor actions = new Select({
    label: '',
    options: [
      new Option({ label: 'BATTLE.ACTIONS.ATTACK', active: true }),
      new Option({ label: 'BATTLE.ACTIONS.SKILL' }),
      new Option({ label: 'BATTLE.ACTIONS.ITEM' }),
      new Option({ label: 'BATTLE.ACTIONS.ESCAPE' }),
    ],
  });

  @property()
  accessor turnOrder: string[] = ['player-1', 'player-2', 'enemy-1', 'enemy-2'];

  @property()
  accessor gameSpeed = 1;

  @bindInput('up')
  actionUp() {
    this.actions.previous();
    this.requestUpdate();
  }

  @bindInput('down')
  actionDown() {
    this.actions.next();
    this.requestUpdate();
  }

  render() {
    return html`
        <div class="container">
            <div class="turn-order">
                ${map(this.turnOrder, (actorId, index) => {
                  const actor = this.actors.find((actor) => actor.id === actorId);
                  if (!actor) {
                    return nothing;
                  }

                  return html`
                        <x-battle-turn-indicator
                            ?enemy=${actor.party === 'enemy'}
                            ?current=${index === 0}
                            .sprite=${actor.sprite}
                            .spriteSize=${actor.spriteSize}
                            .spriteOffset=${actor.spriteOffset}
                        ></x-battle-turn-indicator>`;
                })}
            </div>
            <div class="limit-bar">
                <x-battle-limit-bar
                    .icon=${healingIcon}
                    .progress=${50}
                    .nextProgress=${75}
                ></x-battle-limit-bar>
            </div>
            <div class="characters">
                ${map(
                  this.actors.filter((actor) => actor.party === 'player'),
                  (actor) => {
                    return html`
                        <x-battle-actor
                            ?active=${this.turnOrder[0] === actor.id}
                            .name=${actor.name}
                            .currentHp=${actor.hp.current}
                            .maxHp=${actor.hp.max}
                            .currentSp=${actor.sp.current}
                            .maxSp=${actor.sp.max}
                        ></x-battle-actor>`;
                  },
                )}
            </div>
            <div class="action-menus">
                <x-battle-action-menu>
                    ${map(
                      this.actions.options,
                      (option) => html`
                            <x-battle-action-item
                                ?active=${option.active}
                                .label=${option.label}
                            ></x-battle-action-item>`,
                    )}
                </x-battle-action-menu>
            </div>
            <div class="game-speed">
                <span>${translate('BATTLE.GAME_SPEED')} x${this.gameSpeed}</span>
            </div>
        </div>`;
  }
}
