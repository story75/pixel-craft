import { EventBus } from '@pixel-craft/event-bus';
import { Option } from './option';

type OptionListEventMap = {
  change: CustomEvent<Option<unknown>>;
};

export type OptionListOptions<T = string> = Option<T> & {
  options: Option<T>[];
  cycle?: boolean;
};

export class OptionList<T = string> extends EventBus<OptionListEventMap> implements Option<T> {
  public readonly type = 'option-list';

  #props: OptionListOptions<T>;
  constructor(props: OptionListOptions<T>) {
    super();
    this.#props = props;

    const activeIndex = this.index;
    if (activeIndex === -1) {
      this.options[0].active = true;
    }
  }

  get options(): Option<T>[] {
    return this.#props.options;
  }

  get label(): string {
    return this.#props.label;
  }

  get cycle(): boolean {
    return this.#props.cycle ?? false;
  }

  get option(): Option<T> {
    return this.options[this.index];
  }

  get index(): number {
    return this.options.findIndex((option) => option.active);
  }

  get value(): T | undefined {
    return this.option.value;
  }

  get active(): boolean {
    return this.#props.active ?? false;
  }

  set active(active: boolean) {
    this.#props.active = active;
  }
  #toggleActive(newActiveIndex: number): void {
    const oldIndex = this.index;
    this.options[oldIndex].active = false;
    this.options[oldIndex].deselect?.();
    this.options[newActiveIndex].active = true;
    this.options[newActiveIndex].select?.();

    this.dispatchEvent(new CustomEvent('change', { detail: this.option }));
  }
  next(): void {
    const newActiveIndex = this.cycle
      ? (this.index + 1) % this.options.length
      : Math.min(this.index + 1, this.options.length - 1);

    this.#toggleActive(newActiveIndex);
  }

  previous(): void {
    const newActiveIndex = this.cycle
      ? (this.index - 1 + this.options.length) % this.options.length
      : Math.max(this.index - 1, 0);

    this.#toggleActive(newActiveIndex);
  }

  change(): void {
    this.dispatchEvent(new CustomEvent('change', { detail: this.option }));
  }
}
