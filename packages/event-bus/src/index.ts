type IsEventMap<M> = {
  [key in keyof M]: Event;
};

export type EventListener<M, E extends keyof M> = (evt: M[E]) => void | Promise<void>;

export type EventListenerObject<M, E extends keyof M> = {
  handleEvent: (evt: M[E]) => void | Promise<void>;
};

export type Listener<M, E extends keyof M> = EventListener<M, E> | EventListenerObject<M, E>;

/**
 * A simple event bus that can be used to dispatch events and listen to them.
 *
 * @remarks
 * This class is a simple wrapper around the `EventTarget` API, with added type safety.
 *
 * Beware that due to the nature of dispatch event and the EventMap, the event type is not enforced completely.
 * If for example you have one event which just defines "Event" like baz in the example below, you can dispatch any event type.
 * If you remove the baz event from the event map, you will still be able to dispatch any CustomEvent of type number or string.
 * All other events will be type checked, so keep that in mind when using this class.
 *
 * For additional type safety, you can use the dispatchEventWithType method, which requires the event type to be passed in additionally.
 *
 * @example
 * ```ts
 * type MyEventMap = {
 *    foo: CustomEvent<number>;
 *    bar: CustomEvent<string>;
 *    baz: Event;
 * };
 *
 * const bus = new EventBus<MyEventMap>();
 *
 * bus.addEventListener('foo', (evt) => {
 *   // evt is of type CustomEvent<number>
 * });
 *
 * bus.addEventListener('bar', (evt) => {
 *   // evt is of type CustomEvent<string>
 * });
 *
 * bus.dispatchEvent(new CustomEvent('foo', { detail: 42 }));
 * bus.dispatchEvent(new CustomEvent('bar', { detail: 'hello' }));
 * bus.dispatchEvent(new Event('baz'));
 * ```
 */
export class EventBus<M extends IsEventMap<M>> {
  #eventTarget = new EventTarget();

  /**
   * Adds an event listener to the event bus.
   *
   * @remarks
   * This method is a simple wrapper around the `EventTarget.addEventListener` method with added type safety.
   * THe function returns a cleanup function that can be used to remove the event listener.
   */
  addEventListener<E extends keyof M>(
    type: E,
    listener: Listener<M, E>,
    options?: AddEventListenerOptions,
  ): () => void {
    this.#eventTarget.addEventListener(type as string, listener as EventListenerOrEventListenerObject, options);

    return () => {
      this.removeEventListener(type, listener, options);
    };
  }

  /**
   * Removes an event listener from the event bus.
   *
   * @remarks
   * This method is a simple wrapper around the `EventTarget.removeEventListener` method with added type safety.
   */
  removeEventListener<E extends keyof M>(type: E, listener: Listener<M, E>, options?: EventListenerOptions): void {
    this.#eventTarget.removeEventListener(type as string, listener as EventListenerOrEventListenerObject, options);
  }

  /**
   * Dispatches an event on the event bus.
   *
   * @remarks
   * This method is a simple wrapper around the `EventTarget.dispatchEvent` method with added type safety.
   */
  dispatchEvent<E extends keyof M>(event: M[E]): boolean {
    return this.#eventTarget.dispatchEvent(event);
  }

  /**
   * Dispatches an event on the event bus with the event type.
   *
   * @remarks
   * This method is a simple wrapper around the `EventTarget.dispatchEvent` method with added type safety.
   */
  dispatchEventWithType<E extends keyof M>(_type: E, event: M[E]): boolean {
    return this.dispatchEvent(event);
  }
}
