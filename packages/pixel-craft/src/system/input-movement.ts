import { Sprite } from '@pixel-craft/engine';
import { Vector2 } from '@pixel-craft/math';
import { InputSystem } from './input';
import { System } from './system';
import { TimerSystem } from './timer';

export type Moveable = {
  velocity: Vector2;
  movementSpeed: number;
};

/**
 * An input camera system is responsible to move the camera based on the input.
 */
export class InputMovementSystem implements System {
  private readonly moveables: Array<Sprite & Moveable> = [];

  constructor(
    private readonly input: InputSystem,
    private readonly timer: TimerSystem,
  ) {}

  addGameObject(sprite: Record<string, unknown>): void {
    if ('velocity' in sprite && 'texture' in sprite) {
      const moveable = sprite as Sprite & Moveable;
      this.moveables.push(moveable);
    }
  }

  update(): void {
    for (const moveable of this.moveables) {
      const velocity = new Vector2(this.input)
        .normal()
        .multiply(moveable.movementSpeed * this.timer.deltaTime);
      moveable.velocity = velocity;
      moveable.x += velocity.x;
      moveable.y += velocity.y;
    }
  }
}
