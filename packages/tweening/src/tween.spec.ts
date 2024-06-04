import { describe, expect, it } from 'bun:test';
import { easeInOutQuad } from './easing';
import { Tween } from './tween';

describe('Tween', () => {
  it('should be able to tween a object', () => {
    const target = { x: 0, y: 0 };
    const duration = 1000;

    const tween = new Tween(target, { x: 100 }, easeInOutQuad, duration);

    expect(target.x).toBe(0);
    tween.update(duration / 4);
    expect(target.x).toBe(12.5);
    tween.update(duration / 4);
    expect(target.x).toBe(50);
    tween.update(duration / 4);
    expect(target.x).toBe(87.5);
    tween.update(duration / 4);
    expect(target.x).toBe(100);

    expect(target.y).toBe(0);
    expect(tween.isPaused()).toBe(true);
  });

  it('should correctly repeat', () => {
    const target = { x: 0, y: 0 };
    const duration = 1000;

    const tween = new Tween(target, { x: 100 }, easeInOutQuad, duration, true);

    expect(target.x).toBe(0);
    tween.update(duration / 4);
    expect(target.x).toBe(12.5);
    tween.update(duration / 4);
    expect(target.x).toBe(50);
    tween.update(duration / 4);
    expect(target.x).toBe(87.5);
    tween.update(duration / 4);
    expect(target.x).toBe(100);

    expect(target.y).toBe(0);
    expect(tween.isPaused()).toBe(false);

    tween.update(0);
    expect(target.x).toBe(0);
    tween.update(duration / 4);
    expect(target.x).toBe(12.5);
    tween.update(duration / 4);
    expect(target.x).toBe(50);
    tween.update(duration / 4);
    expect(target.x).toBe(87.5);
    tween.update(duration / 4);
    expect(target.x).toBe(100);
  });

  it('should correctly repeat in alternating fashion', () => {
    const target = { x: 0, y: 0 };
    const duration = 1000;

    const tween = new Tween(target, { x: 100 }, easeInOutQuad, duration, true, true);

    expect(target.x).toBe(0);
    tween.update(duration / 4);
    expect(target.x).toBe(12.5);
    tween.update(duration / 4);
    expect(target.x).toBe(50);
    tween.update(duration / 4);
    expect(target.x).toBe(87.5);
    tween.update(duration / 4);
    expect(target.x).toBe(100);

    expect(target.y).toBe(0);
    expect(tween.isPaused()).toBe(false);

    tween.update(0);
    expect(target.x).toBe(100);
    tween.update(duration / 4);
    expect(target.x).toBe(87.5);
    tween.update(duration / 4);
    expect(target.x).toBe(50);
    tween.update(duration / 4);
    expect(target.x).toBe(12.5);
    tween.update(duration / 4);
    expect(target.x).toBe(0);
  });
});
