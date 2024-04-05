import { System } from './system';

/**
 * An input system is responsible for tracking pressed keys and calculating input axes.
 */
export class InputSystem implements System {
  /**
   * The keys that are currently pressed
   *
   * @remarks
   * The keys are stored as an array of strings.
   * The strings are the key codes of the keys that are currently pressed.
   *
   * @default []
   */
  public pressed: string[] = [];

  /**
   * The x input
   *
   * @remarks
   * If a horizontal direction key is pressed, the value corresponds to the direction.
   * A positive value means right, and a negative value means left.
   * If no horizontal direction key is pressed, the value is 0.
   */
  public x = 0;

  /**
   * The y input
   *
   * @remarks
   * If a vertical direction key is pressed, the value corresponds to the direction.
   * A positive value means down, and a negative value means up.
   * If no vertical direction key is pressed, the value is 0.
   */
  public y = 0;

  createSystem(): Promise<void> {
    document.addEventListener('keydown', this.keydown);
    document.addEventListener('keyup', this.keyup);
    return Promise.resolve();
  }

  destroySystem(): Promise<void> {
    document.removeEventListener('keydown', this.keydown);
    document.removeEventListener('keyup', this.keyup);
    return Promise.resolve();
  }

  private readonly keydown = (event: KeyboardEvent) => {
    this.pressed.push(event.code);
    this.updateState();
  };

  private readonly keyup = (event: KeyboardEvent) => {
    this.pressed = this.pressed.filter((key) => key !== event.code);
    this.updateState();
  };

  private updateState() {
    this.x = 0;
    this.y = 0;

    if (['ArrowRight', 'KeyD'].some((key) => this.pressed.includes(key))) {
      this.x += 1;
    }

    if (['ArrowLeft', 'KeyA'].some((key) => this.pressed.includes(key))) {
      this.x -= 1;
    }

    if (['ArrowUp', 'KeyW'].some((key) => this.pressed.includes(key))) {
      this.y -= 1;
    }

    if (['ArrowDown', 'KeyS'].some((key) => this.pressed.includes(key))) {
      this.y += 1;
    }
  }
}
