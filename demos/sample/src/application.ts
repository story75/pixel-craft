import {
  AnimatorSystem,
  Application,
  InputCameraSystem,
  InputSystem,
  RenderSystem,
  TimerSystem,
} from '@pixel-craft/pixel-craft';
import {
  Sprite,
  canvasText,
  createFontLoader,
  createTextureLoader,
  sprite,
  tilingSprite,
} from '@pixel-craft/renderer';

export async function application(canvas: HTMLCanvasElement): Promise<void> {
  const app = await Application.create(canvas);
  const renderer = new RenderSystem();
  const input = new InputSystem();
  const timer = new TimerSystem();
  const camera = new InputCameraSystem(input, timer);
  const animator = new AnimatorSystem(timer);
  await app.addSystems(renderer, input, timer, camera, animator);

  const textureLoader = createTextureLoader(app.context.device);
  const tex = await textureLoader('assets/pixel-prowlers.png');

  const [x, y] = [
    canvas.width / 2 - tex.width / 2,
    canvas.height / 2 - tex.height / 2,
  ];

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
  await fontLoader('Monocraft', 'vendor/monocraft/Monocraft.otf');
  const text = canvasText(
    {
      text: 'Hello World!',
      font: '42px Monocraft',
      color: [0, 0, 0],
    },
    app.context.device,
  );

  // after the text is created, we know its width and height
  text.x = canvas.width / 2 - text.width / 2;
  text.y = 250;

  const sceneSystem = {
    update: () => {
      for (const sprite of rotatingSprites) {
        sprite.rotation += 0.01;
      }
    },
  };
  await app.addSystems(sceneSystem);
  app.addGameObjects(
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
  );
}
