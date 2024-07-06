import { EventBus } from '@pixel-craft/event-bus';
import { Option } from './option';

type SliderEventMap = {
  change: CustomEvent<number>;
};

export type SliderOptions = Option<number> & {
  value: number;
  min: number;
  max: number;
  step: number;
};

export class Slider extends EventBus<SliderEventMap> implements Option<number> {
  public readonly type = 'slider';

  #props: SliderOptions;

  constructor(props: SliderOptions) {
    super();
    this.#props = props;
  }

  get min(): number {
    return this.#props.min;
  }

  get max(): number {
    return this.#props.max;
  }

  get step(): number {
    return this.#props.step;
  }

  get value(): number {
    return this.#props.value;
  }

  set value(value: number) {
    this.#props.value = value;
  }

  get label(): string {
    return this.#props.label;
  }

  get active(): boolean {
    return this.#props.active ?? false;
  }

  set active(active: boolean) {
    this.#props.active = active;
  }

  public increment(): void {
    this.value = Math.min(this.value + this.step, this.max);
    this.dispatchEvent(new CustomEvent('change', { detail: this.value }));
  }

  public decrement(): void {
    this.value = Math.max(this.value - this.step, this.min);
    this.dispatchEvent(new CustomEvent('change', { detail: this.value }));
  }
}
