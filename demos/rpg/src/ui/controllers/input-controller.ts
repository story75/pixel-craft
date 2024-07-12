import type { InputManager } from '@pixel-craft/input';
import type { ReactiveController, ReactiveControllerHost } from 'lit';

// Shim the "Symbol.metadata" symbol
// @ts-expect-error TS2540: Cannot assign to metadata because it is a read-only property.
Symbol.metadata ??= Symbol.for('Symbol.metadata');

const bindInputSymbol = Symbol('bindInput');

type BindInputMetadata = [type: Parameters<InputManager['addEventListener']>[0], target: () => void];

export function bindInput<This extends { inputController: InputController }>(
  type: Parameters<InputManager['addEventListener']>[0],
) {
  return (target: (this: This) => void, context: ClassMethodDecoratorContext<This>) => {
    context.metadata[bindInputSymbol] ||= [];
    if (!Array.isArray(context.metadata[bindInputSymbol])) {
      throw new TypeError('Invalid "bindInput" metadata');
    }
    const metadata: BindInputMetadata = [type, target];
    context.metadata[bindInputSymbol].push(metadata);
  };
}

export class InputController implements ReactiveController {
  accessor active = false;

  #subscriptions: (() => void)[] = [];
  readonly #host: ReactiveControllerHost;

  constructor(host: ReactiveControllerHost) {
    this.#host = host;
    host.addController(this);
  }

  #subscribe(...args: Parameters<InputManager['addEventListener']>) {
    const type = args[0];
    const callback = args[1];
    const options = args[2];

    const unsubscribe = window.pixelCraft.inputManager.addEventListener(
      type,
      (event) => {
        if (!this.active) {
          return;
        }

        typeof callback === 'function' && callback(event);
      },
      options,
    );
    this.#subscriptions.push(unsubscribe);
  }

  hostConnected() {
    this.active = true;

    const metadata = this.#host.constructor[Symbol.metadata];
    const listeners = (metadata?.[bindInputSymbol] as BindInputMetadata[] | undefined) || [];
    for (const [type, target] of listeners) {
      this.#subscribe(type, target.bind(this.#host));
    }
  }

  hostDisconnected() {
    this.active = false;

    for (const unsubscribe of this.#subscriptions) {
      unsubscribe();
    }
  }
}
