import { Sprite, sprite } from '@pixel-craft/engine';
import {
  AnimatorSystem,
  Application,
  // InputCameraSystem,
  InputSystem,
  RenderSystem,
  System,
  TimerSystem,
  TransitionType,
  spriteParser,
} from '@pixel-craft/pixel-craft';

type Moveable = {
  velocity: [number, number];
  movementSpeed: number;
};

export async function application(canvas: HTMLCanvasElement): Promise<void> {
  const app = await Application.create(canvas);
  const renderer = new RenderSystem();
  const input = new InputSystem();
  const timer = new TimerSystem();
  // const camera = new InputCameraSystem(input, timer);
  const animator = new AnimatorSystem(timer);
  const movement = new (class implements System {
    private readonly moveables: Array<Sprite & Moveable> = [];

    addGameObject(sprite: Record<string, unknown>) {
      if ('velocity' in sprite && 'texture' in sprite) {
        const moveable = sprite as Sprite & Moveable;
        this.moveables.push(moveable);
      }
    }

    update() {
      for (const moveable of this.moveables) {
        const velocity: [number, number] = [input.x, input.y];
        moveable.velocity = velocity;
        moveable.x += velocity[0] * moveable.movementSpeed * timer.deltaTime;
        moveable.y += velocity[1] * moveable.movementSpeed * timer.deltaTime;
      }
    }
  })();
  await app.addSystems(renderer, input, timer, movement, animator);

  const scaling: [number, number] = [4, 4];
  app.context.camera.zoom(scaling);

  const [atlasFloor, atlasCharacters] = await Promise.all([
    app.loadTexture('assets/0x72_DungeonTilesetII_v1.7/atlas_floor-16x16.png'),
    app.loadTexture(
      'assets/0x72_DungeonTilesetII_v1.7/0x72_DungeonTilesetII_v1.7.png',
    ),
  ]);

  const tileSize = 16;

  const tilesX = Math.ceil(canvas.width / tileSize / scaling[0]);
  const tilesY = Math.ceil(canvas.height / tileSize / scaling[1]);

  const groundTileFrame = {
    x: 0,
    y: 0,
    width: tileSize,
    height: tileSize,
  };

  for (let y = 0; y < tilesY; y++) {
    for (let x = 0; x < tilesX; x++) {
      app.addGameObjects(
        sprite({
          texture: atlasFloor,
          x: x * tileSize,
          y: y * tileSize,
          frame: groundTileFrame,
        }),
      );
    }
  }

  const dino = spriteParser(
    {
      frameWidth: tileSize,
      frameHeight: tileSize * 2,
      x: (tilesX / 2) * tileSize,
      y: (tilesY / 2) * tileSize,
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
          condition: (state) =>
            state.velocity[0] === 0 && state.velocity[1] === 0,
        },
        {
          from: { type: TransitionType.Any },
          to: 'run',
          condition: (state) =>
            state.velocity[0] !== 0 || state.velocity[1] !== 0,
        },
      ],
    },
    {
      velocity: [0, 0],
      movementSpeed: 1,
    } as Moveable,
  );
  app.addGameObjects(dino);
}
