type Props<Host extends object = object, Property extends keyof Host = keyof Host> = {
  label: string;
  active?: boolean;
  min?: number;
  max?: number;
  step?: number;
  onSelect?: (option: Slider) => void;
  onDeselect?: (option: Slider) => void;
  onAccept?: (option: Slider) => void;
  onChange?: (option: Slider) => void;
} & ({ binding: [host: Host, property: Property] } | { value: number });

export class Slider<Host extends object = object, Property extends keyof Host = keyof Host> {
  #label: string;
  #value?: number;
  #binding?: [host: Record<string | symbol, number>, property: string | symbol];
  #min?: number;
  #max?: number;
  #step?: number;
  #active = false;
  #onSelect?: (option: this) => void;
  #onDeselect?: (option: this) => void;
  #onAccept?: (option: this) => void;
  #onChange?: (option: this) => void;

  constructor(props: Props<Host, Property>) {
    const { label, active, min, max, step, onSelect, onDeselect, onAccept, onChange } = props;
    this.#label = label;
    this.#min = min;
    this.#max = max;
    this.#step = step;
    this.#active = active ?? false;

    if ('binding' in props) {
      this.#binding = props.binding as [host: Record<string | symbol, number>, property: string | symbol];
    } else {
      this.#value = props.value;
    }

    this.#onSelect = onSelect;
    this.#onDeselect = onDeselect;
    this.#onAccept = onAccept;
    this.#onChange = onChange;
  }

  get label(): string {
    return this.#label;
  }

  get value(): number {
    if (this.#binding) {
      const [host, property] = this.#binding;
      return host[property];
    }

    return this.#value as number;
  }

  set value(value: number) {
    if (this.#binding) {
      const [host, property] = this.#binding;
      host[property] = value;
    } else {
      this.#value = value;
    }

    this.change();
  }

  get active(): boolean {
    return this.#active;
  }

  set active(value: boolean) {
    this.#active = value;
  }

  get min(): number {
    return this.#min ?? Number.NEGATIVE_INFINITY;
  }

  get max(): number {
    return this.#max ?? Number.POSITIVE_INFINITY;
  }

  get step(): number | undefined {
    return this.#step;
  }

  increment(): void {
    const newValue = this.value + (this.#step ?? 1);
    this.value = Math.min(newValue, this.#max ?? newValue);
  }

  decrement(): void {
    const newValue = this.value - (this.#step ?? 1);
    this.value = Math.max(newValue, this.#min ?? newValue);
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

  change(): void {
    this.#onChange?.(this);
  }
}
