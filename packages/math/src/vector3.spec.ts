import { describe, expect, it } from 'bun:test';
import { Vector3 } from './vector3';

describe('Vector3', () => {
  it('should create a vector with x, y and z components', () => {
    const vector = new Vector3({ x: 1, y: 2, z: 3 });
    expect(vector.x).toBe(1);
    expect(vector.y).toBe(2);
    expect(vector.z).toBe(3);
  });

  it('should have a getter for x component', () => {
    const vector = new Vector3({ x: 1, y: 2, z: 3 });
    expect(vector.x).toBe(1);
  });

  it('should have a setter for x component', () => {
    const vector = new Vector3({ x: 1, y: 2, z: 3 });
    vector.x = 4;
    expect(vector.x).toBe(4);
  });

  it('should have a getter for y component', () => {
    const vector = new Vector3({ x: 1, y: 2, z: 3 });
    expect(vector.y).toBe(2);
  });

  it('should have a setter for y component', () => {
    const vector = new Vector3({ x: 1, y: 2, z: 3 });
    vector.y = 4;
    expect(vector.y).toBe(4);
  });

  it('should have a getter for z component', () => {
    const vector = new Vector3({ x: 1, y: 2, z: 3 });
    expect(vector.z).toBe(3);
  });

  it('should have a setter for z component', () => {
    const vector = new Vector3({ x: 1, y: 2, z: 3 });
    vector.z = 4;
    expect(vector.z).toBe(4);
  });

  it('should return the length of the vector', () => {
    const vector = new Vector3({ x: 3, y: 4, z: 5 });
    expect(vector.length()).toBeCloseTo(7.071, 3);
  });

  it('should multiply the vector by a factor', () => {
    const vector = new Vector3({ x: 1, y: 2, z: 3 });
    const result = vector.multiply(3);
    expect(result.x).toBe(3);
    expect(result.y).toBe(6);
    expect(result.z).toBe(9);
  });

  it('should normalize the vector', () => {
    const vector = new Vector3({ x: 3, y: 4, z: 5 });
    const result = vector.normal();
    expect(result.x).toBeCloseTo(0.424, 3);
    expect(result.y).toBeCloseTo(0.566, 3);
    expect(result.z).toBeCloseTo(0.707, 3);
  });

  it('should not normalize the vector if it has no length', () => {
    const vector = new Vector3({ x: 0, y: 0, z: 0 });
    const result = vector.normal();
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
    expect(result.z).toBe(0);
  });

  it('should add two vectors', () => {
    const vector1 = new Vector3({ x: 1, y: 2, z: 3 });
    const vector2 = new Vector3({ x: 4, y: 5, z: 6 });
    const result = vector1.add(vector2);
    expect(result.x).toBe(5);
    expect(result.y).toBe(7);
    expect(result.z).toBe(9);
  });

  it('should subtract two vectors', () => {
    const vector1 = new Vector3({ x: 1, y: 2, z: 3 });
    const vector2 = new Vector3({ x: 4, y: 5, z: 6 });
    const result = vector1.subtract(vector2);
    expect(result.x).toBe(-3);
    expect(result.y).toBe(-3);
    expect(result.z).toBe(-3);
  });

  it('should calculate the dot product of two vectors', () => {
    const vector1 = new Vector3({ x: 1, y: 2, z: 3 });
    const vector2 = new Vector3({ x: 4, y: 5, z: 6 });
    expect(vector1.dot(vector2)).toBe(32);
  });

  it('should calculate the cross product of two vectors', () => {
    const vector1 = new Vector3({ x: 1, y: 2, z: 3 });
    const vector2 = new Vector3({ x: 4, y: 5, z: 6 });
    const result = vector1.cross(vector2);
    expect(result.x).toBe(-3);
    expect(result.y).toBe(6);
    expect(result.z).toBe(-3);
  });
});
