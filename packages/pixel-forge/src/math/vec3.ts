export type Vec3 = [number, number, number] | Float32Array;

export function normalize(v: Readonly<Vec3>): Vec3 {
  const [x, y, z] = v;
  const l = length(v);
  return [x / l, y / l, z / l];
}

export function length(v: Readonly<Vec3>): number {
  const [x, y, z] = v;
  return Math.sqrt(x * x + y * y + z * z);
}

export function subtract(a: Readonly<Vec3>, b: Readonly<Vec3>): Vec3 {
  const [ax, ay, az] = a;
  const [bx, by, bz] = b;
  return [ax - bx, ay - by, az - bz];
}

export function cross(a: Readonly<Vec3>, b: Readonly<Vec3>): Vec3 {
  const [ax, ay, az] = a;
  const [bx, by, bz] = b;
  return [ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx];
}

export function dot(a: Readonly<Vec3>, b: Readonly<Vec3>): number {
  const [ax, ay, az] = a;
  const [bx, by, bz] = b;
  return ax * bx + ay * by + az * bz;
}