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
   *
   * @privateRemarks
   * This has to be lazy initialized to avoid circular dependencies with the Observable class.
   */
  private _onSubscribe?: Observable<[observer: Observer<T>]>;

  /**
   * Observable that notifies when an observer unsubscribes.
   *
   * @remarks
   * This is a sink observable to enable meta operations like logging, tracking or debugging.
   *
   * @privateRemarks
   * This has to be lazy initialized to avoid circular dependencies with the Observable class.
   */
  private _onUnsubscribe?: Observable<[observer: Observer<T>]>;

  private readonly observers = new Set<Observer<T>>();

  get onSubscribe(): Observable<[observer: Observer<T>]> {
    if (!this._onSubscribe) {
      this._onSubscribe = new Observable<[observer: Observer<T>]>();
    }

    return this._onSubscribe;
  }

  get onUnsubscribe(): Observable<[observer: Observer<T>]> {
    if (!this._onUnsubscribe) {
      this._onUnsubscribe = new Observable<[observer: Observer<T>]>();
    }

    return this._onUnsubscribe;
  }

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
      for (const observer of this.observers) {
        this.onUnsubscribe.notify(observer);
      }
    }

    this.observers.clear();
  }

  /**
   * Notify all observers with the given data.
   */
  notify(...data: T): void {
    for (const observer of this.observers) {
      observer(...data);
    }
  }

  private hasObservers(): boolean {
    return this.observers.size > 0;
  }
}
