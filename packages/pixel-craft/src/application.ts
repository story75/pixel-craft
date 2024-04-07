import {
  createContext,
  createTextureLoader,
  TextureLoader,
  WebGPUContext,
} from '@pixel-craft/engine';
import { CreateHookContext, System } from './system/system';

type HookList = keyof Required<Omit<System, 'createSystem'>>;

type Hooks = {
  [hook in HookList]: Array<NonNullable<System[hook]>>;
};

/**
 * An application is the core of your game. It manages the game loop and the systems.
 *
 * @remarks
 * The application is the main entry point for the engine.
 * It's intended to be as lightweight as possible and all logic should be implemented in systems.
 *
 * The main idea is to have a list of systems that are executed in a specific order to enable a modular and flexible architecture.
 * By omitting the logic from the application and putting it into systems, you can easily add or remove features by adding or removing systems.
 * This in turn makes it easier to test and maintain your code, because you have smaller chunks of logic that are easier to understand.
 *
 * The engine provides some systems out of the box, like the `RenderSystem` which you can use or replace with your own implementation.
 */
export class Application {
  private readonly systems: System[] = [];
  private readonly hooks: Hooks = {
    destroySystem: [],
    addGameObject: [],
    removeGameObject: [],
    postUpdate: [],
    update: [],
  };

  private readonly createHookContext: CreateHookContext;

  /**
   * You should only create an application using the static `create` method.
   * For testing purposes you can create an application using the constructor.
   */
  constructor(
    public readonly canvas: HTMLCanvasElement,
    public readonly context: WebGPUContext,
    private readonly textureLoader: TextureLoader,
    scheduler = requestAnimationFrame,
  ) {
    this.createHookContext = {
      application: this,
      canvas,
      context,
    };

    const updateLoop = (now: number) => {
      this.hooks.update.forEach((hook) => hook(now));
      this.hooks.postUpdate.forEach((hook) => hook());
      scheduler(updateLoop);
    };

    updateLoop(performance.now());
  }

  /**
   * Creates a new application with the given canvas.
   *
   * @remarks
   * This is how you should create an application, because the canvas and context are created asynchronously.
   */
  static async create(canvas: HTMLCanvasElement): Promise<Application> {
    const context = await createContext(canvas);
    const textureLoader = createTextureLoader(context.device);

    return new Application(canvas, context, textureLoader);
  }

  /**
   * Adds systems to the application.
   *
   * @remarks
   * The system will be added to the list of systems, and it's createSystem hook will be called.
   * Afterward, all hooks that the system implements will be added to the corresponding hook list.
   *
   * All systems are executed in the order they are added.
   * A system can be added any time, even after the application has started.
   * Systems cannot be added multiple times and will be silently ignored if added multiple times.
   */
  async addSystems(...systems: System[]): Promise<void> {
    for (const system of systems) {
      if (this.systems.includes(system)) {
        return;
      }

      this.systems.push(system);
      if (system.createSystem) {
        await system.createSystem(this.createHookContext);
      }
      const hooks = Object.keys(this.hooks) as HookList[];
      for (const hook of hooks) {
        if (system[hook]) {
          // Typescript can not correctly infer that we only assign valid combinations of hooks,
          // thus we cast to any to avoid the type hassle
          // eslint-disable-next-line
          system[hook] = system[hook]!.bind(system) as any;
          // eslint-disable-next-line
          this.hooks[hook].push(system[hook] as any);
        }
      }
    }
  }

  /**
   * Removes systems from the application.
   *
   * @remarks
   * When a system is removed, all hooks that the system implements will be removed from the corresponding hook list.
   * Afterward, the system will be removed from the list of systems, and it's destroySystem hook will be called.
   *
   * If the system is not in the list of systems, it will be silently ignored.
   */
  async removeSystems(systems: System[]): Promise<void> {
    for (const system of systems) {
      const index = this.systems.indexOf(system);
      if (index === -1) {
        return;
      }

      const hooks = Object.keys(this.hooks) as HookList[];
      for (const hook of hooks) {
        if (system[hook]) {
          // Typescript can not correctly infer that we only check valid combinations of hooks,
          // thus we cast to any to avoid the type hassle
          // eslint-disable-next-line
          const hookIndex = this.hooks[hook].indexOf(system[hook] as any);
          if (hookIndex !== -1) {
            this.hooks[hook].splice(hookIndex, 1);
          }
        }

        this.systems.splice(index, 1);
        if (system.destroySystem) {
          await system.destroySystem();
        }
      }
    }
  }

  /**
   * Adds game objects to the application.
   *
   * @remarks
   * This will call the addGameObject hook of all systems.
   * The game object can be any type of object, and it's up to the systems to decide how to handle it.
   */
  addGameObjects(...gameObjects: unknown[]): void {
    for (const gameObject of gameObjects) {
      for (const hook of this.hooks.addGameObject) {
        hook(gameObject);
      }
    }
  }

  /**
   * Remove game objects from the application.
   *
   * @remarks
   * This will call the removeGameObject hook of all systems.
   * The game object can be any type of object, and it's up to the systems to decide how to handle it.
   */
  removeGameObjects(...gameObjects: unknown[]): void {
    for (const gameObject of gameObjects) {
      for (const hook of this.hooks.removeGameObject) {
        hook(gameObject);
      }
    }
  }

  /**
   * Load a texture by path.
   *
   * @see TextureLoader
   */
  loadTexture(path: string): Promise<GPUTexture> {
    return this.textureLoader(path);
  }
}
