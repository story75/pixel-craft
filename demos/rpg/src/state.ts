import { AudioMixer } from '@pixel-craft/audio';
import { InputManager } from '@pixel-craft/input';
import { Sprite, TextureLoader, WebGPUContext } from '@pixel-craft/renderer';
import { EntityStore } from '@pixel-craft/store';
import { Timer } from '@pixel-craft/timer';
import { Root } from '@pixel-craft/ui';

export type State = {
  textureLoader: TextureLoader;
  context: WebGPUContext;
  canvas: HTMLCanvasElement;
  root: Root;
  store: EntityStore<Sprite>;
  timer: Timer;
  inputManager: InputManager;
  audioMixer: AudioMixer;
};
