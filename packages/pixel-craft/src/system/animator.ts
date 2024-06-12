import { Animated, Animation, Animator, Transition } from '@pixel-craft/animator';
import { Sprite } from '@pixel-craft/renderer';
import { System } from './system';
import { TimerSystem } from './timer';

/**
 * An animator system is responsible to change the frame of an animated sprite.
 */
export class AnimatorSystem implements System {
  private readonly sprites: (Sprite & Animated)[] = [];

  constructor(
    private readonly timer: TimerSystem,
    private readonly animator: Animator = new Animator(),
  ) {}

  static createAnimated<T>(options: Pick<Animated<T>, 'animations' | 'transitions'>): Animated<T> {
    return Animator.createAnimated<T>(options);
  }

  static findPossibleTransitions<T>(transitions: Transition<T>[], newAnimation: Animation): Transition<T>[] {
    return Animator.findPossibleTransitions<T>(transitions, newAnimation);
  }

  addGameObject(sprite: unknown): void {
    if (sprite && typeof sprite === 'object' && 'animations' in sprite) {
      const animatedSprite = sprite as Sprite & Animated;
      this.sprites.push(animatedSprite);
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
      this.animator.update(sprite, sprite, sprite, this.timer.deltaTime);
    }
  }

  animate(sprite: Sprite & Animated, animation: Animation): void {
    this.animator.animate(sprite, sprite, animation);
  }
}
