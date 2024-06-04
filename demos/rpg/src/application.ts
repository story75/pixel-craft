import { Animated, Animator, TransitionType } from '@pixel-craft/animator';
import { composed } from '@pixel-craft/composer';
import { Vector2 } from '@pixel-craft/math';
import { InputSystem } from '@pixel-craft/pixel-craft';
import {
  RenderPass,
  Sprite,
  WebGPUContext,
  createContext,
  createTextureLoader,
  pipeline,
  sprite,
} from '@pixel-craft/renderer';
import { spriteParser } from '@pixel-craft/spritesheet';
import { EntityStore } from '@pixel-craft/store';

type Moveable = {
  velocity: Vector2;
  movementSpeed: number;
};

type Entity = Sprite & Partial<Animated<Sprite & Moveable>>;

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
  const [atlas, atlasCharacters] = await Promise.all([
    textureLoader('assets/0x72_DungeonTilesetII_v1.7/atlas_floor-16x16.png'),
    textureLoader('assets/0x72_DungeonTilesetII_v1.7/0x72_DungeonTilesetII_v1.7.png'),
  ]);

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

  const scaling = { x: 4, y: 4 };
  context.camera.zoom(scaling);
  const tileSize = 16;

  const tilesX = 50;
  const tilesY = 50;

  for (let y = 0; y < tilesY; y++) {
    for (let x = 0; x < tilesX; x++) {
      entityStore.add(
        sprite({
          texture: atlas,
          x: x * tileSize,
          y: y * tileSize,
          frame: {
            x: 0,
            y: 0,
            height: tileSize,
            width: tileSize,
          },
        }),
      );
    }
  }

  const dino = spriteParser(
    {
      frameWidth: tileSize,
      frameHeight: tileSize * 2,
      x: 0,
      y: 0,
      z: 0.002,
      atlas: atlasCharacters,
      animations: [
        {
          name: 'idle',
          row: 6,
          frames: 4,
          startFrame: 8,
          speed: 5,
          interruptible: false,
          loop: true,
        },
        {
          name: 'run',
          row: 6,
          frames: 4,
          startFrame: 12,
          speed: 5,
          interruptible: false,
          loop: true,
        },
        {
          name: 'hit',
          row: 6,
          frames: 1,
          startFrame: 16,
          speed: 5,
          interruptible: true,
          loop: true,
        },
      ],
      transitions: [
        {
          from: { type: TransitionType.Entry },
          to: 'idle',
          condition: () => true,
        },
        {
          from: { type: TransitionType.Any },
          to: 'idle',
          condition: (state) => state.velocity.length() === 0,
        },
        {
          from: { type: TransitionType.Any },
          to: 'run',
          condition: (state) => state.velocity.length() !== 0,
        },
      ],
    },
    {
      velocity: new Vector2({ x: 0, y: 0 }),
      movementSpeed: 1,
    },
  );

  entityStore.add(dino);

  const input = new InputSystem();
  await input.createSystem();

  const animator = new Animator();

  const timeSystem = (state: TimeState) => {
    state.frameTime = state.now - state.lastFrame;
    state.deltaTime = state.frameTime * 0.06;
    state.lastFrame = state.now;
  };

  const renderSystem = (state: RendererState) => {
    state.renderPass(spriteQuery);
  };

  const dinoSystem = (state: TimeState) => {
    const velocity = new Vector2(input).normal().multiply(dino.movementSpeed * state.deltaTime);
    dino.velocity = velocity;
    dino.x += velocity.x;
    dino.y += velocity.y;

    if (dino.velocity.x !== 0) {
      dino.flip[0] = dino.velocity.x < 0;
    }

    animator.update(dino, dino, dino, state.deltaTime);
  };

  const systems = [timeSystem, dinoSystem, renderSystem];

  const gameLoop = (now: number) => {
    state.now = now;
    systems.forEach((system) => system(state));

    requestAnimationFrame(gameLoop);
  };

  gameLoop(performance.now());
}
