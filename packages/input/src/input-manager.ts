import { EventBus } from '@pixel-craft/event-bus';
import { Vector2 } from '@pixel-craft/math';
import { Actions } from './actions';

type InputEventMap<CustomActions extends string> = {
  [Action in Actions]: CustomEvent<{ action: Action }>;
} & {
  [Action in CustomActions]: CustomEvent<{ action: Action }>;
} & {
  keydown: CustomEvent<{ key: string }>;
  keyup: CustomEvent<{ key: string }>;
};

/**
 * The input manager is responsible for tracking pressed keys and calculating input axes.
 */
export class InputManager<CustomActions extends string = ''> extends EventBus<InputEventMap<CustomActions>> {
  /**
   * The keys that are currently pressed
   *
   * @remarks
   * The keys are stored as an array of strings.
   * The strings are the key codes of the keys that are currently pressed.
   *
   * @default []
   */
  #pressed: string[] = [];

  /**
   * The actions that are being tracked
   *
   * @remarks
   * The actions are stored as an array of strings.
   * The strings are the action names that are being tracked.
   *
   * @default []
   */
  readonly #actions: (Actions | CustomActions)[];

  /**
   * The mapping of all actions to actual key bindings
   */
  readonly #bindings: Record<Actions | CustomActions, string[]>;

  /**
   * The directional input vector
   *
   * @remarks
   * A positive x value means right, and a negative x value means left.
   * If no horizontal direction key is pressed, the x value is 0.
   *
   * A positive y value means down, and a negative y value means up.
   * If no vertical direction key is pressed, the y value is 0.
   */
  readonly #direction = new Vector2({ x: 0, y: 0 });

  constructor(bindings: Partial<Record<Actions | CustomActions, string[]>> = {}, customActions: CustomActions[] = []) {
    super();

    this.#actions = [...Object.values(Actions), ...customActions];

    this.#bindings = {
      [Actions.Up]: ['ArrowUp', 'KeyW'],
      [Actions.Down]: ['ArrowDown', 'KeyS'],
      [Actions.Left]: ['ArrowLeft', 'KeyA'],
      [Actions.Right]: ['ArrowRight', 'KeyD'],
      [Actions.Menu]: ['Escape'],
      [Actions.Accept]: ['Enter'],
      [Actions.Cancel]: ['Escape', 'Backspace'],
      // not type safe here, but enforced by the for of loop below
      ...(bindings as Record<CustomActions, string[]>),
    };

    for (const customAction of customActions) {
      // make sure that all custom actions have an array of bindings
      this.#bindings[customAction] = bindings[customAction] ?? [];
    }

    document.addEventListener('keydown', this.#keydown);
    document.addEventListener('keyup', this.#keyup);
  }

  /**
   * {@inheritDoc InputManager._direction}
   */
  get direction(): Readonly<Vector2> {
    return this.#direction;
  }

  /**
   * {@inheritDoc InputManager._pressed}
   */
  get pressed(): readonly string[] {
    return this.#pressed;
  }

  /**
   * Check if an action is pressed
   *
   * @remarks
   * This method will return false if no key is bound to the action.
   */
  isActionPressed(action: Actions | CustomActions): boolean {
    const binding = this.#bindings[action];
    if (!binding) {
      return false;
    }

    return binding.some((key) => this.#pressed.includes(key));
  }

  readonly #keydown = (event: KeyboardEvent) => {
    this.#pressed.push(event.code);
    this.#updateDirection();

    for (const action of this.#actions) {
      if (this.isActionPressed(action)) {
        // action is enforced to be a valid action here
        this.dispatchEvent(new CustomEvent(action, { detail: { action } }) as InputEventMap<CustomActions>[Actions]);
      }
    }

    this.dispatchEvent(
      new CustomEvent('keydown', { detail: { key: event.code } }) as InputEventMap<CustomActions>['keydown'],
    );
  };

  readonly #keyup = (event: KeyboardEvent) => {
    this.#pressed = this.#pressed.filter((key) => key !== event.code);
    this.#updateDirection();
    this.dispatchEvent(
      new CustomEvent('keyup', { detail: { key: event.code } }) as InputEventMap<CustomActions>['keyup'],
    );
  };

  #updateDirection() {
    this.#direction.x = 0;
    this.#direction.y = 0;

    if (this.isActionPressed(Actions.Right)) {
      this.#direction.x += 1;
    }

    if (this.isActionPressed(Actions.Left)) {
      this.#direction.x -= 1;
    }

    if (this.isActionPressed(Actions.Up)) {
      this.#direction.y -= 1;
    }

    if (this.isActionPressed(Actions.Down)) {
      this.#direction.y += 1;
    }
  }
}
