// import type { InputManager } from '@pixel-craft/input';
// import type { Translator } from '@pixel-craft/translation';
// import { LitElement, css, html } from 'lit';
// import { customElement, property } from 'lit/decorators.js';
// import characterSprite from './story75-Recovered.png';
// import './hud-turn-order';
// import './hud-characters';
// import './hud-limit-bar';
// import './hud-action-menu';
// import {getOption, nextOption, type Option, type OptionList, previousOption} from "@pixel-craft/state";
//
// @customElement('pixel-craft-page-battle-hud')
// export class BattleHUD extends LitElement {
//   static styles = css`
//       :host {
//           display: flex;
//           flex-direction: column;
//           width: 100dvw;
//           height: 100dvh;
//       }
//
//       .container {
//           display: flex;
//           flex-direction: column;
//           position: relative;
//           box-sizing: border-box;
//           width: calc(100% - 2rem);
//           height: calc(100% - 2rem);
//           margin: auto;
//       }
//
//         pixel-craft-page-battle-hud-turn-order {
//           position: absolute;
//           top: 0;
//           left: 0;
//       }
//
//     pixel-craft-page-battle-hud-limit-bar {
//           position: absolute;
//           top: 0;
//           left: 50%;
//           transform: translateX(-50%);
//       }
//
//     pixel-craft-page-battle-hud-characters {
//         position: absolute;
//         top: 0;
//         right: 0;
//       }
//
//       .game-speed {
//           display: flex;
//           flex-direction: column;
//           position: absolute;
//           bottom: 0;
//           left: 0;
//           color: var(--color-inverse);
//       }
//
//       .action-menu-anchor {
//           display: flex;
//           flex-direction: column;
//           position: absolute;
//           bottom: 10rem;
//           right: min(15rem, 30dvw);
//
//         pixel-craft-page-battle-hud-action-menu + pixel-craft-page-battle-hud-action-menu {
//               transform: translate(0.5rem, 0.5rem);
//           }
//       }
//   `;
//
//   @property()
//   accessor active = false;
//
//   @property()
//   accessor inputManager!: InputManager;
//
//   @property()
//   accessor translator!: Translator;
//
//   #subscriptions: (() => void)[] = [];
//
//   @property()
//   accessor actors: {
//     id: string;
//     name: string;
//     sprite: string;
//     spriteSize: [number, number];
//     spriteOffset: [number, number];
//     hp: {
//       current: number;
//       max: number;
//     };
//     sp: {
//       current: number;
//       max: number;
//     };
//     party: 'player' | 'enemy';
//   }[] = [
//     {
//       id: 'player-1',
//       name: 'Omegamon',
//       sprite: characterSprite,
//       spriteSize: [48, 96],
//       spriteOffset: [20, 5],
//       hp: {
//         current: 1884,
//         max: 1884,
//       },
//       sp: {
//         current: 254,
//         max: 254,
//       },
//       party: 'player',
//     },
//     {
//       id: 'player-2',
//       name: 'Imperialdramon PM',
//       sprite: characterSprite,
//       spriteSize: [48, 96],
//       spriteOffset: [20, 5],
//       hp: {
//         current: 2650,
//         max: 2650,
//       },
//       sp: {
//         current: 187,
//         max: 187,
//       },
//       party: 'player',
//     },
//     {
//       id: 'enemy-1',
//       name: 'MachineDramon',
//       sprite: characterSprite,
//       spriteSize: [48, 96],
//       spriteOffset: [20, 5],
//       hp: {
//         current: 2650,
//         max: 2650,
//       },
//       sp: {
//         current: 187,
//         max: 187,
//       },
//       party: 'enemy',
//     },
//     {
//       id: 'enemy-2',
//       name: 'Myotismon',
//       sprite: characterSprite,
//       spriteSize: [48, 96],
//       spriteOffset: [20, 5],
//       hp: {
//         current: 2650,
//         max: 2650,
//       },
//       sp: {
//         current: 187,
//         max: 187,
//       },
//       party: 'enemy',
//     },
//   ];
//
//   @property()
//   accessor turnOrder: string[] = ['player-1', 'player-2', 'enemy-1', 'enemy-2'];
//
//   @property()
//   accessor actions: OptionList<Option<string>> =  {
//     type: 'option-list',
//     label: 'Actions',
//     cycle: true,
//     options: [
//       {
//         type: 'option',
//         label: 'BATTLE.ACTIONS.ATTACK',
//         active: true,
//         init: (option) => {
//           option.label = this.translator.translate(option.label);
//         }
//       },
//       {
//         type: 'option',
//         label: 'BATTLE.ACTIONS.SKILL',
//         init: (option) => {
//           option.label = this.translator.translate(option.label);
//         }
//       },
//       {
//         type: 'option',
//         label: 'BATTLE.ACTIONS.ITEM',
//         init: (option) => {
//           option.label = this.translator.translate(option.label);
//         }
//       },
//       {
//         type: 'option',
//         label: 'BATTLE.ACTIONS.ESCAPE',
//         init: (option) => {
//           option.label = this.translator.translate(option.label);
//         }
//       },
//     ],
//   };
//   connectedCallback() {
//     super.connectedCallback();
//     this.active = true;
//
//     if (!this.inputManager) {
//       throw new Error('InputManager is required');
//     }
//
//     if (!this.translator) {
//       throw new Error('Translator is required');
//     }
//
//     for (const option of this.actions.options) {
//       if (option.init) {
//         option.init(option);
//       }
//     }
//
//     this.#subscriptions.push(
//       this.inputManager.addEventListener('up', () => {
//         if (!this.active) {
//           return;
//         }
//
//         previousOption(this.actions);
//         this.requestUpdate();
//       }),
//     );
//
//     this.#subscriptions.push(
//       this.inputManager.addEventListener('down', () => {
//         if (!this.active) {
//           return;
//         }
//
//         nextOption(this.actions);
//         this.requestUpdate();
//       }),
//     );
//
//     this.#subscriptions.push(
//       this.inputManager.addEventListener('accept', () => {
//         if (!this.active) {
//           return;
//         }
//
//         const option = getOption(this.actions);
//         if (option.accept) {
//           option.accept(option);
//         }
//         this.requestUpdate();
//       }),
//     );
//   }
//
//   disconnectedCallback() {
//     super.disconnectedCallback();
//     this.active = false;
//
//     for (const unsubscribe of this.#subscriptions) {
//       unsubscribe();
//     }
//   }
//
//   render() {
//     return html`
//         <div class="container">
//             <pixel-craft-page-battle-hud-turn-order .actors=${this.actors}
//                                                     .turnOrder=${this.turnOrder}></pixel-craft-page-battle-hud-turn-order>
//             <pixel-craft-page-battle-hud-limit-bar></pixel-craft-page-battle-hud-limit-bar>
//               <pixel-craft-page-battle-hud-characters .actors=${this.actors}
//                                                       .turnOrder=${this.turnOrder}></pixel-craft-page-battle-hud-characters>
//             <div class="action-menu-anchor">
//               <pixel-craft-page-battle-hud-action-menu .actions=${this.actions}></pixel-craft-page-battle-hud-action-menu>
//             </div>
//             <div class="game-speed">
//                 Game Speed x 2
//             </div>
//         </div>`;
//   }
// }
