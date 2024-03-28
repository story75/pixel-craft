export type Input = {
  /**
   * The x input
   *
   * @remarks
   * If a horizontal direction key is pressed, the value corresponds to the direction.
   * A positive value means right, and a negative value means left.
   * If no horizontal direction key is pressed, the value is 0.
   *
   * @default 0
   */
  x: number;

  /**
   * The y input
   *
   * @remarks
   * If a vertical direction key is pressed, the value corresponds to the direction.
   * A positive value means down, and a negative value means up.
   * If no vertical direction key is pressed, the value is 0.
   *
   * @default 0
   */
  y: number;

  /**
   * The keys that are currently pressed
   *
   * @remarks
   * The keys are stored as an array of strings.
   * The strings are the key codes of the keys that are currently pressed.
   *
   * @default []
   */
  pressed: string[];
};

export function createInput(): Input {
  const state: Input = {
    x: 0,
    y: 0,
    pressed: [],
  };

  const update = () => {
    state.x = 0;
    state.y = 0;

    if (['ArrowRight', 'KeyD'].some((key) => state.pressed.includes(key))) {
      state.x += 1;
    }

    if (['ArrowLeft', 'KeyA'].some((key) => state.pressed.includes(key))) {
      state.x -= 1;
    }

    if (['ArrowUp', 'KeyW'].some((key) => state.pressed.includes(key))) {
      state.y -= 1;
    }

    if (['ArrowDown', 'KeyS'].some((key) => state.pressed.includes(key))) {
      state.y += 1;
    }
  };

  document.addEventListener('keydown', (event) => {
    state.pressed.push(event.code);
    update();
  });

  document.addEventListener('keyup', (event) => {
    state.pressed = state.pressed.filter((key) => key !== event.code);
    update();
  });

  return state;
}
