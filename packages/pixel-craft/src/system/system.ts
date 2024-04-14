import type { WebGPUContext } from '@pixel-craft/engine';
import type { Application } from '../application';

export type CreateHookContext = {
  application: Application;
  canvas: HTMLCanvasElement;
  context: WebGPUContext;
};

/**
 * A system is a collection of hooks that can be added to the application.
 *
 * @remarks
 * Hooks are called during the application lifecycle and can be used to add custom logic.
 * Systems can be used to add custom rendering, physics, or other logic to the application.
 *
 * Every hook is optional, and you can implement only the hooks you need.
 */
export type System = {
  /**
   * Called when the system is created.
   *
   * @remarks
   * A system is created when it is added to the application. All your bootstrapping logic should go here.
   * After a system is created, it is added to the application and its hooks are added to the application lifecycle.
   *
   * You receive a reference to the canvas and the WebGPU context, which are global and shared across all systems.
   *
   * Hooks will automatically bind to the system instance, so you don't need to worry about the `this` context.
   */
  createSystem?: (input: CreateHookContext) => Promise<void>;

  /**
   * Called when the system is destroyed.
   *
   * @remarks
   * A system is destroyed when it is removed from the application. All your cleanup logic should go here.
   * Before a system is destroyed, its hooks are removed from the application lifecycle.
   */
  destroySystem?: () => Promise<void>;

  /**
   * Called when a game object is added to the application.
   *
   * @remarks
   * This hook should be used to determine if the system should handle the game object.
   * If the system should handle the game object, it should add the game object to its internal state for processing.
   * If the system is not interested in the game object, it should return early.
   */
  addGameObject?: (gameObject: Record<string, unknown>) => void;

  /**
   * Called when a game object is removed from the application.
   *
   * @remarks
   * This hook should remove the game object from the system's internal state to stop processing it.
   */
  removeGameObject?: (gameObject: Record<string, unknown>) => void;

  /**
   * Called when game objects are updated.
   *
   * @remarks
   * This hook should be used to update the tracked game objects.
   * This is where you should update the game objects' positions, velocities, etc.
   * This hook is called every frame before the postUpdate hook.
   *
   * @param now - The current time as reported by performance.now()
   */
  update?: (now: number) => void;

  /**
   * Called after all game objects are updated.
   *
   * @remarks
   * This hook should be used to perform any post-update logic.
   * This is where you should perform collision detection, rendering, etc.
   * This hook is called every frame after all update hooks are called.
   */
  postUpdate?: () => void;
};
