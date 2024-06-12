import { Animation } from './animation';
import { Transition } from './transition';

/**
 * Defines a game object that is animated.
 */
export type Animated<T = unknown> = {
  /**
   * The current frame of the current animation.
   */
  animationFrame: number;

  /**
   * The current animation of the game object.
   */
  animation: Animation;

  /**
   * The amount of accumulated time since the last frame change.
   */
  animationTimer: number;

  /**
   * The animations of the game object.
   */
  animations: Record<string, Animation>;

  /**
   * The transitions of the animations.
   *
   * @remarks
   * The transitions are evaluated in the order they are defined.
   * Only the entry transition is special and takes precedence over all other transitions.
   */
  transitions: Transition<T>[];

  /**
   * The possible transitions for the current animation.
   *
   * @remarks
   * This is used as a cache to avoid recalculating the all transitions every frame, but just the possible ones.
   */
  possibleTransitions: Transition<T>[];
};
