/**
 * Define when a transition should be able to be triggered.
 */
export enum TransitionType {
  /**
   * The transition can only be triggered when the sprite is animated for the first time.
   *
   * @remarks
   * This is a special case for the first animation and should only be present once in the list of transitions.
   */
  Entry = 0,

  /**
   * The transition can be triggered at any time.
   */
  Any = 1,

  /**
   * The transition can only be triggered when the sprite in a specific animation.
   *
   * @remarks
   * The current animation must match the specified animation for the transition to be eligible.
   */
  Animation = 2,
}

type TransitionLink =
  | {
      type: TransitionType.Entry | TransitionType.Any;
    }
  | {
      type: TransitionType.Animation;
      animation: string;
    };

/**
 * Define a transition between two animations.
 */
export type Transition<T> = {
  /**
   * The source animation.
   */
  from: TransitionLink;

  /**
   * The target animation.
   */
  to: string;

  /**
   * The conditions to trigger the transition.
   *
   * @remarks
   * The state is the game object that is animated.
   */
  condition: (state: T) => boolean;
};
