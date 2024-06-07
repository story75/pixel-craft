import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { loadFile, saveFile } from '../../file-storage';
import './icon';

export type FileEvent = CustomEvent<{ file: File | undefined }>;

@customElement('pixel-craft-editor-file-upload')
export class FileUpload extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      position: relative;
    }

    .file-upload {
      display: inline-flex;
      flex-direction: column;
      border: 2px dashed var(--pc-color-light-100);
      cursor: pointer;
      padding: 0.5rem 1.5rem;
      color: var(--pc-color-light-100);

      &:hover {
        background-color: color-mix(in srgb, var(--pc-color-dark-300), white 10%);
      }
    }

    .placeholder::before {
      font-family: 'Phosphor-Thin' !important;
      display: inline-flex;
      content: '';
      font-size: 4rem;
      margin: auto;
    }

    input[type='file'] {
      display: none;
    }

    img {
      image-rendering: pixelated;
      margin: auto;
      max-width: 5rem;
      max-height: 5rem;
    }

    .delete {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 1.5rem;
      padding: 0.5rem;
      cursor: pointer;
      color: var(--pc-color-light-100);
      transition: color 0.2s;

      &:hover {
        color: var(--pc-color-light-50);
      }
    }
  `;

  @property()
  accessor label = 'Please upload a tileset';

  @property({ attribute: 'storage-key' })
  accessor storageKey = '';

  private _file: File | undefined = undefined;

  get file() {
    return this._file;
  }

  @property({ attribute: false })
  set file(value: File | undefined) {
    if (this._file !== value) {
      this.onFileChange(value);
    }
  }

  @state()
  private accessor image = '';

  private readonly onFileInputChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    this.onFileChange(input.files?.[0]);
  };

  private readonly onFileChange = (file: File | undefined) => {
    this._file = file;
    if (this.image && !this.file) {
      URL.revokeObjectURL(this.image);
    }
    this.image = this.file ? URL.createObjectURL(this.file) : '';

    const event = new CustomEvent('file', { detail: { file: this.file } });

    if (this.storageKey) {
      saveFile(this.file, this.storageKey)
        .then(() => this.dispatchEvent(event))
        .catch(() => void 0);
    } else {
      this.dispatchEvent(event);
    }
  };

  connectedCallback() {
    super.connectedCallback();

    if (this.storageKey) {
      loadFile(this.storageKey)
        .then((file) => this.onFileChange(file))
        .catch(() => void 0);
    }
  }

  disconnectedCallback() {
    if (this.image) {
      URL.revokeObjectURL(this.image);
    }

    super.disconnectedCallback();
  }

  render() {
    return html`<label class=${classMap({ 'file-upload': true, placeholder: !this.image })}>
        <input type="file" accept=".png" @change=${this.onFileInputChange} />

        ${this.image
          ? html`<img src="${this.image}" alt=${this.file?.name ?? ''} />`
          : html`<span>${this.label}</span>`}
      </label>
      ${this.image
        ? html` <pixel-craft-editor-icon class="delete" @click=${() => this.onFileChange(undefined)}
            >
          </pixel-craft-editor-icon>`
        : ''} `;
  }
}
