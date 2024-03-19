import {
  Sprite,
  canvasText,
  createContext,
  createFontLoader,
  createTextureLoader,
  pipeline,
  sprite,
  tilingSprite,
} from '@story75/pixel-forge';
import Stats from 'stats.js';

export async function application(canvas: HTMLCanvasElement): Promise<void> {
  const stats = new Stats();
  document.body.appendChild(stats.dom);

  const context = await createContext(canvas);

  const textureLoader = createTextureLoader(context.device);
  const tex = await textureLoader('assets/pixel-prowlers.png');

  const renderPass = pipeline(context);

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

  const tiledSprite = tilingSprite({
    texture: tex,
    width: canvas.width,
    height: canvas.height,
  });

  tiledSprite.offset[0] = 1.5;
  tiledSprite.offset[1] = 1.5;

  const fontLoader = createFontLoader();
  await fontLoader('Monocraft', 'vendor/monocraft/Monocraft.otf');
  const text = canvasText(
    {
      text: 'Hello World!',
      font: '42px Monocraft',
      color: [0, 0, 0],
    },
    context.device,
  );

  // after the text is created, we know its width and height
  text.x = canvas.width / 2 - text.width / 2;
  text.y = 250;

  const draw = function () {
    stats.begin();

    for (const sprite of rotatingSprites) {
      sprite.rotation += 0.01;
    }

    renderPass([tiledSprite, ...rotatingSprites, text]);

    stats.end();
    requestAnimationFrame(draw);
  };

  draw();
}
