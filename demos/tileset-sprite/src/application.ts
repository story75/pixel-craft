import {
  Rect,
  Sprite,
  Vec2,
  createTextureLoader,
  sprite,
} from '@pixel-craft/engine';
import {
  Animated,
  AnimatorSystem,
  Application,
  InputCameraSystem,
  InputSystem,
  RenderSystem,
  TimerSystem,
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

  const textureLoader = createTextureLoader(app.context.device);

  const [atlasFloor, atlasCharacters] = await Promise.all([
    textureLoader('assets/0x72_DungeonTilesetII_v1.7/atlas_floor-16x16.png'),
    textureLoader(
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
          width: tileSize,
          height: tileSize,
          frame: groundTileFrame,
        }),
      );
    }
  }

  const heroFrames: Rect[] = [];
  for (let i = 0; i < 4; i++) {
    heroFrames.push({
      x: (8 + i) * tileSize,
      y: 12 * tileSize,
      width: tileSize,
      height: tileSize * 2,
    });
  }

  const hero: Sprite & Animated = {
    ...sprite({
      texture: atlasCharacters,
      x: (tilesX / 2) * tileSize,
      y: (tilesY / 2) * tileSize,
      width: tileSize,
      height: tileSize * 2,
      frame: heroFrames[0],
    }),
    animationFrame: 0,
    animationSpeed: 5,
    animationTimer: 0,
    animationFrames: heroFrames,
  };
  app.addGameObjects(hero);
}
