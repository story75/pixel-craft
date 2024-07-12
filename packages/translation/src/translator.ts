import { EventBus } from '@pixel-craft/event-bus';

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

type EventMap = {
  languageChanged: CustomEvent<{ language: string }>;
};

/**
 * The Translator is responsible for translating keys into strings.
 */
export class Translator extends EventBus<EventMap> {
  readonly #translations: Record<string, Translation>;
  #language: string;

  constructor(translations: Record<string, Translation>, language: string) {
    super();
    this.#language = language;
    this.#translations = translations;
  }

  /**
   * Get the current language.
   */
  get language(): string {
    return this.#language;
  }

  /**
   * Set the current language.
   */
  set language(language: string) {
    this.#language = language;
    this.dispatchEvent(new CustomEvent('languageChanged', { detail: { language } }));
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
    let current: string | Translation = this.#translations[this.language];

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
