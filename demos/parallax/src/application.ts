import { TimerSystem } from '@pixel-craft/pixel-craft';
import {
  Sprite,
  createContext,
  createTextureLoader,
  pipeline,
  sprite,
  tilingSprite,
} from '@pixel-craft/renderer';
import { Tween, easeInOutQuad } from '@pixel-craft/tweening';
import Stats from 'stats.js';

export async function application(canvas: HTMLCanvasElement): Promise<void> {
  const stats = new Stats();
  document.body.appendChild(stats.dom);

  const context = await createContext(canvas);

  const textureLoader = createTextureLoader(context.device);
  const skyAssetPath =
    'assets/free-sky-with-clouds-background-pixel-art-set/Clouds/clouds3';

  const [
    logo,
    skyBackground,
    skyMoon,
    skyCloudsBackground,
    skyCloudsForeground,
  ] = await Promise.all([
    textureLoader('assets/pixel-craft/pixel-prowlers.png'),
    textureLoader(`${skyAssetPath}/1.png`),
    textureLoader(`${skyAssetPath}/2.png`),
    textureLoader(`${skyAssetPath}/3.png`),
    textureLoader(`${skyAssetPath}/4.png`),
  ]);

  const skyBackgroundSprite = tilingSprite({
    texture: skyBackground,
    z: 0.1,
    width: canvas.width,
    height: canvas.height,
  });

  const skyMoonSprite = tilingSprite({
    texture: skyMoon,
    z: 0.2,
    width: canvas.width,
    height: canvas.height,
  });
  skyMoonSprite.offset.x = 0.5;

  const skyCloudsBackgroundSprite = tilingSprite({
    texture: skyCloudsBackground,
    z: 0.3,
    width: canvas.width,
    height: canvas.height,
  });

  const skyCloudsForegroundSprite = tilingSprite({
    texture: skyCloudsForeground,
    z: 0.4,
    width: canvas.width,
    height: canvas.height,
  });

  const logoSprite = sprite({
    texture: logo,
    z: 0.5,
    width: logo.width * 4,
    height: logo.height * 4,
  });
  logoSprite.x = canvas.width / 2 - logoSprite.width / 2;

  const tween = new Tween(
    logoSprite,
    { y: 50 },
    easeInOutQuad,
    4000,
    true,
    true,
  );

  const renderPass = pipeline(context);
  const sprites: Sprite[] = [
    skyBackgroundSprite,
    skyMoonSprite,
    skyCloudsBackgroundSprite,
    skyCloudsForegroundSprite,
    logoSprite,
  ];

  const timer = new TimerSystem();
  const backgroundSpeed = 0.001;

  const draw = function (now: number) {
    timer.update(now);
    stats.begin();

    tween.update(timer.frameTime);

    skyBackgroundSprite.offset.x += (backgroundSpeed / 4) * timer.deltaTime;
    skyMoonSprite.offset.x += (backgroundSpeed / 8) * timer.deltaTime;
    skyCloudsBackgroundSprite.offset.x +=
      (backgroundSpeed / 2) * timer.deltaTime;
    skyCloudsForegroundSprite.offset.x += backgroundSpeed * timer.deltaTime;

    renderPass(sprites);

    stats.end();
    requestAnimationFrame(draw);
  };

  draw(performance.now());
}
