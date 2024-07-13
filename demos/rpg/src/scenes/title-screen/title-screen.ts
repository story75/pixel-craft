import type { Sound } from '@pixel-craft/audio';
import { randomInRange } from '@pixel-craft/math';
import { type Sprite, sprite, tilingSprite } from '@pixel-craft/renderer';
import { Tween, easeInOutQuad } from '@pixel-craft/tweening';
import { createTransition } from '../../create-transition';
// import { ModalSaveStates } from './ui/save-states';
import { TitleScreenMainMenu } from './ui/main-menu';
import { TitleScreenSettings } from './ui/settings';
import { TitleScreenWakeUpPrompt } from './ui/wake-up-prompt';

export async function titleScreen() {
  const { textureLoader, canvas, root, audioMixer, timer, store } = window.pixelCraft;

  const bgm = await audioMixer.load('assets/jrpg-piano/jrpg-piano.mp3');
  bgm.loop = true;
  audioMixer.play(bgm, 'bgm');

  const voiceSounds = await Promise.all([
    audioMixer.load('assets/elevenlabs/sally_realm_sync_1.mp3'),
    audioMixer.load('assets/elevenlabs/sally_realm_sync_2.mp3'),
  ]);

  const sfxSounds = await Promise.all([
    audioMixer.load('assets/kenney_interface-sounds/Audio/confirmation_003.ogg'),
    audioMixer.load('assets/kenney_interface-sounds/Audio/select_005.ogg'),
    audioMixer.load('assets/kenney_interface-sounds/Audio/switch_002.ogg'),
    audioMixer.load('assets/kenney_interface-sounds/Audio/toggle_003.ogg'),
  ]);

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
    store.add(sprite);
  }

  const backgroundSpeed = 0.001;

  const titleScreenWakeUpPrompt = new TitleScreenWakeUpPrompt();
  const titleScreenMainMenu = new TitleScreenMainMenu();
  const titleScreenSettings = new TitleScreenSettings();
  // const titleScreenSaveStates = new ModalSaveStates();
  // titleScreenSaveStates.inputManager = inputManager;
  // titleScreenSaveStates.translator = translator;

  titleScreenWakeUpPrompt.addEventListener(
    'unlocked',
    () => {
      root.removeChild(titleScreenWakeUpPrompt);
      root.appendChild(titleScreenMainMenu);
    },
    { once: true },
  );

  titleScreenMainMenu.addEventListener('settings', () => {
    root.removeChild(titleScreenMainMenu);
    root.appendChild(titleScreenSettings);
  });

  // titleScreenMainMenu.addEventListener('continue', () => {
  //   titleScreenMainMenu.active = false;
  //   root.appendChild(titleScreenSaveStates);
  // });

  titleScreenMainMenu.addEventListener('quit', () => {
    createTransition(root, () => {
      window.location.reload();
    });
  });

  titleScreenSettings.addEventListener('cancel', () => {
    root.removeChild(titleScreenSettings);
    root.appendChild(titleScreenMainMenu);
  });

  //
  // titleScreenSaveStates.addEventListener('cancel', () => {
  //   root.removeChild(titleScreenSaveStates);
  //   titleScreenMainMenu.active = true;
  // });
  //
  const playSound = (sounds: Sound[], channel: 'voice' | 'sfx', force = false) => {
    if (!force) {
      const anySoundPlaying = sounds.some((sound) => sound.playing);
      if (anySoundPlaying) {
        return;
      }
    }

    for (const sound of sounds) {
      sound.stop();
    }

    const soundIndex = randomInRange(Math.random, 0, sounds.length - 1);
    const sound = sounds[soundIndex];
    audioMixer.play(sound, channel);
  };

  titleScreenSettings.addEventListener('play-voice', (event) => {
    const e = event as CustomEvent<{ force?: boolean }>;
    playSound(voiceSounds, 'voice', e.detail?.force);
  });

  titleScreenSettings.addEventListener('play-sfx', (event) => {
    const e = event as CustomEvent<{ force?: boolean }>;
    playSound(sfxSounds, 'sfx', e.detail?.force);
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
