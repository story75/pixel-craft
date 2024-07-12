// import { LitElement, css, html } from 'lit';
// import { customElement, property } from 'lit/decorators.js';
// import { classMap } from 'lit/directives/class-map.js';
// import { styleMap } from 'lit/directives/style-map.js';
// import { map } from 'lit/directives/map.js';
//
// @customElement('pixel-craft-page-battle-hud-turn-order')
// export class BattleHUDTurnOrder extends LitElement {
//   static styles = css`
//         :host {
//             display: flex;
//             flex-direction: row;
//         }
//
//         .actor {
//             display: block;
//             position: relative;
//             margin-left: -0.125rem;
//             width: 1.5rem;
//             height: 1.5rem;
//         }
//
//         .background {
//             display: flex;
//             position: absolute;
//             width: 100%;
//             height: 100%;
//             box-sizing: border-box;
//             background-color: rgba(0, 0, 0, 0.1);
//             background-gradiant-filter: blur(15px);
//             border: 1px solid rgba(255, 255, 255, 0.8);
//             transform: rotate(45deg);
//
//             .background-gradiant {
//                 display: flex;
//                 position: absolute;
//                 width: 100%;
//                 height: 100%;
//                 background: linear-gradient(to top left, rgba(0, 225, 255, 0.8) 0%, transparent 80%);
//             }
//         }
//
//         .enemy .background-gradiant {
//             background: linear-gradient(to top left, rgba(255, 0, 0, 0.8) 0%, transparent 80%);
//         }
//
//         .sprite {
//             display: block;
//             width: 2rem;
//             height: 2rem;
//             margin-top: -0.25rem;
//             margin-left: -0.25rem;
//             z-index: 1;
//             background-repeat: no-repeat;
//             clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
//         }
//
//         .actor:first-child {
//             width: 2.5rem;
//             height: 2.5rem;
//             margin-left: 0;
//             margin-right: 0.75rem;
//
//             .background {
//                 border-width: 2px;
//
//                 .background-gradiant:before {
//                     content: '';
//                     display: flex;
//                     border-width: 2px;
//                     border-style: solid;
//                     border-image-slice: 1;
//                     border-image-source: linear-gradient(
//                             to top left,
//                             transparent 15%,
//                             rgba(255, 255, 255, 0.8) 50%,
//                             transparent 85%
//                     );
//                     width: calc(100% - 1rem);
//                     height: calc(100% - 1rem);
//                     margin: auto;
//                 }
//             }
//
//             .sprite {
//                 width: 3.5rem;
//                 height: 3.5rem;
//                 margin-top: -0.5rem;
//                 margin-left: -0.5rem;
//             }
//         }
//     `;
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
//   }[] = [];
//
//   @property()
//   accessor turnOrder: string[] = [];
//
//   getActor(id: string) {
//       return this.actors.find((actor) => actor.id === id);
//   }
//
//   render() {
//     return map(
//       this.turnOrder,
//       (actorId, index) => {
//           // biome-ignore lint/style/noNonNullAssertion: prototype - remove later
//           const actor = this.getActor(actorId)!;
//
//           return html`
//             <div class=${classMap({
//               actor: true,
//               enemy: actor.party === 'enemy',
//           })}>
//                 <div class="background">
//                     <div class="background-gradiant"></div>
//                 </div>
//                 <div class="sprite" style=${styleMap({
//               'background-image': `url(${actor.sprite})`,
//               'background-size': `${actor.spriteSize[0]}px ${actor.spriteSize[1]}px`,
//               'background-position-x': index === 0 ? `${actor.spriteOffset[0]}px` : '0',
//               'background-position-y': index === 0 ? `${actor.spriteOffset[1]}px` : '0',
//           })}></div>
//             </div>`;
//       },
//     );
//   }
// }
