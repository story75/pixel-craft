import {
  type Sprite,
  canvasText,
  createContext,
  createFontLoader,
  createTextureLoader,
  pipeline,
  sprite,
  tilingSprite,
} from '@pixel-craft/renderer';

export async function application(canvas: HTMLCanvasElement): Promise<void> {
  const context = await createContext(canvas);
  const textureLoader = createTextureLoader(context.device);
  const tex = await textureLoader('assets/pixel-craft/pixel-prowlers.png');

  const [x, y] = [canvas.width / 2 - tex.width / 2, canvas.height / 2 - tex.height / 2];

  const rotatingSprites: Sprite[] = [
    sprite({
      texture: tex,
      x,
      y,
      origin: { x: 0, y: 0 },
    }),
    sprite({
      texture: tex,
      x,
      y,
      origin: { x: 0, y: 1 },
    }),
    sprite({
      texture: tex,
      x,
      y,
      origin: { x: 1, y: 0 },
    }),
    sprite({
      texture: tex,
      x,
      y,
      origin: { x: 1, y: 1 },
    }),
    sprite({
      texture: tex,
      x,
      y,
      origin: { x: 0.5, y: 0.5 },
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

  tiledSprite.offset.x = 1.5;
  tiledSprite.offset.y = 1.5;

  const fontLoader = createFontLoader();
  await fontLoader('Monocraft', 'assets/monocraft/Monocraft.otf');
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

  const sprites = [
    sprite({
      texture: tex,
      x: x - (tex.width + 20),
      y: y - 300,
      flip: [true, false],
    }),
    sprite({
      texture: tex,
      x,
      y: y - 300,
      flip: [false, true],
    }),
    sprite({
      texture: tex,
      x: x + (tex.width + 20),
      y: y - 300,
      flip: [true, true],
    }),
    tiledSprite,
    ...rotatingSprites,
    text,
    ...offscreenSprites,
  ];

  const renderPass = pipeline(context);

  const gameLoop = (now: number) => {
    for (const sprite of rotatingSprites) {
      sprite.rotation += 0.01;
    }

    renderPass(sprites);
    requestAnimationFrame(gameLoop);
  };

  gameLoop(performance.now());
}
