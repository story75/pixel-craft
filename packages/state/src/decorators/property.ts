import type { State } from '../state';

export function property<This extends State, Value>(
  target: ClassAccessorDecoratorTarget<This, Value>,
  context: ClassAccessorDecoratorContext<This, Value>,
): ClassAccessorDecoratorResult<This, Value> {
  return {
    set(value: Value) {
      target.set.call(this, value);
      this.dispatchEvent(new CustomEvent('change', { detail: { property: context.name, value } }));
    },
  };
}
