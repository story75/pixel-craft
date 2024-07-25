import type { Option } from './option';
import type { Slider } from './slider';

type Props<Host extends object = object, Property extends keyof Host = keyof Host> = {
  label: string;
  active?: boolean;
  cycle?: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: we really want to allow any type here
  options: (Option<any> | Select | Slider)[];
  binding?: [host: Host, property: Property];
  onSelect?: (select: Select) => void;
  onDeselect?: (select: Select) => void;
  onAccept?: (select: Select) => void;
  onChange?: (option: Option | Select | Slider) => void;
};

export class Select<Host extends object = object, Property extends keyof Host = keyof Host> {
  #label: string;
  #options: (Option | Select | Slider)[];
  #binding?: [host: Record<string | symbol, unknown>, property: string | symbol];
  #active = false;
  #cycle = false;
  #onSelect?: (select: this) => void;
  #onDeselect?: (select: this) => void;
  #onAccept?: (select: this) => void;
  #onChange?: (option: Option | Select | Slider) => void;

  constructor(props: Props<Host, Property>) {
    const { label, active, cycle, options, binding, onSelect, onDeselect, onAccept, onChange } = props;
    this.#label = label;
    this.#options = options;
    this.#active = active ?? false;
    this.#cycle = cycle ?? false;
    this.#binding = binding as [host: Record<string | symbol, unknown>, property: string | symbol] | undefined;
    this.#onSelect = onSelect;
    this.#onDeselect = onDeselect;
    this.#onAccept = onAccept;
    this.#onChange = onChange;

    this.#sync();

    const activeOption = this.#options.find((option) => option.active);
    if (!activeOption) {
      this.#toggle(0, 0);
    }
  }

  get label() {
    return this.#label;
  }

  get active() {
    return this.#active;
  }

  set active(value) {
    this.#active = value;
  }

  get options() {
    this.#sync();

    return this.#options;
  }

  get option(): Option | Select | Slider | undefined {
    return this.#options.find((option) => option.active);
  }

  #sync() {
    if (!this.#binding) {
      return;
    }

    const [host, property] = this.#binding;
    const value = host[property];

    const newIndex = this.#options.findIndex((option) => 'value' in option && option.value === value);
    const currentIndex = this.#options.findIndex((option) => option.active);

    if (newIndex !== -1 && currentIndex !== newIndex) {
      this.#toggle(currentIndex, newIndex);
    }
  }

  #toggle(currentIndex: number, newIndex: number) {
    const currentOption = this.options[currentIndex];
    const nextOption = this.options[newIndex];

    currentOption.active = false;
    currentOption.deselect();

    nextOption.active = true;
    nextOption.select();

    this.change();
  }

  previous() {
    const currentIndex = this.#options.findIndex((option) => option.active);
    const previousIndex = this.#cycle
      ? (currentIndex - 1 + this.#options.length) % this.#options.length
      : Math.max(currentIndex - 1, 0);

    this.#toggle(currentIndex, previousIndex);
  }

  next() {
    const currentIndex = this.#options.findIndex((option) => option.active);
    const nextIndex = this.#cycle
      ? (currentIndex + 1) % this.#options.length
      : Math.min(currentIndex + 1, this.#options.length - 1);

    this.#toggle(currentIndex, nextIndex);
  }

  select() {
    this.#onSelect?.(this);
  }

  deselect() {
    this.#onDeselect?.(this);
  }

  accept() {
    this.#onAccept?.(this);
  }

  change() {
    const option = this.option;
    if (!option) {
      return;
    }

    if ('value' in option && this.#binding) {
      const [host, property] = this.#binding;
      host[property] = option.value;
    }

    this.#onChange?.(option);
  }
}
