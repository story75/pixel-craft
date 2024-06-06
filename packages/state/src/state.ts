type StateChangeEvent = CustomEvent<{ property: string; value: unknown }>;

type StateEventMap = {
  change: StateChangeEvent;
};

// eslint-disable-next-line
export interface State extends EventTarget {
  addEventListener<K extends keyof StateEventMap>(
    type: K,
    listener: (this: State, ev: StateEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
}

/**
 * Base class for state management
 *
 * @remarks
 * The state extends the EventTarget class to allow for event listeners to be added to the state,
 * to make the state inherently observable.
 *
 * This is different from @pixel-craft/observable, which is a separate package that provides synchronous observables.
 * This one, due to the nature of event listeners, is asynchronous and updates are handled via the event loop instead of the stack.
 *
 * Thus, you should only use this for non-game state, such as UI state, or other state that doesn't need to be handled within a single frame.
 */
// eslint-disable-next-line
export class State extends EventTarget {}

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
