import { type Sprite, sprite, tilingSprite } from '@pixel-craft/renderer';
import { Tween, easeInOutQuad } from '@pixel-craft/tweening';
import type { State } from '../state';
import { TitleScreenMainMenu } from './ui/main-menu';
import { TitleScreenSettings } from './ui/settings';
import { TitleScreenWakeUpPrompt } from './ui/wake-up-prompt';

export async function titleScreen(state: State) {
  const { textureLoader, canvas, root, audioMixer, inputManager, timer, translator } = state;

  const bgm = await audioMixer.load('assets/jrpg-piano/jrpg-piano.mp3');
  bgm.loop = true;
  audioMixer.play(bgm, 'bgm');

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

  const sprites: Sprite[] = [
    skyBackgroundSprite,
    skyMoonSprite,
    skyCloudsBackgroundSprite,
    skyCloudsForegroundSprite,
    logoSprite,
  ];

  for (const sprite of sprites) {
    state.store.add(sprite);
  }

  const backgroundSpeed = 0.001;

  const titleScreenWakeUpPrompt = new TitleScreenWakeUpPrompt();
  titleScreenWakeUpPrompt.inputManager = inputManager;
  titleScreenWakeUpPrompt.translator = translator;
  const titleScreenMainMenu = new TitleScreenMainMenu();
  titleScreenMainMenu.inputManager = inputManager;
  titleScreenMainMenu.translator = translator;
  const titleScreenSettings = new TitleScreenSettings();
  titleScreenSettings.inputManager = inputManager;
  titleScreenSettings.translator = translator;

  titleScreenWakeUpPrompt.addEventListener(
    'unlocked',
    () => {
      root.removeChild(titleScreenWakeUpPrompt);
      root.appendChild(titleScreenMainMenu);
    },
    { once: true },
  );

  titleScreenMainMenu.addEventListener('settings', () => {
    titleScreenMainMenu.active = false;
    root.appendChild(titleScreenSettings);
  });

  titleScreenSettings.addEventListener('cancel', () => {
    root.removeChild(titleScreenSettings);
    titleScreenMainMenu.active = true;
  });

  root.appendChild(titleScreenWakeUpPrompt);

  return (now: number) => {
    tween.update(timer.frameTime);

    skyBackgroundSprite.offset.x += (backgroundSpeed / 4) * timer.deltaTime;
    skyMoonSprite.offset.x += (backgroundSpeed / 8) * timer.deltaTime;
    skyCloudsBackgroundSprite.offset.x += (backgroundSpeed / 2) * timer.deltaTime;
    skyCloudsForegroundSprite.offset.x += backgroundSpeed * timer.deltaTime;
  };
}
