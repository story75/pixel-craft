/**
 * Load a font by name and path.
 *
 * @remarks
 * The loader will cache fonts to avoid loading the same font multiple times.
 * The cache key is the name.
 *
 * This will automatically add the font to the document once the font is loaded.
 * You do not need the font face after loading it, so it is safe to ignore the return value,
 * but keep in mind that the font will not be available until the promise resolves.
 *
 * @param name - The name to load the font as.
 * @param path - The path to load the font from. Can either be relative from the host or a full url.
 */
export type FontLoader = (name: string, path: string) => Promise<FontFace>;

/**
 * Create a font loader.
 */
export function createFontLoader(): FontLoader {
  const cache = new Map<string, FontFace>();

  return async (name, path) => {
    const cached = cache.get(name);
    if (cached) {
      return cached;
    }

    const font = new FontFace(name, `url(${path})`);
    await font.load();
    document.fonts.add(font);

    cache.set(name, font);
    return font;
  };
}
