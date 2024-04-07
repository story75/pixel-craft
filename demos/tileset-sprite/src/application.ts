import { Sprite, sprite, Vec2 } from '@pixel-craft/engine';
import {
  Animated,
  animatedSpriteSheet,
  AnimatorSystem,
  Application,
  InputCameraSystem,
  InputSystem,
  RenderSystem,
  TimerSystem,
  TransitionType,
} from '@pixel-craft/pixel-craft';

export async function application(canvas: HTMLCanvasElement): Promise<void> {
  const app = await Application.create(canvas);
  const renderer = new RenderSystem();
  const input = new InputSystem();
  const timer = new TimerSystem();
  const camera = new InputCameraSystem(input, timer);
  const animator = new AnimatorSystem(timer);
  await app.addSystems(renderer, input, timer, camera, animator);

  const scaling: Vec2.Vec2 = [4, 4];
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

  const dinoSpriteSheet = animatedSpriteSheet({
    frameWidth: tileSize,
    frameHeight: tileSize * 2,
    width: atlasCharacters.width,
    height: atlasCharacters.height,
    animations: [
      {
        name: 'idle',
        row: 6,
        frames: 4,
        startFrame: 8,
      },
      {
        name: 'run',
        row: 6,
        frames: 4,
        startFrame: 12,
      },
      {
        name: 'hit',
        row: 6,
        frames: 1,
        startFrame: 16,
      },
    ],
  });

  const animation = {
    name: 'idle',
    interruptible: true,
    loop: true,
    speed: 5,
    animationFrames: dinoSpriteSheet['idle'],
  };

  const dino: Sprite & Animated = {
    ...sprite({
      texture: atlasCharacters,
      x: (tilesX / 2) * tileSize,
      y: (tilesY / 2) * tileSize,
      frame: animation.animationFrames[0],
    }),
    ...AnimatorSystem.createAnimated({
      animations: {
        [animation.name]: animation,
      },
      transitions: [
        {
          from: { type: TransitionType.Entry },
          to: animation.name,
          condition: () => true,
        },
      ],
    }),
  };
  app.addGameObjects(dino);
}
