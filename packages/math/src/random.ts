/**
 * A MurmurHash3 implementation for generating random numbers.
 *
 * @remarks
 * Taken from linked source and adapted to typescript.
 *
 * @param seed - Your seed string
 *
 * @see https://github.com/bryc/code/blob/master/jshash/PRNGs.md#addendum-a-seed-generating-functions
 */
function xmur3(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }

  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

/**
 * A random number generator based on "Small Fast Counter".
 *
 * @remarks
 * Taken from linked source and adapted to typescript.
 * Also added a seed parameter to allow for seeding the generator.
 * Also added logic to discard the first 10 numbers to avoid the warm-up period.
 *
 * @param seed - Your seed
 *
 * @see https://github.com/bryc/code/blob/master/jshash/PRNGs.md#sfc32
 */
export function random(seed: string): () => number {
  const hasher = xmur3(seed);
  let a = hasher();
  let b = hasher();
  let c = hasher();
  let d = hasher();

  const rng = function () {
    a |= 0;
    b |= 0;
    c |= 0;
    d |= 0;
    const t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };

  // discard the first 10 numbers
  for (let i = 0; i < 10; i++) {
    rng();
  }

  return rng;
}
