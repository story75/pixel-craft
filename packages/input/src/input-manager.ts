import { Vector2 } from '@pixel-craft/math';
import { Observable } from '@pixel-craft/observable';
import { Actions } from './actions';

/**
 * The input manager is responsible for tracking pressed keys and calculating input axes.
 */
export class InputManager<CustomActions extends string = string> {
  /**
   * The singleton instance of the InputManager
   *
   * @remarks
   * This property is set when the InputManager is instantiated the first time.
   * New instances of the InputManager will overwrite the existing instance.
   */
  static Instance: InputManager | undefined;

  /**
   * The keys that are currently pressed
   *
   * @remarks
   * The keys are stored as an array of strings.
   * The strings are the key codes of the keys that are currently pressed.
   *
   * @default []
   */
  private _pressed: string[] = [];

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
  private readonly _direction = new Vector2({ x: 0, y: 0 });

  /**
   * Observables for each action
   *
   * @remarks
   * The observable will notify when the action is pressed.
   */
  public readonly observables: Record<Actions | CustomActions, Observable>;

  constructor(
    private readonly actions: Array<Actions | CustomActions> = Object.values(Actions),
    private readonly bindings: Partial<Record<Actions | CustomActions, string[]>> = {
      [Actions.Up]: ['ArrowUp', 'KeyW'],
      [Actions.Down]: ['ArrowDown', 'KeyS'],
      [Actions.Left]: ['ArrowLeft', 'KeyA'],
      [Actions.Right]: ['ArrowRight', 'KeyD'],
      [Actions.Menu]: ['Escape'],
      [Actions.Accept]: ['Enter'],
      [Actions.Cancel]: ['Escape', 'Backspace'],
    } as Partial<Record<Actions | CustomActions, string[]>>,
  ) {
    /* eslint-disable @typescript-eslint/prefer-reduce-type-parameter */
    this.observables = actions.reduce(
      (observables, action) => ({
        ...observables,
        [action]: new Observable(),
      }),
      {} as Record<Actions | CustomActions, Observable>,
    );
    /* eslint-enable @typescript-eslint/prefer-reduce-type-parameter */

    document.addEventListener('keydown', this.keydown);
    document.addEventListener('keyup', this.keyup);

    InputManager.Instance = this;
  }

  /**
   * {@inheritDoc InputManager._direction}
   */
  get direction(): Readonly<Vector2> {
    return this._direction;
  }

  /**
   * {@inheritDoc InputManager._pressed}
   */
  get pressed(): readonly string[] {
    return this._pressed;
  }

  /**
   * Check if an action is pressed
   *
   * @remarks
   * This method will return false if no key is bound to the action.
   */
  isActionPressed(action: Actions | CustomActions): boolean {
    const binding = this.bindings[action];
    if (!binding) {
      return false;
    }

    return binding.some((key) => this._pressed.includes(key));
  }

  private readonly keydown = (event: KeyboardEvent) => {
    this._pressed.push(event.code);
    this.updateDirection();

    for (const action of this.actions) {
      if (this.isActionPressed(action)) {
        this.observables[action].notify();
      }
    }
  };

  private readonly keyup = (event: KeyboardEvent) => {
    this._pressed = this._pressed.filter((key) => key !== event.code);
    this.updateDirection();
  };

  private updateDirection() {
    this._direction.x = 0;
    this._direction.y = 0;

    if (this.isActionPressed(Actions.Right)) {
      this._direction.x += 1;
    }

    if (this.isActionPressed(Actions.Left)) {
      this._direction.x -= 1;
    }

    if (this.isActionPressed(Actions.Up)) {
      this._direction.y -= 1;
    }

    if (this.isActionPressed(Actions.Down)) {
      this._direction.y += 1;
    }
  }
}
