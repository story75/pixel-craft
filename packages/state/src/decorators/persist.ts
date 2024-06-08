import { fileToString, stringToFile } from '../transformer/file';

// Shim the "Symbol.metadata" symbol
// @ts-expect-error TS2540: Cannot assign to metadata because it is a read-only property.
Symbol.metadata ??= Symbol.for('Symbol.metadata');

const persistKey = Symbol('persist');

export type PropertyTransform<Value> = {
  serialize: (value: Value) => string | Promise<string>;
  deserialize: (value: string) => Value | Promise<Value>;
};

type PersistMetadata = [propertyName: string, storageKey: string, transform?: PropertyTransform<unknown>];

export type PersistOptions<Value> = {
  key?: string;
  transform?: PropertyTransform<Value>;
};

/**
 * Store the value in the local storage
 */
export function persist<This, Value>(options: PersistOptions<Value> = {}) {
  return (
    target: ClassAccessorDecoratorTarget<This, Value>,
    context: ClassAccessorDecoratorContext<This, Value>,
  ): ClassAccessorDecoratorResult<This, Value> => {
    const storageKey = options.key ?? String(context.name);
    context.metadata[persistKey] ||= [];
    if (!Array.isArray(context.metadata[persistKey])) {
      throw new TypeError('Invalid "persist" metadata');
    }
    context.metadata[persistKey].push([context.name, storageKey, options.transform]);

    return {
      set(value: Value) {
        target.set.call(this, value);

        let maybePromise: string | Promise<string>;

        if (options.transform) {
          maybePromise = options.transform.serialize(value);
        } else if (value instanceof File) {
          maybePromise = fileToString(value);
        } else {
          maybePromise = JSON.stringify(value);
        }

        const promise = typeof maybePromise === 'string' ? Promise.resolve(maybePromise) : maybePromise;

        promise.then((data) => localStorage.setItem(storageKey, data)).catch((e: unknown) => void e);
      },
    };
  };
}

/**
 * Load all persisted values from the local storage
 */
export const loadPersistedValues = async (store: object) => {
  const metadata = store.constructor[Symbol.metadata];
  const persisted = metadata?.[persistKey] as PersistMetadata[] | undefined;
  if (!persisted) {
    throw new Error('No "persist" metadata found on instance!');
  }

  for (const [propertyName, storageKey, transform] of persisted) {
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      continue;
    }

    let value: unknown;

    if (transform) {
      value = await transform.deserialize(stored);
    } else if (stored.startsWith('data:')) {
      value = await stringToFile(stored);
    } else {
      value = JSON.parse(stored);
    }

    (store as Record<string, unknown>)[propertyName] = value;
  }
};

/**
 * Force persist all persist-able values
 */
export const forcePersistValues = (store: object) => {
  const metadata = store.constructor[Symbol.metadata];
  const persisted = metadata?.[persistKey] as PersistMetadata[] | undefined;
  if (!persisted) {
    throw new Error('No "persist" metadata found on instance!');
  }

  for (const [propertyName] of persisted) {
    // just trigger the setter via self assignment
    (store as Record<string, unknown>)[propertyName] = (store as Record<string, unknown>)[propertyName];
  }
};
