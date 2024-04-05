import { Rect, Sprite } from '@pixel-craft/engine';
import { System } from './system';
import { TimerSystem } from './timer';

export type Animated = {
  /**
   * The current frame of the animation.
   */
  animationFrame: number;

  /**
   * The speed of the animation.
   *
   * @remarks
   * The speed is defined in frames per second e.g. 5 means the animation will change every 5 frames.
   */
  animationSpeed: number;

  /**
   * The amount of accumulated time since the last frame change.
   */
  animationTimer: number;

  /**
   * The frames of the animation.
   */
  animationFrames: Rect[];
};

/**
 * An animator system is responsible to change the frame of an animated sprite.
 */
export class AnimatorSystem implements System {
  private readonly sprites: Array<Sprite & Animated> = [];

  constructor(private readonly timer: TimerSystem) {}

  addGameObject(sprite: unknown): void {
    if (sprite && typeof sprite === 'object' && 'animationFrames' in sprite) {
      this.sprites.push(sprite as Sprite & Animated);
    }
  }

  removeGameObject(sprite: unknown): void {
    const index = this.sprites.indexOf(sprite as Sprite & Animated);
    if (index !== -1) {
      this.sprites.splice(index, 1);
    }
  }

  update(): void {
    for (const sprite of this.sprites) {
      sprite.frame = sprite.animationFrames[sprite.animationFrame];
      sprite.animationTimer += this.timer.deltaTime;
      if (sprite.animationTimer > sprite.animationSpeed) {
        sprite.animationTimer = 0;
        sprite.animationFrame++;
      }

      if (sprite.animationFrame >= sprite.animationFrames.length) {
        sprite.animationFrame = 0;
      }
    }
  }
}
