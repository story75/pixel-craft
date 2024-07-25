import { ValueObservable } from '@pixel-craft/observable';

/**
 * A translation object containing all strings for a specific language.
 *
 * @remarks
 * The translation object is a tree structure where each key is either a string or another translation object.
 * You can nest translation objects to create a hierarchy of translations e.g. for different components or pages.
 *
 * All your languages must have the same structure, so that you can easily switch between them.
 */
export type Translation = {
  [key: string]: Translation | string;
};

/**
 * The Translator is responsible for translating keys into strings.
 */
export class Translator {
  readonly #translations: Record<string, Translation>;
  readonly language: ValueObservable<string>;

  constructor(translations: Record<string, Translation>, language: string) {
    this.language = new ValueObservable(language);
    this.#translations = translations;
  }

  /**
   * Translate a given key using the current language
   *
   * @remarks
   * If the key cannot be found or does not resolve to a string the key is returned instead.
   *
   * @param key - The key to search for e.g. "TITLE_SCREEN.WAKE_UP_PROMPT"
   */
  translate(key: string): string {
    const parts = key.includes('.') ? key.split('.') : [key];
    let current: string | Translation = this.#translations[this.language.value];

    for (const part of parts) {
      if (typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return key;
      }
    }

    return typeof current === 'string' ? current : key;
  }
}
