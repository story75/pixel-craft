import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type InputChangeEvent = CustomEvent<string | number>;

@customElement('pixel-craft-editor-input')
export class Input extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
    }

    input {
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

  private _value: string | number | undefined = undefined;

  get value() {
    return this._value;
  }

  @property()
  set value(value) {
    if (value === undefined) {
      this._value = undefined;
    } else {
      this._value = this.type === 'number' ? Number(value) : this.formatter(value);
    }
  }

  @property({ attribute: false })
  accessor formatter: (value: number | string) => string = (value) => String(value);

  @property({ attribute: false })
  accessor binding: Record<string, unknown> | undefined = undefined;

  @property({ attribute: 'binding-name' })
  accessor bindingName = '';

  @property()
  accessor placeholder = '';

  @property()
  accessor type: 'text' | 'password' | 'number' = 'text';

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
    return html`<input
      type=${this.type}
      value=${this.value}
      placeholder=${this.placeholder}
      @change=${this.onChange}
    />`;
  }
}
