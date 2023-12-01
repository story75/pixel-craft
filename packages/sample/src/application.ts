import {
  Sprite,
  createContext,
  createTextureLoader,
  pipeline,
  projectionViewMatrix,
  sprite,
  tilingSprite,
} from '@story75/pixel-forge';
import Stats from 'stats.js';

export async function application(canvas: HTMLCanvasElement): Promise<void> {
  const stats = new Stats();
  document.body.appendChild(stats.dom);

  const context = await createContext(canvas);

  const projectionViewMatrixUniformBuffer = projectionViewMatrix(
    context.device,
    canvas.width,
    canvas.height,
  );

  const textureLoader = createTextureLoader(context.device);
  const tex = await textureLoader('assets/pixel-prowlers.png');

  const renderPass = pipeline(context, projectionViewMatrixUniformBuffer);

  const [x, y] = [
    canvas.width / 2 - tex.width / 2,
    canvas.height / 2 - tex.height / 2,
  ];

  const rotatingSprites: Sprite[] = [
    sprite({
      texture: tex,
      x,
      y,
      origin: [0, 0],
    }),
    sprite({
      texture: tex,
      x,
      y,
      origin: [0, 1],
    }),
    sprite({
      texture: tex,
      x,
      y,
      origin: [1, 0],
    }),
    sprite({
      texture: tex,
      x,
      y,
      origin: [1, 1],
    }),
    sprite({
      texture: tex,
      x,
      y,
      origin: [0.5, 0.5],
    }),
  ];

  const parallax = tilingSprite({
    texture: tex,
    width: canvas.width,
    height: canvas.height,
  });

  parallax.offset[0] = 1.5;
  parallax.offset[1] = 1.5;

  const draw = function () {
    stats.begin();

    for (const sprite of rotatingSprites) {
      sprite.rotation += 0.01;
    }

    renderPass([parallax, ...rotatingSprites]);

    stats.end();
    requestAnimationFrame(draw);
  };

  draw();
}
