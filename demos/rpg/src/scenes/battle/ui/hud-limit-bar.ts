// import { LitElement, css, html } from 'lit';
// import { customElement, property } from 'lit/decorators.js';
// import { styleMap } from 'lit/directives/style-map.js';
// import healingIcon from './healing_spell.png';
//
// @customElement('pixel-craft-page-battle-hud-limit-bar')
// export class BattleHUDLimitBar extends LitElement {
//     static styles = css`
//         :host {
//             display: grid;
//             grid-template-areas: 'indicator label label' 'indicator bar bar';
//         }
//
//         .indicator {
//             grid-area: indicator;
//             display: block;
//             position: relative;
//             width: 2rem;
//             height: 2rem;
//             margin-right: 0.5rem;
//
//             .background {
//                 display: flex;
//                 position: absolute;
//                 width: 100%;
//                 height: 100%;
//                 box-sizing: border-box;
//                 background-color: rgba(0, 0, 0, 0.1);
//                 background-gradiant-filter: blur(15px);
//                 border: 1px solid rgba(255, 255, 255, 0.8);
//                 transform: rotate(45deg);
//             }
//
//             .turn-counter {
//                 display: block;
//                 position: absolute;
//                 top: -0.5rem;
//                 color: var(--color-inverse);
//                 z-index: 1;
//             }
//
//             .icon {
//                 display: block;
//                 width: 2.5rem;
//                 height: 2.5rem;
//                 margin-top: -0.25rem;
//                 margin-left: -0.25rem;
//                 z-index: 1;
//                 background-repeat: no-repeat;
//                 background-size: 1.5rem;
//                 background-position-x: 0.5rem;
//                 background-position-y: 0.5rem;
//                 clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
//             }
//         }
//
//         .label {
//             grid-area: label;
//             margin-top: -0.625rem;
//         }
//
//         .bar {
//             grid-area: bar;
//             display: flex;
//             flex-direction: row;
//             position: relative;
//             height: 0.5rem;
//             width: 15rem;
//             margin-top: -0.625rem;
//
//             .fill {
//                 display: flex;
//                 height: 100%;
//             }
//
//             .cursor {
//                 display: block;
//                 box-sizing: border-box;
//                 position: absolute;
//                 width: 1rem;
//                 height: 0.75rem;
//                 background: var(--color-inverse);
//                 top: 0.25rem;
//                 margin-left: -0.5rem;
//                 clip-path: polygon(15% 51%, 0 0, 10% 0, 100% 50%, 10% 100%, 0 100%);
//                 transform: rotate(270deg);
//             }
//
//             .next-cursor {
//                 width: 0.5rem;
//                 height: 0.5rem;
//                 top: 0.5rem;
//                 margin-left: -0.25rem;
//             }
//         }
//     `;
//
//
//     render() {
//         return html`<div class="indicator">
//             <div class="background"></div>
//             <span class="turn-counter">3</span>
//             <span class="icon" style=${styleMap({
//                 'background-image': `url(${healingIcon})`,
//             })}></span>
//         </div>
//         <div class="label" style="color: #0098dc;">SYNCHRONIZED</div>
//         <div class="bar">
//             <div class="fill" style="background-color: #ee8201; width: 45%;"></div>
//             <div class="fill" style="background-color: #0098dc; width: 45%;"></div>
//             <div class="fill" style="background-color: #b3102b; width: 10%;"></div>
//             <div class="cursor" style="left: 89%"></div>
//             <div class="cursor next-cursor" style="background-color: #b3102b; left: 91%"></div>
//         </div>`;
//     }
// }
