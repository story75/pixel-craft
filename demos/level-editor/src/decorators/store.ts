import { fileToString, stringToFile } from '../transformer/file';

/**
 * Store the value in the local storage
 *
 * @param key - The key to store the value under
 */
export function store<This, Value>(key?: string) {
  return (
    target: ClassAccessorDecoratorTarget<This, Value>,
    context: ClassAccessorDecoratorContext<This, Value>,
  ): ClassAccessorDecoratorResult<This, Value> => {
    const storageKey = key ?? String(context.name);

    return {
      set(value: Value) {
        target.set.call(this, value);
        if (value instanceof File) {
          fileToString(value)
            .then((data) => localStorage.setItem(storageKey, data))
            .catch((e: unknown) => void e);
        } else {
          localStorage.setItem(storageKey, JSON.stringify(value));
        }
      },
      init(value: Value): Value {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          if (stored.startsWith('data:')) {
            return stringToFile(stored) as unknown as Value;
          }
          return JSON.parse(stored) as Value;
        }
        return value;
      },
    };
  };
}
