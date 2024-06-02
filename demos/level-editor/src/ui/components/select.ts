import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';

@customElement('pixel-craft-editor-select')
export class Select extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
    }

    label {
      position: relative;
      display: inline-flex;

      &::after {
        content: '▼';
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        font-size: 0.5rem;
        color: var(--pc-color-light-100);
        pointer-events: none;
      }
    }

    select {
      padding: 0.5rem;
      background: var(--pc-color-dark-100);
      min-width: 10rem;
      color: var(--pc-color-light-50);
      appearance: none;
      border: none;
      outline: none;
      cursor: pointer;
      border-radius: 0.25rem;
    }

    :host([disabled]) {
      cursor: not-allowed;
    }
  `;

  @property()
  accessor disabled = false;

  @property({ attribute: false })
  accessor options: Array<string | number> = [];

  @property()
  accessor value: string | number | undefined = undefined;

  @property({ attribute: false })
  accessor formatter: (value: number | string) => string = (value) =>
    String(value);

  @property({ attribute: false })
  accessor binding: Record<string, unknown> | undefined = undefined;

  @property({ attribute: 'binding-name' })
  accessor bindingName = '';

  private readonly onChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;

    if (this.binding && this.bindingName) {
      this.binding[this.bindingName] = this.value;
    }

    this.dispatchEvent(new CustomEvent('change', { detail: this.value }));
  };

  connectedCallback(): void {
    super.connectedCallback();

    if (this.binding && this.bindingName) {
      const value = this.binding[this.bindingName];

      if (typeof value === 'string' || typeof value === 'number') {
        this.value = value;
      }
    }
  }

  render() {
    return html`<label>
      <select @change=${this.onChange}>
        ${map(
          this.options,
          (option) => html`
            <option value=${option} ?selected=${option === this.value}>
              ${this.formatter(option)}
            </option>
          `,
        )}
      </select>
    </label>`;
  }
}
