import {
  Sprite,
  createContext,
  createInput,
  createTextureLoader,
  createTimer,
  inputControlledCamera,
  pipeline,
  sprite,
} from '@story75/pixel-forge';
import Stats from 'stats.js';

export async function application(canvas: HTMLCanvasElement): Promise<void> {
  const stats = new Stats();
  document.body.appendChild(stats.dom);

  const context = await createContext(canvas);

  const textureLoader = createTextureLoader(context.device);

  const atlas = await textureLoader(
    'assets/0x72_DungeonTilesetII_v1.7/atlas_floor-16x16.png',
  );

  const tileSize = 16;

  const tilesX = Math.trunc(canvas.width / tileSize);
  const tilesY = Math.trunc(canvas.height / tileSize);

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
          texture: atlas,
          x: x * tileSize,
          y: y * tileSize,
          width: tileSize,
          height: tileSize,
          frame: groundTileFrame,
        }),
      );
    }
  }

  const input = createInput();
  const timer = createTimer();
  const camera = inputControlledCamera(input, timer, context);

  const draw = function (now: number) {
    timer.update(now);
    camera.update();
    stats.begin();

    renderPass(sprites);

    stats.end();
    requestAnimationFrame(draw);
  };

  draw(performance.now());
}
