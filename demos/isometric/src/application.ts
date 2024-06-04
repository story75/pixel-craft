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
    textureLoader('assets/scrabling-isometric-tileset/spritesheet.png'),
    textureLoader('assets/Small-8-Direction-Characters_by_AxulArt/Small-8-Direction-Characters_by_AxulArt.png'),
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
  const tileSize = 32;

  const tilesX = 15;
  const tilesY = 15;

  for (let y = 0; y < tilesY; y++) {
    for (let x = 0; x < tilesX; x++) {
      entityStore.add(
        sprite({
          texture: atlas,
          x: tileSize * 7 + ((x * tileSize) / 2 + (y * -tileSize) / 2),
          y: (x * tileSize) / 4 + (y * tileSize) / 4,
          frame: {
            x: tileSize * 6,
            y: tileSize * 5,
            height: tileSize,
            width: tileSize,
          },
        }),
      );
    }
  }

  const directions = [
    'north',
    'north-west',
    'west',
    'south-west',
    'south',
    'south-east',
    'east',
    'north-east',
  ] as const;

  const character = spriteParser(
    {
      frameWidth: 16,
      frameHeight: 24,
      x: 0,
      y: 0,
      z: 0.002,
      atlas: atlasCharacters,
      animations: directions.flatMap((direction) => [
        {
          name: `idle-${direction}`,
          row: 0,
          frames: 1,
          speed: 5,
          interruptible: false,
          loop: false,
        },
        {
          name: direction,
          row: 0,
          frames: 1,
          speed: 5,
          interruptible: false,
          loop: true,
        },
      ]),
      transitions: [
        {
          from: { type: TransitionType.Entry },
          to: 'idle-north',
          condition: () => true,
        },
        {
          from: { type: TransitionType.Any },
          to: 'north',
          condition: (state) => state.velocity.x === 0 && state.velocity.y < 0,
        },
        {
          from: { type: TransitionType.Any },
          to: 'north-west',
          condition: (state) => state.velocity.x > 0 && state.velocity.y < 0,
        },
        {
          from: { type: TransitionType.Any },
          to: 'west',
          condition: (state) => state.velocity.x > 0 && state.velocity.y === 0,
        },
        {
          from: { type: TransitionType.Any },
          to: 'south-west',
          condition: (state) => state.velocity.x > 0 && state.velocity.y > 0,
        },
        {
          from: { type: TransitionType.Any },
          to: 'south',
          condition: (state) => state.velocity.x === 0 && state.velocity.y > 0,
        },
        {
          from: { type: TransitionType.Any },
          to: 'south-east',
          condition: (state) => state.velocity.x < 0 && state.velocity.y > 0,
        },
        {
          from: { type: TransitionType.Any },
          to: 'east',
          condition: (state) => state.velocity.x < 0 && state.velocity.y === 0,
        },
        {
          from: { type: TransitionType.Any },
          to: 'north-east',
          condition: (state) => state.velocity.x < 0 && state.velocity.y < 0,
        },
      ],
    },
    {
      velocity: new Vector2({ x: 0, y: 0 }),
      movementSpeed: 1,
    },
  );

  for (const direction of directions) {
    const index = directions.indexOf(direction);
    character.animations[`idle-${direction}`].animationFrames = [{ x: index * 16, y: 10 * 24, width: 16, height: 24 }];

    character.animations[direction].animationFrames = [
      { x: index * 16, y: 9 * 24, width: 16, height: 24 },
      { x: index * 16, y: 10 * 24, width: 16, height: 24 },
      { x: index * 16, y: 11 * 24, width: 16, height: 24 },
    ];
  }

  character.frame = character.animation.animationFrames[0];

  entityStore.add(character);

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

  const characterSystem = (state: TimeState) => {
    const velocity = new Vector2(input).normal().multiply(character.movementSpeed * state.deltaTime);
    character.velocity = velocity;
    character.x += velocity.x;
    character.y += velocity.y;

    animator.update(character, character, character, state.deltaTime);
  };

  const systems = [timeSystem, characterSystem, renderSystem];

  const gameLoop = (now: number) => {
    state.now = now;
    systems.forEach((system) => system(state));

    requestAnimationFrame(gameLoop);
  };

  gameLoop(performance.now());
}
