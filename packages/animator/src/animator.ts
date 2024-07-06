import type { Sprite } from '@pixel-craft/renderer';
import type { Animated } from './animated';
import type { Animation } from './animation';
import { type Transition, TransitionType } from './transition';

/**
 * An animator system is responsible to change the frame of an animated sprite.
 */
export class Animator {
  static createAnimated<T>(options: Pick<Animated<T>, 'animations' | 'transitions'>): Animated<T> {
    const entryTransition = options.transitions.find((transition) => transition.from.type === TransitionType.Entry);
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
      possibleTransitions: Animator.findPossibleTransitions<T>(options.transitions, animation),
    };
  }

  static findPossibleTransitions<T>(transitions: Transition<T>[], newAnimation: Animation): Transition<T>[] {
    return transitions.filter((transition) => {
      if (transition.from.type === TransitionType.Any) {
        return transition.to !== newAnimation.name || newAnimation.interruptible;
      }
      return transition.from.type === TransitionType.Animation && transition.from.animation === newAnimation.name;
    });
  }

  update<T>(sprite: Pick<Sprite, 'frame'>, animated: Animated<T>, state: T, deltaTime: number): void {
    const transition = animated.possibleTransitions.find((transition) => transition.condition(state));

    if (transition) {
      const newAnimation = animated.animations[transition.to];
      this.animate(sprite, animated, newAnimation);
    }

    if (!animated.animation.loop && animated.animationFrame === animated.animation.animationFrames.length - 1) {
      return;
    }

    animated.animationTimer += deltaTime;
    if (animated.animationTimer <= animated.animation.speed) {
      return;
    }

    animated.animationTimer = 0;
    animated.animationFrame++;

    if (animated.animationFrame >= animated.animation.animationFrames.length) {
      animated.animation.onEnd?.();
      if (animated.animation.loop) {
        animated.animationFrame = 0;
      }
    }

    sprite.frame = animated.animation.animationFrames[animated.animationFrame];
    animated.animation.onFrame?.(animated.animationFrame);
  }

  animate<T>(sprite: Pick<Sprite, 'frame'>, animated: Animated<T>, animation: Animation): void {
    animated.possibleTransitions = Animator.findPossibleTransitions<T>(animated.transitions, animation);
    animated.animation = animation;
    animated.animationFrame = 0;
    animated.animationTimer = 0;
    sprite.frame = animated.animation.animationFrames[animated.animationFrame];
  }
}
