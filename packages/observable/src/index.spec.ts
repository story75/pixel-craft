import { describe, expect, it } from 'bun:test';
import { Observable, Observer } from './index';

type Payload = [foo: number, bar: string];

describe('Observable', () => {
  it('creates a working instance', () => {
    const received: Payload[] = [];
    const subscribers: Array<Observer<Payload>> = [];
    const unsubbed: Array<Observer<Payload>> = [];

    const observer = (foo: number, bar: string) => received.push([foo, bar]);

    const observable = new Observable<Payload>();
    observable.onSubscribe.subscribe((observer) => subscribers.push(observer));
    observable.onUnsubscribe.subscribe((observer) => unsubbed.push(observer));
    observable.subscribe(observer);

    expect(subscribers).toEqual([observer]);
    expect(unsubbed).toEqual([]);

    observable.notify(1, 'a');
    observable.notify(2, 'b');

    observable.unsubscribe(observer);

    observable.notify(3, 'c');

    expect(subscribers).toEqual([observer]);
    expect(unsubbed).toEqual([observer]);
    expect(received).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });

  it('can clear an instance', () => {
    const receivedA: Payload[] = [];
    const receivedB: Payload[] = [];
    const unsubbed: Array<Observer<Payload>> = [];

    const observerA = (foo: number, bar: string) => receivedA.push([foo, bar]);
    const observerB = (foo: number, bar: string) => receivedB.push([foo, bar]);

    const observable = new Observable<Payload>();
    observable.onUnsubscribe.subscribe((observer) => unsubbed.push(observer));
    observable.subscribe(observerA);
    observable.subscribe(observerB);

    expect(unsubbed).toEqual([]);

    observable.notify(1, 'a');
    observable.notify(2, 'b');

    observable.clear();

    observable.notify(3, 'c');

    expect(unsubbed).toEqual([observerA, observerB]);
    expect(receivedA).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
    expect(receivedB).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });
});
