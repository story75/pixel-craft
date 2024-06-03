import { Rect } from '@pixel-craft/math';

export type EditorOptions = {
  tileSize: number;
  margin: number;
  zoom: number;
  selectedTiles: string[];
  spriteFrames: Rect[];
};

export const storageKey = 'pixel-craft-editor-tileset';
export const optionKey = 'pixel-craft-editor-options';
