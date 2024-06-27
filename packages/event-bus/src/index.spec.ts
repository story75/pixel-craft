import { describe, expect, it } from 'bun:test';
import { EventBus } from './index';

type TestEventMap = {
  foo: CustomEvent<number>;
  bar: CustomEvent<string>;
  baz: Event;
};

describe('eventBus', () => {
  it('should be able to subscribe to an event', () => {
    const seenEvents: Partial<TestEventMap> = {};

    const bus = new EventBus<TestEventMap>();
    bus.addEventListener('foo', (event) => {
      seenEvents.foo = event;
    });
    bus.addEventListener('bar', (event) => {
      seenEvents.bar = event;
    });
    bus.addEventListener('baz', (event) => {
      seenEvents.baz = event;
    });

    const fooEvent = new CustomEvent('foo', { detail: 42 });
    const barEvent = new CustomEvent('bar', { detail: 'hello' });
    const bazEvent = new Event('baz');

    bus.dispatchEvent(fooEvent);
    bus.dispatchEvent(barEvent);
    bus.dispatchEvent(bazEvent);

    expect(seenEvents).toEqual({
      foo: fooEvent,
      bar: barEvent,
      baz: bazEvent,
    });
  });

  it('should be able to unsubscribe from an event', () => {
    let seenEvents: Partial<TestEventMap> = {};

    const bus = new EventBus<TestEventMap>();
    const fooListener = (event: CustomEvent<number>) => {
      seenEvents.foo = event;
    };
    bus.addEventListener('foo', fooListener);

    const barListener = (event: CustomEvent<string>) => {
      seenEvents.bar = event;
    };
    bus.addEventListener('bar', barListener);

    const bazListener = (event: Event) => {
      seenEvents.baz = event;
    };
    bus.addEventListener('baz', bazListener);

    const fooEvent = new CustomEvent('foo', { detail: 42 });
    const barEvent = new CustomEvent('bar', { detail: 'hello' });
    const bazEvent = new Event('baz');

    bus.dispatchEvent(fooEvent);
    bus.dispatchEvent(barEvent);
    bus.dispatchEvent(bazEvent);

    expect(seenEvents).toEqual({
      foo: fooEvent,
      bar: barEvent,
      baz: bazEvent,
    });

    seenEvents = {};

    bus.removeEventListener('foo', fooListener);
    bus.removeEventListener('bar', barListener);
    bus.removeEventListener('baz', bazListener);

    bus.dispatchEvent(fooEvent);
    bus.dispatchEvent(barEvent);
    bus.dispatchEvent(bazEvent);

    expect(seenEvents).toEqual({});
  });

  it('should be able to unsubscribe via helper', () => {
    let seenEvents: Partial<TestEventMap> = {};

    const bus = new EventBus<TestEventMap>();
    const unsubFoo = bus.addEventListener('foo', (event) => {
      seenEvents.foo = event;
    });
    const unsubBar = bus.addEventListener('bar', (event) => {
      seenEvents.bar = event;
    });
    const unsubBaz = bus.addEventListener('baz', (event) => {
      seenEvents.baz = event;
    });

    const fooEvent = new CustomEvent('foo', { detail: 42 });
    const barEvent = new CustomEvent('bar', { detail: 'hello' });
    const bazEvent = new Event('baz');

    bus.dispatchEvent(fooEvent);
    bus.dispatchEvent(barEvent);
    bus.dispatchEvent(bazEvent);

    expect(seenEvents).toEqual({
      foo: fooEvent,
      bar: barEvent,
      baz: bazEvent,
    });

    seenEvents = {};

    unsubFoo();
    unsubBar();
    unsubBaz();

    bus.dispatchEvent(fooEvent);
    bus.dispatchEvent(barEvent);
    bus.dispatchEvent(bazEvent);

    expect(seenEvents).toEqual({});
  });

  it('should honor types on dispatch event', () => {
    const bus = new EventBus<{
      foo: CustomEvent<number>;
      bar: CustomEvent<string>;
    }>();
    // @ts-expect-error TS2345: Argument of type "test" is not assignable to parameter of type keyof TestEventMap
    bus.addEventListener('test', () => {});

    // this is not desired, but it's okay for now, because to enforce this we would need to use a different event map
    // or require the type to be specific additionally
    bus.dispatchEvent(new CustomEvent('test', { detail: 42 }));

    // @ts-expect-error TS2345: Argument of type "test" is not assignable to parameter of type "foo" | "bar"
    bus.dispatchEventWithType('test', new CustomEvent('test', { detail: 42 }));

    // this is also not desired, but it's okay for now, because to enforce this we would need to use a different event type
    bus.dispatchEventWithType('foo', new CustomEvent('test', { detail: 42 }));

    // @ts-expect-error TS2345: Argument of type CustomEvent<string> is not assignable to parameter of type CustomEvent<number>
    bus.dispatchEventWithType('foo', new CustomEvent('foo', { detail: 'test' }));

    // @ts-expect-error TS2345: Argument of type CustomEvent<{ foo: string; }> is not assignable to parameter of type CustomEvent<number> | CustomEvent<string>
    bus.dispatchEvent(new CustomEvent('test', { detail: { foo: 'bar' } }));

    expect(1).toBe(1);
  });
});
