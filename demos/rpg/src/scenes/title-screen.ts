import { Sprite, sprite, tilingSprite } from '@pixel-craft/renderer';
import { OptionList, Slider } from '@pixel-craft/state';
import { easeInOutQuad, Tween } from '@pixel-craft/tweening';
import { TitleScreenMainMenu, TitleScreenSettings, TitleScreenWakeUpPrompt } from '@pixel-craft/ui';
import { State } from '../state';

export async function titleScreen(state: State) {
  const { textureLoader, canvas, root, audioMixer, inputManager, timer } = state;

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
  const titleScreenMainMenu = new TitleScreenMainMenu();
  const titleScreenSettings = new TitleScreenSettings();

  let activeView: TitleScreenMainMenu | TitleScreenSettings = titleScreenMainMenu;
  titleScreenMainMenu.optionList = new OptionList({
    label: 'Main Menu',
    options: [
      { label: 'New Game', active: true },
      { label: 'Continue' },
      {
        label: 'Settings',
        accept: () => {
          root.appendChild(titleScreenSettings);
          activeView = titleScreenSettings;
        },
      },
      { label: 'Quit' },
    ],
  });

  titleScreenSettings.settings = new OptionList<string | number>({
    label: 'Settings',
    options: [
      new OptionList({
        label: 'Language',
        options: [{ label: 'English', active: true }, { label: 'German' }, { label: 'Spanish' }],
      }),
      new OptionList({
        label: 'Font Face',
        options: [
          {
            label: 'Monocraft',
            active: true,
            select: () => {
              document.body.style.fontFamily = 'Monocraft';
            },
          },
          {
            label: 'Arial',
            select: () => {
              document.body.style.fontFamily = 'Arial';
            },
          },
        ],
      }),
      new Slider({
        label: 'Master Volume',
        value: 100,
        min: 0,
        max: 100,
        step: 1,
      }),
      new Slider({
        label: 'BGM Volume',
        value: 100,
        min: 0,
        max: 100,
        step: 1,
      }),
      new Slider({
        label: 'SFX Volume',
        value: 100,
        min: 0,
        max: 100,
        step: 1,
      }),
      new Slider({
        label: 'Voice Volume',
        value: 100,
        min: 0,
        max: 100,
        step: 1,
      }),
    ],
  });

  root.appendChild(titleScreenWakeUpPrompt);
  const onWakeUp = () => {
    root.removeChild(titleScreenWakeUpPrompt);
    root.appendChild(titleScreenMainMenu);

    inputManager.addEventListener('up', () => {
      switch (activeView) {
        case titleScreenMainMenu:
          titleScreenMainMenu.optionList.previous();
          break;
        case titleScreenSettings:
          titleScreenSettings.settings.previous();
          break;
      }
    });
    inputManager.addEventListener('down', () => {
      switch (activeView) {
        case titleScreenMainMenu:
          titleScreenMainMenu.optionList.next();
          break;
        case titleScreenSettings:
          titleScreenSettings.settings.next();
          break;
      }
    });
    inputManager.addEventListener('left', () => {
      switch (activeView) {
        case titleScreenSettings:
          const option = titleScreenSettings.settings.option;
          switch (option.type) {
            case 'slider':
              const slider = option as Slider;
              slider.decrement();
              break;
            case 'option-list':
              const optionList = option as OptionList;
              optionList.previous();
              break;
          }
          titleScreenSettings.settings.change();
          break;
      }
    });
    inputManager.addEventListener('right', () => {
      switch (activeView) {
        case titleScreenSettings:
          const option = titleScreenSettings.settings.option;
          switch (option.type) {
            case 'slider':
              const slider = option as Slider;
              slider.increment();
              break;
            case 'option-list':
              const optionList = option as OptionList;
              optionList.next();
              break;
          }
          titleScreenSettings.settings.change();
          break;
      }
    });
    inputManager.addEventListener('accept', () => {
      switch (activeView) {
        case titleScreenMainMenu:
          titleScreenMainMenu.optionList.option.accept?.();
      }
    });
    inputManager.addEventListener('cancel', () => {
      switch (activeView) {
        case titleScreenSettings:
          root.removeChild(titleScreenSettings);
          activeView = titleScreenMainMenu;
          break;
      }
    });
  };

  inputManager.addEventListener('keydown', onWakeUp, { once: true });

  return (now: number) => {
    tween.update(timer.frameTime);

    skyBackgroundSprite.offset.x += (backgroundSpeed / 4) * timer.deltaTime;
    skyMoonSprite.offset.x += (backgroundSpeed / 8) * timer.deltaTime;
    skyCloudsBackgroundSprite.offset.x += (backgroundSpeed / 2) * timer.deltaTime;
    skyCloudsForegroundSprite.offset.x += backgroundSpeed * timer.deltaTime;
  };
}
