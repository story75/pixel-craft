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
    this.findPossibleTransitions(sprite, animation);
    sprite.animation = animation;
    sprite.animationFrame = 0;
    sprite.animationTimer = 0;
    sprite.frame = sprite.animation.animationFrames[sprite.animationFrame];
  }

  private findPossibleTransitions(sprite: Animated, newAnimation: Animation) {
    sprite.possibleTransitions = sprite.transitions.filter((transition) => {
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
}
