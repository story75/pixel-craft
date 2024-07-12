// import { LitElement, css, html } from 'lit';
// import { customElement, property } from 'lit/decorators.js';
// import { classMap } from 'lit/directives/class-map.js';
// import { map } from 'lit/directives/map.js';
//
// @customElement('pixel-craft-page-battle-hud-characters')
// export class BattleHUDCharacters extends LitElement {
//   static styles = css`
//         :host {
//             display: flex;
//             flex-direction: column;
//             font-size: 0.75rem;
//             color: var(--color-inverse);
//         }
//
//       .actor {
//           display: flex;
//           flex-direction: column;
//           width: 7.5rem;
//           margin-bottom: 1rem;
//           padding: 0.25rem;
//           backdrop-filter: blur(15px);
//
//           &.active {
//               background-color: rgba(0, 0, 0, 0.1);
//               border: 1px solid rgba(255, 255, 255, 0.1);
//               border-radius: 0.125rem;
//               margin-left: -2rem;
//
//               .name {
//                   color: #0098dc;
//               }
//           }
//
//           .hp, .sp {
//               display: flex;
//               flex-direction: column;
//
//               .label {
//                   display: flex;
//                   flex-direction: row;
//                   justify-content: space-between;
//
//                   .type {
//                       font-size: 0.5rem;
//                       margin-top: auto;
//                       color: #92a1b9;
//                   }
//
//                   .current {
//                       font-size: 0.875rem;
//                       margin-right: 0.125rem;
//                   }
//
//                   .max {
//                       font-size: 0.75rem;
//                       margin-left: 0.125rem;
//                   }
//               }
//
//               .bar {
//                   display: flex;
//                   flex-direction: row;
//                   height: 0.375rem;
//                   width: 100%;
//                   background-color: #424c6e;
//
//                   .fill {
//                       display: flex;
//                       height: 100%;
//                       width: 100%;
//                       transform-origin: left;
//                   }
//               }
//           }
//
//           .hp .fill {
//               background-color: #5ac54f;
//           }
//
//           .sp {
//               margin-left: 2rem;
//
//               .fill {
//                   background-color: #0098dc;
//               }
//           }
//       }
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
//   fillPercentage(current: number, max: number) {
//     return `${(current / max) * 100}%`;
//   }
//   render() {
//     return map(
//       this.actors.filter((actor) => actor.party === 'player'),
//       (actor) => {
//         return html`
//             <div class=${classMap({
//               actor: true,
//               active: this.turnOrder[0] === actor.id,
//             })}>
//                 <span class="name">${actor.name}</span>
//                 <div class="hp">
//                     <div class="label">
//                         <div class="type">HP</div>
//                         <div class="values">
//                             <span class="current">${actor.hp.current}</span>/<span class="max">${actor.hp.max}</span>
//                         </div>
//                     </div>
//                     <div class="bar">
//                         <div class="fill" style="transform: scaleX(${this.fillPercentage(actor.hp.current, actor.hp.max)})"></div>
//                     </div>
//                 </div>
//                 <div class="sp">
//                     <div class="label">
//                         <div class="type">SP</div>
//                         <div class="values">
//                             <span class="current">${actor.sp.current}</span>/<span class="max">${actor.sp.max}</span>
//                         </div>
//                     </div>
//                     <div class="bar">
//                         <div class="fill" style="transform: scaleX(${this.fillPercentage(actor.sp.current, actor.sp.max)})"></div>
//                     </div>
//                 </div>
//             </div>`;
//       },
//     );
//   }
// }
