import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('ui-title-screen-settings')
export class Settings extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      margin: auto;
      min-width: 35rem;
      max-width: 70dvw;
      height: 80dvh;
      background-color: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(15px);
      border-radius: 0.5rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 1rem;
      color: white;
    }

    .row {
      display: flex;
      flex-direction: row;
      margin-left: 2rem;
      margin-bottom: 1rem;

      > .label {
        margin: auto 0;
      }

      &.active > .label:before {
        content: '';
        display: inline-block;
        position: absolute;
        width: 1rem;
        height: 1rem;
        background: url('assets/kenney_1-bit-input-prompts-pixel-16/Tiles (White)/tile_0584.png')
          no-repeat;
        background-size: 1rem;
        margin-left: -1.5rem;
        margin-top: 0.25rem;
        animation: point 2s ease-in-out infinite alternate;
      }

      > .options {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-left: auto;
        color: rgba(255, 255, 255, 0.1);

        > span {
          margin-left: 0.5rem;
          background: rgba(0, 0, 0, 0.3);
          padding: 0.25rem 0.75rem;
          border-radius: 0.25rem;

          &.active {
            color: rgba(255, 255, 255, 1);
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
        }
      }
    }

    @keyframes point {
      0% {
        margin-left: -2rem;
      }
      100% {
        margin-left: -1.5rem;
      }
    }
  `;

  render() {
    return html`<div class="row active">
        <span class="label">Language</span>
        <div class="options">
          <span class="active">English</span>
          <span>Spanish</span>
          <span>German</span>
        </div>
      </div>
      <div class="row">
        <span class="label">Font Face</span>
        <div class="options">
          <span class="active">Monocraft</span>
          <span>Arial</span>
        </div>
      </div>
      <div class="row">
        <span class="label">Master Volume</span>
        <div class="slider"></div>
      </div>
      <div class="row">
        <span class="label">BGM Volume</span>
        <div class="slider"></div>
      </div>
      <div class="row">
        <span class="label">SFX Volume</span>
        <div class="slider"></div>
      </div>
      <div class="row">
        <span class="label">Voice Volume</span>
        <div class="slider"></div>
      </div> `;
  }
}
