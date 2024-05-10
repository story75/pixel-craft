import { composed } from '@pixel-craft/composer';
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
  const atlas = await textureLoader(
    'assets/SERENE_VILLAGE_REVAMPED/Serene_Village_16x16.png',
  );

  const entityStore = new EntityStore<Entity>();
  const spriteQuery = entityStore.with('texture');

  const assertTimeState = (): TimeState => ({
    now: 0,
    frameTime: 0,
    deltaTime: 0,
    lastFrame: 0,
  });

  const assertRendererState = (): RendererState => ({
    renderPass: pipeline(context),
    context,
  });

  const state = composed([assertTimeState(), assertRendererState()]);

  const timeSystem = (state: TimeState) => {
    state.frameTime = state.now - state.lastFrame;
    state.deltaTime = state.frameTime * 0.06;
    state.lastFrame = state.now;
  };

  const renderSystem = (state: RendererState) => {
    state.renderPass(spriteQuery);
  };

  const systems = [timeSystem, renderSystem];

  const scaling = { x: 4, y: 4 };
  context.camera.zoom(scaling);
  const tileSize = 16;

  const tilesX = Math.ceil(canvas.width / tileSize / scaling.x);
  const tilesY = Math.ceil(canvas.height / tileSize / scaling.y);

  for (let y = 0; y < tilesY; y++) {
    for (let x = 0; x < tilesX; x++) {
      entityStore.add(
        sprite({
          texture: atlas,
          x: x * tileSize,
          y: y * tileSize,
          frame: {
            x: 4 * tileSize,
            y: 0,
            height: tileSize,
            width: tileSize,
          },
        }),
      );
    }
  }

  const gameLoop = (now: number) => {
    state.now = now;
    systems.forEach((system) => system(state));

    requestAnimationFrame(gameLoop);
  };

  gameLoop(performance.now());
}
