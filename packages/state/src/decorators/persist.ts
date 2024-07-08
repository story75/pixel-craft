import { fileToString, stringToFile } from '../transformer/file';

// Shim the "Symbol.metadata" symbol
// @ts-expect-error TS2540: Cannot assign to metadata because it is a read-only property.
Symbol.metadata ??= Symbol.for('Symbol.metadata');

const persistSymbol = Symbol('persist');
const storeSymbol = Symbol('store');

export type PropertyTransform<Value> = {
  serialize: (value: Value) => string | Promise<string>;
  deserialize: (value: string) => Value | Promise<Value>;
};

type PersistMetadata = [
  propertyName: string,
  propertyKey: string,
  storeKey: string,
  transform?: PropertyTransform<unknown>,
];

export type PersistOptions<Value> = {
  store?: string;
  key?: string;
  transform?: PropertyTransform<Value>;
};

async function serializeValue<T>(value: T, transform?: PropertyTransform<T>): Promise<string> {
  if (transform) {
    return transform.serialize(value);
  }

  if (value instanceof File) {
    return fileToString(value);
  }

  return JSON.stringify(value);
}

async function deserializeValue(value: string, transform?: PropertyTransform<unknown>): Promise<unknown> {
  if (transform) {
    return transform.deserialize(value);
  }

  if (value.startsWith('data:')) {
    return stringToFile(value);
  }

  return JSON.parse(value);
}

// biome-ignore lint/suspicious/noExplicitAny: no good way to type decorators for classes without any
export function storeName<Class extends new (...args: any) => InstanceType<Class>>(name: string) {
  return (target: Class, context: ClassDecoratorContext<Class>): Class => {
    context.metadata[storeSymbol] = name;
    return target;
  };
}

function storageKey(propertyKey: string, storeKey?: string): string {
  return storeKey ? `${storeKey}::${propertyKey}` : propertyKey;
}

/**
 * Store the value in the local storage
 */
export function persist<This, Value>(options: PersistOptions<Value> = {}) {
  return (
    target: ClassAccessorDecoratorTarget<This, Value>,
    context: ClassAccessorDecoratorContext<This, Value>,
  ): ClassAccessorDecoratorResult<This, Value> => {
    if (typeof context.name !== 'string') {
      throw new TypeError('Cannot persist symbol property');
    }

    const propertyKey = options.key ?? String(context.name);
    const storeKey = options.store ?? '';
    context.metadata[persistSymbol] ||= [];
    if (!Array.isArray(context.metadata[persistSymbol])) {
      throw new TypeError('Invalid "persist" metadata');
    }
    const metadata: PersistMetadata = [
      context.name,
      propertyKey,
      storeKey,
      options.transform as PropertyTransform<unknown>,
    ];
    context.metadata[persistSymbol].push(metadata);

    return {
      set(value: Value) {
        target.set.call(this, value);

        const classStoreKey = context.metadata[storeSymbol] as string | undefined;

        serializeValue(value, options.transform)
          .then((data) => localStorage.setItem(storageKey(propertyKey, storeKey || classStoreKey), data))
          .catch((e: unknown) => void e);
      },
    };
  };
}

/**
 * Load all persisted values from the local storage
 */
export const loadPersistedValues = async (store: object): Promise<void> => {
  const metadata = store.constructor[Symbol.metadata];
  const persisted = metadata?.[persistSymbol] as PersistMetadata[] | undefined;
  if (!persisted) {
    throw new Error('No "persist" metadata found on store!');
  }

  const classStoreKey = metadata?.[storeSymbol] as string | undefined;

  for (const [propertyName, propertyKey, storeKey, transform] of persisted) {
    const key = storageKey(propertyKey, storeKey || classStoreKey);
    const stored = localStorage.getItem(key);
    if (!stored) {
      continue;
    }

    (store as Record<string, unknown>)[propertyName] = await deserializeValue(stored, transform);
  }
};

/**
 * Force persist all persist-able values
 */
export const forcePersistValues = async (store: object): Promise<void> => {
  const metadata = store.constructor[Symbol.metadata];
  const persisted = metadata?.[persistSymbol] as PersistMetadata[] | undefined;
  if (!persisted) {
    throw new Error('No "persist" metadata found on instance!');
  }

  const classStoreKey = metadata?.[storeSymbol] as string | undefined;

  for (const [propertyName, propertyKey, storeKey, transform] of persisted) {
    const data = await serializeValue((store as Record<string, unknown>)[propertyName], transform);
    const key = storageKey(propertyKey, storeKey || classStoreKey);
    localStorage.setItem(key, data);
  }
};

/**
 * Persist all persist-able values as a single local storage key
 */
export const persistStoreIntoKey = async (store: object, key: string): Promise<void> => {
  const metadata = store.constructor[Symbol.metadata];
  const persisted = metadata?.[persistSymbol] as PersistMetadata[] | undefined;
  if (!persisted) {
    throw new Error('No "persist" metadata found on store!');
  }

  const serialized: Record<string, string> = {};

  for (const [propertyName, propertyKey, storeKey, transform] of persisted) {
    serialized[propertyName] = await serializeValue((store as Record<string, unknown>)[propertyName], transform);
  }

  localStorage.setItem(key, JSON.stringify(serialized));
};

/**
 * Load all persist-able values from a single local storage key
 *
 * @param store - The store to load the values into.
 * @param key - The key to load the values from.
 * @param update - Update the store with the loaded values. Default is `true`.
 *
 * @returns The loaded values.
 */
export const loadStoreFromKey = async (store: object, key: string, update = true): Promise<Record<string, unknown>> => {
  const metadata = store.constructor[Symbol.metadata];
  const persisted = metadata?.[persistSymbol] as PersistMetadata[] | undefined;
  if (!persisted) {
    throw new Error('No "persist" metadata found on store!');
  }

  const serialized = localStorage.getItem(key);
  if (!serialized) {
    return {};
  }

  const data = JSON.parse(serialized);
  const result: Record<string, unknown> = {};

  for (const [propertyName, propertyKey, storeKey, transform] of persisted) {
    if (data[propertyName]) {
      result[propertyName] = await deserializeValue(data[propertyName], transform);
      if (update) {
        (store as Record<string, unknown>)[propertyName] = result[propertyName];
      }
    }
  }

  return result;
};
