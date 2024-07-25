type Props<T> = {
  label: string;
  value?: T;
  active?: boolean;
  onSelect?: (option: Option<T>) => void;
  onDeselect?: (option: Option<T>) => void;
  onAccept?: (option: Option<T>) => void;
};

export class Option<T = unknown> {
  #label: string;
  #value?: T;
  #active = false;
  #onSelect?: (option: this) => void;
  #onDeselect?: (option: this) => void;
  #onAccept?: (option: this) => void;

  constructor({ label, value, active, onSelect, onDeselect, onAccept }: Props<T>) {
    this.#label = label;
    this.#value = value;
    this.#active = active ?? false;
    this.#onSelect = onSelect;
    this.#onDeselect = onDeselect;
    this.#onAccept = onAccept;
  }

  get label(): string {
    return this.#label;
  }

  get value(): T | undefined {
    return this.#value;
  }

  get active(): boolean {
    return this.#active;
  }

  set active(value: boolean) {
    this.#active = value;
  }

  select(): void {
    this.#onSelect?.(this);
  }

  deselect(): void {
    this.#onDeselect?.(this);
  }

  accept(): void {
    this.#onAccept?.(this);
  }
}
