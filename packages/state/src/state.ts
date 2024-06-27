import { EventBus } from '@pixel-craft/event-bus';

type StateChangeEvent = CustomEvent<{ property: string | symbol | number; value: unknown }>;

type StateEventMap = {
  change: StateChangeEvent;
};

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
export class State extends EventBus<StateEventMap> {}
