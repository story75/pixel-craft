import type { AudioMixer } from '@pixel-craft/audio';
import type { InputManager } from '@pixel-craft/input';
import type { Sprite, TextureLoader, WebGPUContext } from '@pixel-craft/renderer';
import type { EntityStore } from '@pixel-craft/store';
import type { Timer } from '@pixel-craft/timer';
import type { Translator } from '@pixel-craft/translation';
import type { State } from './state';
import type { Root } from './ui/components/root';

export type Singletons = {
  textureLoader: TextureLoader;
  context: WebGPUContext;
  canvas: HTMLCanvasElement;
  root: Root;
  store: EntityStore<Sprite>;
  timer: Timer;
  inputManager: InputManager;
  audioMixer: AudioMixer;
  translator: Translator;
  state: State;
};
