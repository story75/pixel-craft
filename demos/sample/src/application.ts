import {
  Sprite,
  canvasText,
  createContext,
  createFontLoader,
  createInput,
  createTextureLoader,
  createTimer,
  inputControlledCamera,
  pipeline,
  sprite,
  tilingSprite,
} from '@pixel-craft/engine';
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

  const offscreenSprites = [
    sprite({
      texture: tex,
      x: canvas.width + 10,
      y,
    }),
    sprite({
      texture: tex,
      x: -10 - tex.width,
      y,
    }),
    sprite({
      texture: tex,
      x,
      y: canvas.height + 10,
    }),
    sprite({
      texture: tex,
      x,
      y: -10 - tex.height,
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

  const input = createInput();
  const timer = createTimer();
  const camera = inputControlledCamera(input, timer, context.camera);

  const draw = function (now: number) {
    timer.update(now);
    camera.update();
    stats.begin();

    for (const sprite of rotatingSprites) {
      sprite.rotation += 0.01;
    }

    renderPass([tiledSprite, ...rotatingSprites, text, ...offscreenSprites]);

    stats.end();
    requestAnimationFrame(draw);
  };

  draw(performance.now());
}
