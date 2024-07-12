// import { LitElement, css, html } from 'lit';
// import { customElement, property } from 'lit/decorators.js';
// import { map } from 'lit/directives/map.js';
// import { classMap } from 'lit/directives/class-map.js';
// import type { Option, OptionList } from '@pixel-craft/state';
//
// @customElement('pixel-craft-page-battle-hud-action-menu')
// export class BattleHUDActionMenu extends LitElement {
//   static styles = css`
//         :host {
//             display: flex;
//             flex-direction: column;
//             position: absolute;
//             background-color: rgba(0, 0, 0, 0.1);
//             backdrop-filter: blur(15px);
//             border-radius: 0.125rem;
//             border: 1px solid rgba(255, 255, 255, 0.1);
//             font-size: 0.75rem;
//             padding: 0.25rem 0.75rem;
//             color: var(--color-inverse);
//             min-width: 7.5rem;
//         }
//
//       .item {
//           display: flex;
//           position: relative;
//           background-color: rgba(0, 0, 0, 0.1);
//           border-radius: 0.125rem;
//           padding: 0.25rem;
//           color: rgba(255, 255, 255, 0.6);
//           border: 1px solid rgba(255, 255, 255, 0.4);
//
//           .highlight {
//               display: inline-block;
//               position: absolute;
//               top: 0;
//               left: 0;
//               opacity: 0;
//               width: 100%;
//               height: 100%;
//               background: linear-gradient(to top left, rgba(0, 225, 255, 0.4) 0%, transparent 80%);
//           }
//
//           &.active {
//               color: rgba(255, 255, 255, 1);
//               border-color: rgba(255, 255, 255, 0.8);
//               background-color: rgba(0, 0, 0, 0.2);
//               transform: translateX(-0.5rem);
//
//               .highlight {
//                   opacity: 1;
//               }
//           }
//       }
//     `;
//
//   @property({
//     hasChanged() {
//       return true;
//     },
//   })
//   accessor actions: OptionList<Option<string>> = {
//     type: 'option-list',
//     label: 'Actions',
//     options: [],
//   };
//
//   render() {
//     return map(
//       this.actions.options,
//       (action) => html`
//           <div class=${classMap({
//             item: true,
//             active: action.active === true,
//           })}>
//               <div class="highlight"></div>
//               <div class="label">${action.label}</div>
//           </div>`,
//     );
//   }
// }
