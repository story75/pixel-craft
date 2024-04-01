import { INDICES_PER_SPRITE } from './constants';

export function createIndices(spritesPerBatch: number): Uint16Array {
  const indices = new Uint16Array(spritesPerBatch * INDICES_PER_SPRITE);
  for (let i = 0; i < spritesPerBatch; i++) {
    // first triangle: 0, 1, 2
    indices[i * INDICES_PER_SPRITE + 0] = i * 4 + 0;
    indices[i * INDICES_PER_SPRITE + 1] = i * 4 + 1;
    indices[i * INDICES_PER_SPRITE + 2] = i * 4 + 2;

    // second triangle: 2, 3, 0
    indices[i * INDICES_PER_SPRITE + 3] = i * 4 + 2;
    indices[i * INDICES_PER_SPRITE + 4] = i * 4 + 3;
    indices[i * INDICES_PER_SPRITE + 5] = i * 4 + 0;
  }
  return indices;
}
