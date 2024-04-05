import {
  Sprite,
  canvasText,
  createFontLoader,
  createTextureLoader,
  sprite,
  tilingSprite,
} from '@pixel-craft/engine';
import {
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
    tiledSprite,
    ...rotatingSprites,
    text,
    ...offscreenSprites,
  );
}
