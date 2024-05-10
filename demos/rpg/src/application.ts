import { Composer } from '@pixel-craft/composer';
import {
  RenderPass,
  Sprite,
  WebGPUContext,
  createContext,
  createTextureLoader,
  pipeline,
  sprite,
} from '@pixel-craft/renderer';
import { EntityStore } from '@pixel-craft/store';

type Entity = Sprite;

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

  const entityStore = new EntityStore<Entity>();
  const spriteQuery = entityStore.with('texture');

  const assertTimeState = <T extends object>(state: T): T & TimeState => ({
    ...state,
    now: 0,
    frameTime: 0,
    deltaTime: 0,
    lastFrame: 0,
  });

  const assertRendererState = <T extends object>(
    state: T,
  ): T & RendererState => ({
    ...state,
    renderPass: pipeline(context),
    context,
  });

  const state = new Composer({ foo: 'bar' }, assertTimeState)
    .next(assertRendererState)
    .execute();

  const timeSystem = (state: TimeState) => {
    state.frameTime = state.now - state.lastFrame;
    state.deltaTime = state.frameTime * 0.06;
    state.lastFrame = state.now;
  };

  const renderSystem = (state: RendererState) => {
    state.renderPass(spriteQuery);
  };

  const systems = [timeSystem, renderSystem];

  entityStore.add(
    sprite({
      texture,
      x: 15,
      y: 15,
    }),
  );

  const gameLoop = (now: number) => {
    state.now = now;
    systems.forEach((system) => system(state));

    requestAnimationFrame(gameLoop);
  };

  gameLoop(performance.now());
}
