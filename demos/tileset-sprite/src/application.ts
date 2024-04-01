import {
  Rect,
  Sprite,
  Vec2,
  createContext,
  createInput,
  createTextureLoader,
  createTimer,
  inputControlledCamera,
  pipeline,
  sprite,
} from '@pixel-craft/engine';
import Stats from 'stats.js';

export async function application(canvas: HTMLCanvasElement): Promise<void> {
  const stats = new Stats();
  document.body.appendChild(stats.dom);

  const context = await createContext(canvas);
  const scaling: Vec2.Vec2 = [4, 4];
  context.camera.zoom(scaling);

  const textureLoader = createTextureLoader(context.device);

  const [atlasFloor, atlasCharacters] = await Promise.all([
    textureLoader('assets/0x72_DungeonTilesetII_v1.7/atlas_floor-16x16.png'),
    textureLoader(
      'assets/0x72_DungeonTilesetII_v1.7/0x72_DungeonTilesetII_v1.7.png',
    ),
  ]);

  const tileSize = 16;

  const tilesX = Math.ceil(canvas.width / tileSize / scaling[0]);
  const tilesY = Math.ceil(canvas.height / tileSize / scaling[1]);

  const renderPass = pipeline(context);
  const sprites: Sprite[] = [];

  const groundTileFrame = {
    x: 0,
    y: 0,
    width: tileSize,
    height: tileSize,
  };

  for (let y = 0; y < tilesY; y++) {
    for (let x = 0; x < tilesX; x++) {
      sprites.push(
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

  const hero = sprite({
    texture: atlasCharacters,
    x: (tilesX / 2) * tileSize,
    y: (tilesX / 2 - 4) * tileSize,
    width: tileSize,
    height: tileSize * 2,
    frame: heroFrames[0],
  });
  sprites.push(hero);

  const input = createInput();
  const timer = createTimer();
  const camera = inputControlledCamera(input, timer, context.camera);

  let heroFrame = 0;
  const heroSpeed = 5;
  let heroTimer = 0;

  const draw = function (now: number) {
    timer.update(now);
    camera.update();
    stats.begin();

    hero.frame = heroFrames[heroFrame];
    heroTimer += timer.deltaTime;
    if (heroTimer > heroSpeed) {
      heroTimer = 0;
      heroFrame++;
    }

    if (heroFrame >= heroFrames.length) {
      heroFrame = 0;
    }

    renderPass(sprites);

    stats.end();
    requestAnimationFrame(draw);
  };

  draw(performance.now());
}
