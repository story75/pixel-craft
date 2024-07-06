import { AudioMixer } from '@pixel-craft/audio';
import { InputManager } from '@pixel-craft/input';
import { Sprite, TextureLoader, WebGPUContext } from '@pixel-craft/renderer';
import { EntityStore } from '@pixel-craft/store';
import { Timer } from '@pixel-craft/timer';
import { Translator } from '@pixel-craft/translation';
import { Root } from './ui/components/root';

export type State = {
  textureLoader: TextureLoader;
  context: WebGPUContext;
  canvas: HTMLCanvasElement;
  root: Root;
  store: EntityStore<Sprite>;
  timer: Timer;
  inputManager: InputManager;
  audioMixer: AudioMixer;
  translator: Translator;
};
