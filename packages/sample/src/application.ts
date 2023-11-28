import {
  Sprite,
  createContext,
  createTextureLoader,
  pipeline,
  projectionViewMatrix,
  sprite,
} from '@pixel-forge/pixel-forge';
import Stats from 'stats.js';

export async function application(canvas: HTMLCanvasElement): Promise<void> {
  const stats = new Stats();
  document.body.appendChild(stats.dom);

  const { device, context } = await createContext(canvas);

  const projectionViewMatrixUniformBuffer = projectionViewMatrix(
    device,
    canvas.width,
    canvas.height,
  );

  const textureLoader = createTextureLoader(device);
  const tex = await textureLoader('assets/pixel-prowlers.png');

  const renderPass = pipeline(
    device,
    context,
    projectionViewMatrixUniformBuffer,
  );

  const sprites: Sprite[] = [];

  sprites.push(
    sprite({
      texture: tex,
      x: 300,
      y: 300,
      origin: [0, 0],
    }),
  );
  sprites.push(
    sprite({
      texture: tex,
      x: 300,
      y: 300,
      origin: [0, 1],
    }),
  );
  sprites.push(
    sprite({
      texture: tex,
      x: 300,
      y: 300,
      origin: [1, 0],
    }),
  );
  sprites.push(
    sprite({
      texture: tex,
      x: 300,
      y: 300,
      origin: [1, 1],
    }),
  );
  sprites.push(
    sprite({
      texture: tex,
      x: 300,
      y: 300,
      origin: [0.5, 0.5],
    }),
  );

  const draw = function () {
    stats.begin();

    for (const sprite of sprites) {
      sprite.rotation += 0.01;
    }

    renderPass(sprites);

    stats.end();
    requestAnimationFrame(draw);
  };

  draw();
}
