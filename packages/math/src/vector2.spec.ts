import { describe, expect, it } from 'bun:test';
import { Vector2 } from './vector2';

describe('Vector2', () => {
  it('should create a vector with x and y components', () => {
    const vector = new Vector2({ x: 1, y: 2 });
    expect(vector.x).toBe(1);
    expect(vector.y).toBe(2);
  });

  it('should have a getter for x component', () => {
    const vector = new Vector2({ x: 1, y: 2 });
    expect(vector.x).toBe(1);
  });

  it('should have a setter for x component', () => {
    const vector = new Vector2({ x: 1, y: 2 });
    vector.x = 3;
    expect(vector.x).toBe(3);
  });

  it('should have a getter for y component', () => {
    const vector = new Vector2({ x: 1, y: 2 });
    expect(vector.y).toBe(2);
  });

  it('should have a setter for y component', () => {
    const vector = new Vector2({ x: 1, y: 2 });
    vector.y = 3;
    expect(vector.y).toBe(3);
  });

  it('should return the length of the vector', () => {
    const vector = new Vector2({ x: 3, y: 4 });
    expect(vector.length()).toBe(5);
  });

  it('should multiply the vector by a factor', () => {
    const vector = new Vector2({ x: 1, y: 2 });
    const result = vector.multiply(3);
    expect(result.x).toBe(3);
    expect(result.y).toBe(6);
  });

  it('should normalize the vector', () => {
    const vector = new Vector2({ x: 3, y: 4 });
    const result = vector.normal();
    expect(result.x).toBeCloseTo(0.6);
    expect(result.y).toBeCloseTo(0.8);
  });

  it('should not normalize the vector if it has no length', () => {
    const vector = new Vector2({ x: 0, y: 0 });
    const result = vector.normal();
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  it('should add two vectors', () => {
    const vector1 = new Vector2({ x: 1, y: 2 });
    const vector2 = new Vector2({ x: 3, y: 4 });
    const result = vector1.add(vector2);
    expect(result.x).toBe(4);
    expect(result.y).toBe(6);
  });

  it('should subtract two vectors', () => {
    const vector1 = new Vector2({ x: 1, y: 2 });
    const vector2 = new Vector2({ x: 3, y: 4 });
    const result = vector1.subtract(vector2);
    expect(result.x).toBe(-2);
    expect(result.y).toBe(-2);
  });

  it('should calculate the dot product of two vectors', () => {
    const vector1 = new Vector2({ x: 1, y: 2 });
    const vector2 = new Vector2({ x: 3, y: 4 });
    expect(vector1.dot(vector2)).toBe(11);
  });

  it('should rotate the vector around 0,0', () => {
    const vector = new Vector2({ x: 0, y: 1 });
    const result = vector.rotate({ x: 0, y: 0 }, Math.PI);
    expect(result.x).toBeCloseTo(0);
    expect(result.y).toBeCloseTo(-1);
  });

  it('should rotate the vector around an origin', () => {
    const vector = new Vector2({ x: 0, y: 5 });
    const result = vector.rotate({ x: 5, y: 5 }, Math.PI);
    expect(result.x).toBeCloseTo(10);
    expect(result.y).toBeCloseTo(5);
  });
});
