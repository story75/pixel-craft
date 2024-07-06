import { AudioMixer } from '@pixel-craft/audio';
import { InputManager } from '@pixel-craft/input';
import { Sprite, createContext, createTextureLoader, pipeline } from '@pixel-craft/renderer';
import { EntityStore } from '@pixel-craft/store';
import { Timer } from '@pixel-craft/timer';
import { Root } from '@pixel-craft/ui';
import { titleScreen } from './scenes/title-screen';
import { State } from './state';

export async function application(canvas: HTMLCanvasElement): Promise<void> {
  const inputManager = new InputManager();
  const audioMixer = new AudioMixer();
  const context = await createContext(canvas);
  const textureLoader = createTextureLoader(context.device);
  const renderPass = pipeline(context);
  const store = new EntityStore<Sprite>();
  const timer = new Timer();

  Object.entries({
    '--color-inverse': 'rgb(255, 255, 255)',
    '--color-primary': 'rgb(0, 225, 255)',
  }).forEach(([key, value]) => {
    document.body.style.setProperty(key, value);
  });

  const root = new Root();
  document.body.appendChild(root);

  const state: State = {
    textureLoader,
    context,
    canvas,
    root,
    store,
    timer,
    inputManager,
    audioMixer,
  };

  const sceneSystem = await titleScreen(state);

  const draw = function (now: number) {
    timer.update(now);
    sceneSystem(now);
    renderPass(store);
    requestAnimationFrame(draw);
  };

  draw(performance.now());
}
