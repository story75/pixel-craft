import {
  Sprite,
  createContext,
  createTextureLoader,
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
    'assets/generic-rpg-pack_v0.4_(alpha-release)_vacaroxa/rpg-pack/atlas.png',
  );

  const tileSize = 16;

  const tilesX = Math.trunc(canvas.width / tileSize);
  const tilesY = Math.trunc(canvas.height / tileSize);

  const renderPass = pipeline(context);
  const sprites: Sprite[] = [];

  const grassTileFrame = {
    x: tileSize * 1,
    y: tileSize * 19,
    width: tileSize,
    height: tileSize,
  };

  const groundTileFrame = {
    x: tileSize * 2,
    y: tileSize * 17,
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
          frame: Math.random() < 0.5 ? grassTileFrame : groundTileFrame,
        }),
      );
    }
  }

  let cameraX = 0;
  let cameraY = 0;

  document.addEventListener('keydown', (event) => {
    let x = 0;
    let y = 0;

    if (['ArrowRight', 'KeyD'].includes(event.code)) {
      x += 10;
    }

    if (['ArrowLeft', 'KeyA'].includes(event.code)) {
      x -= 10;
    }

    if (['ArrowUp', 'KeyW'].includes(event.code)) {
      y -= 10;
    }

    if (['ArrowDown', 'KeyS'].includes(event.code)) {
      y += 10;
    }

    cameraX += x;
    cameraY += y;

    context.observe([cameraX, cameraY]);
  });

  const draw = function () {
    stats.begin();

    renderPass(sprites);

    stats.end();
    requestAnimationFrame(draw);
  };

  draw();
}
