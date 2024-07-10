import { AudioMixer } from '@pixel-craft/audio';
import { InputManager } from '@pixel-craft/input';
import { type Sprite, createContext, createTextureLoader, pipeline } from '@pixel-craft/renderer';
import { loadPersistedValues } from '@pixel-craft/state';
import { EntityStore } from '@pixel-craft/store';
import { Timer } from '@pixel-craft/timer';
import { Translator } from '@pixel-craft/translation';
import { battle } from './scenes/battle/battle';
import { titleScreen } from './scenes/title-screen/title-screen';
import type { Singletons } from './singletons';
import { State } from './state';
import { TRANSLATIONS } from './translations/translations';
import { Root } from './ui/components/root';

export async function application(canvas: HTMLCanvasElement): Promise<void> {
  const inputManager = new InputManager();
  const audioMixer = new AudioMixer();
  const context = await createContext(canvas);
  const textureLoader = createTextureLoader(context.device);
  const renderPass = pipeline(context);
  const store = new EntityStore<Sprite>();
  const timer = new Timer();
  const translator = new Translator(TRANSLATIONS, 'en');

  for (const [key, value] of Object.entries({
    '--color-inverse': 'rgb(255, 255, 255)',
    '--color-primary': 'rgb(0, 225, 255)',
  })) {
    document.body.style.setProperty(key, value);
  }

  const root = new Root();
  document.body.appendChild(root);

  const state = new State(audioMixer, translator);
  await loadPersistedValues(state);

  const singletons: Singletons = {
    textureLoader,
    context,
    canvas,
    root,
    store,
    timer,
    inputManager,
    audioMixer,
    translator,
    state,
  };

  // const sceneSystem = await titleScreen(singletons);
  const sceneSystem = await battle(singletons);
  const draw = (now: number) => {
    timer.update(now);
    sceneSystem(now);
    renderPass(store);
    requestAnimationFrame(draw);
  };

  draw(performance.now());
}
