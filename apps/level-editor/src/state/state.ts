import { Rect } from '@pixel-craft/math';
import { createStore } from 'solid-js/store';

export type State = {
  spriteSheet: File | undefined;
  spriteFrames: Rect[];
  spriteSheetOptions: {
    tileSize: number;
    margin: number;
    zoom: number;
    activeTiles: string[];
  };
  mapOptions: {
    width: number;
    height: number;
    layers: (number | undefined)[][][];
  };
};

export const [state, setState] = createStore<State>({
  spriteSheet: undefined,
  spriteFrames: [],
  spriteSheetOptions: {
    tileSize: 16,
    margin: 0,
    zoom: 4,
    activeTiles: [],
  },
  mapOptions: {
    width: 10,
    height: 10,
    layers: [],
  },
});
