import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('example-ui-title-screen-settings')
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
      height: 2rem;
      margin-left: 2rem;
      margin-bottom: 1rem;

      > .label {
        margin: auto auto auto 0;
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

        > .option {
          margin-left: 0.5rem;
        }
      }

      > .slider {
        margin: auto 0;
      }
    }

    .option {
      background: rgba(0, 0, 0, 0.3);
      padding: 0.25rem 0.75rem;
      border-radius: 0.25rem;
      color: rgba(255, 255, 255, 0.1);

      &.active {
        color: rgba(255, 255, 255, 1);
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
    }

    .slider {
      position: relative;
      width: 15rem;
      height: 0.25rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 0.125rem;

      > .slider-fill {
        position: absolute;
        height: 100%;
        width: 100%;
        background: rgb(0 225 255);
        border-radius: 0.125rem;
        transform: scaleX(0.5);
        transform-origin: left center;
      }

      > .slider-knob {
        position: absolute;
        width: 0.75rem;
        height: 100%;
        background: rgb(255, 255, 255);
        border-radius: 0.125rem;
        margin-left: -0.75rem;
        left: 50%;

        &:after {
          display: inline-block;
          content: '50';
          position: absolute;
          font-size: 0.75rem;
          text-align: center;
          padding: 0.125rem 0.25rem;
          width: 1.5rem;
          background: rgb(255, 255, 255, 0.1);
          color: rgba(255, 255, 255);
          margin-left: -0.625rem;
          margin-top: 0.5rem;
          border-radius: 0.125rem;
        }
      }
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

  render() {
    return html`
      <div class="row active">
        <span class="label">Language</span>
        <div class="options">
          <span class="option active">English</span>
          <span class="option">Spanish</span>
          <span class="option">German</span>
        </div>
      </div>
      <div class="row">
        <span class="label">Font Face</span>
        <div class="options">
          <span class="option active">Monocraft</span>
          <span class="option">Arial</span>
        </div>
      </div>
      <div class="row">
        <span class="label">Master Volume</span>
        <div class="slider">
          <div class="slider-fill"></div>
          <div class="slider-knob"></div>
        </div>
      </div>
      <div class="row">
        <span class="label">BGM Volume</span>
        <div class="slider">
          <div class="slider-fill"></div>
          <div class="slider-knob"></div>
        </div>
      </div>
      <div class="row">
        <span class="label">SFX Volume</span>
        <div class="slider">
          <div class="slider-fill"></div>
          <div class="slider-knob"></div>
        </div>
      </div>
      <div class="row">
        <span class="label">Voice Volume</span>
        <div class="slider">
          <div class="slider-fill"></div>
          <div class="slider-knob"></div>
        </div>
      </div>
    `;
  }
}
