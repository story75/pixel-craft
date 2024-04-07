import { Sprite } from '@pixel-craft/engine';
import { System } from '../system';
import { TimerSystem } from '../timer';
import { Animated } from './animated';
import { Animation } from './animation';
import { TransitionType } from './transition';

/**
 * An animator system is responsible to change the frame of an animated sprite.
 */
export class AnimatorSystem implements System {
  private readonly sprites: Array<Sprite & Animated> = [];

  constructor(private readonly timer: TimerSystem) {}

  static createAnimated(
    options: Pick<Animated, 'animations' | 'transitions'>,
  ): Animated {
    const entryTransition = options.transitions.find(
      (transition) => transition.from.type === TransitionType.Entry,
    );
    if (!entryTransition) {
      throw new Error('No entry transition found!');
    }
    const animation = options.animations[entryTransition.to];

    return {
      animationFrame: 0,
      animationTimer: 0,
      animation,
      animations: options.animations,
      transitions: options.transitions,
      possibleTransitions: AnimatorSystem.findPossibleTransitions(
        options.transitions,
        animation,
      ),
    };
  }

  static findPossibleTransitions(
    transitions: Animated['transitions'],
    newAnimation: Animation,
  ): Animated['transitions'] {
    return transitions.filter((transition) => {
      if (transition.from.type === TransitionType.Any) {
        return (
          transition.to !== newAnimation.name || newAnimation.interruptible
        );
      }
      return (
        transition.from.type === TransitionType.Animation &&
        transition.from.animation === newAnimation.name
      );
    });
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
      const transition = sprite.possibleTransitions.find((transition) =>
        transition.condition(sprite),
      );

      if (transition) {
        const newAnimation = sprite.animations[transition.to];
        this.animate(sprite, newAnimation);
      }

      if (
        !sprite.animation.loop &&
        sprite.animationFrame >= sprite.animation.animationFrames.length
      ) {
        continue;
      }

      sprite.animationTimer += this.timer.deltaTime;
      if (sprite.animationTimer > sprite.animation.speed) {
        sprite.animationTimer = 0;
        sprite.animationFrame++;

        if (sprite.animationFrame >= sprite.animation.animationFrames.length) {
          sprite.animation.onEnd?.();
          if (sprite.animation.loop) {
            sprite.animationFrame = 0;
          }
        }

        sprite.frame = sprite.animation.animationFrames[sprite.animationFrame];
        sprite.animation.onFrame?.(sprite.animationFrame);
      }
    }
  }

  animate(sprite: Sprite & Animated, animation: Animation): void {
    sprite.possibleTransitions = AnimatorSystem.findPossibleTransitions(
      sprite.transitions,
      animation,
    );
    sprite.animation = animation;
    sprite.animationFrame = 0;
    sprite.animationTimer = 0;
    sprite.frame = sprite.animation.animationFrames[sprite.animationFrame];
  }
}
