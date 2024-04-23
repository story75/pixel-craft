export type Observer<T extends unknown[]> = (...args: T) => void;

/**
 * Observable class that allows to subscribe and unsubscribe synchronous observers.
 *
 * @remarks
 * Observable are useful for creating synchronous event emitters without filling the task queue,
 * but instead resolving all observers in the same stack.
 */
export class Observable<T extends unknown[] = []> {
  /**
   * Observable that notifies when an observer subscribes.
   *
   * @remarks
   * This is a sink observable to enable meta operations like logging, tracking or debugging.
   */
  public onSubscribe = new Observable<[observer: Observer<T>]>();

  /**
   * Observable that notifies when an observer unsubscribes.
   *
   * @remarks
   * This is a sink observable to enable meta operations like logging, tracking or debugging.
   */
  public onUnsubscribe = new Observable<[observer: Observer<T>]>();

  private readonly observers = new Set<Observer<T>>();

  /**
   * Listen to data emitted by the observable.
   */
  subscribe(observer: Observer<T>): () => void {
    this.observers.add(observer);
    if (this.onSubscribe.hasObservers()) {
      this.onSubscribe.notify(observer);
    }
    return () => this.observers.delete(observer);
  }

  /**
   * Stop listening to data emitted by the observable.
   */
  unsubscribe(observer: Observer<T>): void {
    this.observers.delete(observer);
    if (this.onUnsubscribe.hasObservers()) {
      this.onUnsubscribe.notify(observer);
    }
  }

  /**
   * Clear all observers.
   *
   * @remarks
   * This method should be used as a cleanup mechanism to avoid memory leaks.
   */
  clear(): void {
    if (this.onUnsubscribe.hasObservers()) {
      this.observers.forEach((observer) => this.onUnsubscribe.notify(observer));
    }

    this.observers.clear();
  }

  /**
   * Notify all observers with the given data.
   */
  notify(...data: T): void {
    this.observers.forEach((observer) => observer(...data));
  }

  private hasObservers(): boolean {
    return this.observers.size > 0;
  }
}
