import { AudioMixer } from '@pixel-craft/audio';
import { InputManager } from '@pixel-craft/input';
import { Sprite, createContext, createTextureLoader, pipeline, sprite, tilingSprite } from '@pixel-craft/renderer';
import { Timer } from '@pixel-craft/timer';
import { Tween, easeInOutQuad } from '@pixel-craft/tweening';
import { Root, TitleScreenMainMenu, TitleScreenWakeUpPrompt } from '@pixel-craft/ui';

export async function application(canvas: HTMLCanvasElement): Promise<void> {
  const inputManager = new InputManager();

  const audioMixer = new AudioMixer();
  const bgm = await audioMixer.load('assets/jrpg-piano/jrpg-piano.mp3');
  bgm.loop = true;
  audioMixer.play(bgm, 'bgm');

  const context = await createContext(canvas);

  const textureLoader = createTextureLoader(context.device);
  const skyAssetPath = 'assets/free-sky-with-clouds-background-pixel-art-set/Clouds/clouds3';

  const [logo, skyBackground, skyMoon, skyCloudsBackground, skyCloudsForeground] = await Promise.all([
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

  const tween = new Tween(logoSprite, { y: 50 }, easeInOutQuad, 4000, true, true);

  const renderPass = pipeline(context);
  const sprites: Sprite[] = [
    skyBackgroundSprite,
    skyMoonSprite,
    skyCloudsBackgroundSprite,
    skyCloudsForegroundSprite,
    logoSprite,
  ];

  const timer = new Timer();
  const backgroundSpeed = 0.001;

  Object.entries({
    '--color-inverse': 'rgb(255, 255, 255)',
    '--color-primary': 'rgb(0, 225, 255)',
  }).forEach(([key, value]) => {
    document.body.style.setProperty(key, value);
  });

  const root = new Root();
  document.body.appendChild(root);

  const titleScreenWakeUpPrompt = new TitleScreenWakeUpPrompt();
  root.appendChild(titleScreenWakeUpPrompt);

  inputManager.addEventListener(
    'keydown',
    () => {
      root.removeChild(titleScreenWakeUpPrompt);

      const titleScreenMainMenu = new TitleScreenMainMenu();
      root.appendChild(titleScreenMainMenu);

      inputManager.addEventListener('up', () => titleScreenMainMenu.previousOption());
      inputManager.addEventListener('down', () => titleScreenMainMenu.nextOption());
    },
    { once: true },
  );

  const draw = function (now: number) {
    timer.update(now);

    tween.update(timer.frameTime);

    skyBackgroundSprite.offset.x += (backgroundSpeed / 4) * timer.deltaTime;
    skyMoonSprite.offset.x += (backgroundSpeed / 8) * timer.deltaTime;
    skyCloudsBackgroundSprite.offset.x += (backgroundSpeed / 2) * timer.deltaTime;
    skyCloudsForegroundSprite.offset.x += backgroundSpeed * timer.deltaTime;

    renderPass(sprites);

    requestAnimationFrame(draw);
  };

  draw(performance.now());
}
