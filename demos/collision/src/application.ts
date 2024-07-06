import { rectRect } from '@pixel-craft/collision';
import { Composer } from '@pixel-craft/composer';
import { InputManager } from '@pixel-craft/input';
import { Vector2 } from '@pixel-craft/math';
import { type PhysicsBody, collide } from '@pixel-craft/physics';
import {
  type RenderPass,
  type Sprite,
  type WebGPUContext,
  createContext,
  createTextureLoader,
  pipeline,
  sprite,
} from '@pixel-craft/renderer';
import { EntityStore, SpatialHashGrid } from '@pixel-craft/store';

type Entity = Sprite & PhysicsBody;

type TimeState = {
  now: number;
  frameTime: number;
  deltaTime: number;
  lastFrame: number;
};
type RendererState = { renderPass: RenderPass; context: WebGPUContext };

export async function application(canvas: HTMLCanvasElement): Promise<void> {
  const context = await createContext(canvas);
  const textureLoader = createTextureLoader(context.device);
  const texture = await textureLoader('assets/pixel-craft/pixel-prowlers.png');

  const input = new InputManager();

  const spatialHashGrid = new SpatialHashGrid<Entity>();
  const entityStore = new EntityStore<Entity>();
  const spriteQuery = entityStore.with('texture');

  spriteQuery.onAdd.subscribe((entity) => {
    spatialHashGrid.add(entity.x, entity.y, entity.width, entity.height, entity);
  });

  const assertTimeState = <T extends object>(state: T): T & TimeState => ({
    ...state,
    now: 0,
    frameTime: 0,
    deltaTime: 0,
    lastFrame: 0,
  });

  const assertRendererState = <T extends object>(state: T): T & RendererState => ({
    ...state,
    renderPass: pipeline(context),
    context,
  });

  const state = new Composer({ foo: 'bar' }, assertTimeState).next(assertRendererState).execute();

  const timeSystem = (state: TimeState) => {
    state.frameTime = state.now - state.lastFrame;
    state.deltaTime = state.frameTime * 0.06;
    state.lastFrame = state.now;
  };

  const renderSystem = (state: RendererState) => {
    state.renderPass(spriteQuery);
  };

  const player = entityStore.add({
    ...sprite({
      texture,
      x: 15,
      y: 15,
    }),
    velocity: new Vector2({ x: 0, y: 0 }),
    mass: 1,
    elasticity: 1,
    static: false,
  });
  entityStore.add({
    ...sprite({
      texture,
      x: 200,
      y: 200,
      color: [1, 0, 0],
    }),
    velocity: new Vector2({ x: 0, y: 0 }),
    mass: 1,
    elasticity: 1,
    static: true,
  });
  entityStore.add({
    ...sprite({
      texture,
      x: 300,
      y: 100,
      color: [0, 1, 0],
    }),
    velocity: new Vector2({ x: 0, y: 0 }),
    mass: 1,
    elasticity: 1,
    static: false,
  });
  entityStore.add({
    ...sprite({
      texture,
      x: 300,
      y: 200,
      color: [0, 1, 0],
    }),
    velocity: new Vector2({ x: 0, y: 0 }),
    mass: 1,
    elasticity: 1,
    static: false,
  });
  entityStore.add({
    ...sprite({
      texture,
      x: 300,
      y: 300,
      color: [0, 1, 0],
    }),
    velocity: new Vector2({ x: 0, y: 0 }),
    mass: 1,
    elasticity: 1,
    static: false,
  });

  const systems = [
    timeSystem,
    () => {
      for (const sprite of spriteQuery) {
        spatialHashGrid.update(sprite.x, sprite.y, sprite.width, sprite.height, sprite);
      }

      for (const entities of spatialHashGrid) {
        const length = entities.length;
        if (length < 2) {
          return;
        }
        for (let i = 0; i < length; i++) {
          for (let j = i + 1; j < length; j++) {
            const a = entities[i];
            const b = entities[j];
            const colliding = rectRect(a, b);
            // if (colliding) {
            //     a.color = [0, 0, 1];
            //     b.color = [0, 0, 1];
            // }
            if (colliding) {
              collide(a, b);
            }
          }
        }
      }
    },
    () => {
      player.velocity = player.velocity.add(input.direction);
      if (player.velocity.length() > 5) {
        player.velocity = player.velocity.normal().multiply(5);
      }
    },
    () => {
      for (const sprite of spriteQuery) {
        sprite.x += sprite.velocity.x;
        sprite.y += sprite.velocity.y;
        sprite.velocity = sprite.velocity.multiply(0.9);
      }
    },
    renderSystem,
  ];

  const gameLoop = (now: number) => {
    state.now = now;
    for (const system of systems) {
      system(state);
    }

    requestAnimationFrame(gameLoop);
  };

  gameLoop(performance.now());
}
