import { randomInRange } from '@pixel-craft/math';
import { type Sprite, sprite, tilingSprite } from '@pixel-craft/renderer';
import { Tween, easeInOutQuad } from '@pixel-craft/tweening';
import type { State } from '../state';
import { Transition } from '../ui/components/transition';
import { TitleScreenMainMenu } from './ui/main-menu';
import { TitleScreenSettings } from './ui/settings';
import { TitleScreenWakeUpPrompt } from './ui/wake-up-prompt';

export async function titleScreen(state: State) {
  const { textureLoader, canvas, root, audioMixer, inputManager, timer, translator } = state;

  const bgmBuffer = await audioMixer.load('assets/jrpg-piano/jrpg-piano.mp3');
  const bgm = audioMixer.createSource(bgmBuffer);
  bgm.loop = true;
  audioMixer.play(bgm, 'bgm');

  const realmSyncVoice1Buffer = await audioMixer.load('assets/elevenlabs/sally_realm_sync_1.mp3');
  const realmSyncVoice2Buffer = await audioMixer.load('assets/elevenlabs/sally_realm_sync_2.mp3');

  const sfxConfirmBuffer = await audioMixer.load('assets/kenney_interface-sounds/Audio/confirmation_003.ogg');
  const sfxSelectBuffer = await audioMixer.load('assets/kenney_interface-sounds/Audio/select_005.ogg');
  const sfxSwitchBuffer = await audioMixer.load('assets/kenney_interface-sounds/Audio/switch_002.ogg');
  const sfxToggleBuffer = await audioMixer.load('assets/kenney_interface-sounds/Audio/toggle_003.ogg');

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
  titleScreenSettings.audioMixer = audioMixer;

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

  titleScreenMainMenu.addEventListener('quit', () => {
    const transition = new Transition();
    transition.addEventListener('transitionend', () => {
      window.location.reload();
    });
    root.appendChild(transition);
  });

  titleScreenSettings.addEventListener('cancel', () => {
    root.removeChild(titleScreenSettings);
    titleScreenMainMenu.active = true;
  });

  let voicePlaying = false;
  titleScreenSettings.addEventListener('play-voice', () => {
    if (voicePlaying) {
      return;
    }

    const buffer = Math.random() < 0.5 ? realmSyncVoice1Buffer : realmSyncVoice2Buffer;
    const source = audioMixer.createSource(buffer);
    source.addEventListener('ended', () => {
      voicePlaying = false;
    });
    audioMixer.play(source, 'voice');
    voicePlaying = true;
  });

  let sfxPlaying = false;
  titleScreenSettings.addEventListener('play-sfx', () => {
    if (sfxPlaying) {
      return;
    }

    const sound = randomInRange(Math.random, 0, 3);
    const buffer = [sfxConfirmBuffer, sfxSelectBuffer, sfxSwitchBuffer, sfxToggleBuffer][sound];
    const source = audioMixer.createSource(buffer);
    source.addEventListener('ended', () => {
      sfxPlaying = false;
    });
    audioMixer.play(source, 'sfx');
    sfxPlaying = true;
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
