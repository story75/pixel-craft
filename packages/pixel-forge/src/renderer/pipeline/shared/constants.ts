/**
 * The number of indices per sprite. Each sprite is a quad, which has 2 triangles, each with 3 vertices.
 */
export const INDICES_PER_SPRITE = 6;

/**
 * Each sprite is a quad, which has 4 unique vertices.
 */
const UNIQUE_VERTICES_PER_SPRITE = 4;

/**
 * Return the number of floats required per sprite.
 *
 * @param floatsPerVertex The number of floats per vertex.
 */
export function floatsPerSprite(floatsPerVertex: number): number {
  return UNIQUE_VERTICES_PER_SPRITE * floatsPerVertex;
}
