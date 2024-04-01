import {
  Sprite,
  createContext,
  createTextureLoader,
  createTimer,
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
  const skyAssetPath =
    'assets/free-sky-with-clouds-background-pixel-art-set/Clouds/clouds3';

  const [
    logo,
    skyBackground,
    skyMoon,
    skyCloudsBackground,
    skyCloudsForeground,
  ] = await Promise.all([
    textureLoader('assets/pixel-prowlers.png'),
    textureLoader(`${skyAssetPath}/1.png`),
    textureLoader(`${skyAssetPath}/2.png`),
    textureLoader(`${skyAssetPath}/3.png`),
    textureLoader(`${skyAssetPath}/4.png`),
  ]);

  const skyBackgroundSprite = tilingSprite({
    texture: skyBackground,
    width: canvas.width,
    height: canvas.height,
  });

  const skyMoonSprite = tilingSprite({
    texture: skyMoon,
    width: canvas.width,
    height: canvas.height,
  });
  skyMoonSprite.offset[0] = 0.5;

  const skyCloudsBackgroundSprite = tilingSprite({
    texture: skyCloudsBackground,
    width: canvas.width,
    height: canvas.height,
  });

  const skyCloudsForegroundSprite = tilingSprite({
    texture: skyCloudsForeground,
    width: canvas.width,
    height: canvas.height,
  });

  const logoSprite = sprite({
    texture: logo,
    width: logo.width * 4,
    height: logo.height * 4,
  });
  logoSprite.x = canvas.width / 2 - logoSprite.width / 2;

  const renderPass = pipeline(context);
  const sprites: Sprite[] = [
    skyBackgroundSprite,
    skyMoonSprite,
    skyCloudsBackgroundSprite,
    skyCloudsForegroundSprite,
    logoSprite,
  ];

  const timer = createTimer();
  const backgroundSpeed = 0.001;

  const draw = function (now: number) {
    timer.update(now);
    stats.begin();

    skyBackgroundSprite.offset[0] += (backgroundSpeed / 4) * timer.deltaTime;
    skyMoonSprite.offset[0] += (backgroundSpeed / 8) * timer.deltaTime;
    skyCloudsBackgroundSprite.offset[0] +=
      (backgroundSpeed / 2) * timer.deltaTime;
    skyCloudsForegroundSprite.offset[0] += backgroundSpeed * timer.deltaTime;

    renderPass(sprites);

    stats.end();
    requestAnimationFrame(draw);
  };

  draw(performance.now());
}
