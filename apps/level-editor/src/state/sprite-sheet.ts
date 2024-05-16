import { Rect } from '@pixel-craft/math';
import { createSignal } from 'solid-js';

export const [spriteSheet, setSpriteSheet] = createSignal<File>(undefined);
export const [spriteFrames, setSpriteFrames] = createSignal<Rect[]>([]);
