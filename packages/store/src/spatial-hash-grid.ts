import { mortonZOrder } from './morton-z-order';

type Hash = number | string;

type Metadata = {
  /**
   * The cells the entity is in where the key is the hash of the cell and the value is the index of the entity in the cell.
   */
  cells: Map<Hash, number>;
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export class SpatialHashGrid<T> {
  private readonly grid = new Map<Hash, T[]>();
  private readonly metadata = new Map<T, Metadata>();

  /**
   * @param cellSize - The size of the cells in the grid. The value is used to bit shift the x and y coordinates.
   * Think of it like every cell in the grid is a square with the size of 2^cellSize.
   *
   * @param hash - The hash function to use for the grid. By default, it uses the Morton Z-order curve.
   * You should not change this unless you know what you are doing.
   */
  constructor(
    public cellSize = 6,
    private readonly hash: (x: number, y: number) => Hash = mortonZOrder,
  ) {}

  public add(x: number, y: number, width: number, height: number, entity: T): T {
    const [left, top, right, bottom] = this.getCellBounds(x, y, width, height);
    const metadata: Metadata = {
      cells: new Map(),
      left,
      top,
      right,
      bottom,
    };
    this.metadata.set(entity, metadata);

    for (let i = left; i <= right; i++) {
      for (let j = top; j <= bottom; j++) {
        const hash = this.hash(i, j);
        const cell = this.grid.get(hash);

        if (!cell) {
          this.grid.set(hash, [entity]);
          metadata.cells.set(hash, 0);
        } else {
          cell.push(entity);
          metadata.cells.set(hash, cell.length - 1);
        }
      }
    }

    return entity;
  }

  update(x: number, y: number, width: number, height: number, entity: T): T {
    const metadata = this.metadata.get(entity);
    if (!metadata) {
      return entity;
    }

    const [left, top, right, bottom] = this.getCellBounds(x, y, width, height);
    if (metadata.left === left && metadata.top === top && metadata.right === right && metadata.bottom === bottom) {
      return entity;
    }

    this.remove(entity);
    return this.add(x, y, width, height, entity);
  }

  remove(entity: T): void {
    const metadata = this.metadata.get(entity);
    if (!metadata) {
      return;
    }

    for (const [hash, index] of metadata.cells) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const cell = this.grid.get(hash)!;
      const last = cell.at(-1) as T; // last is never undefined, because the list can never be empty here
      if (last !== entity) {
        cell[index] = last;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.metadata.get(last)!.cells.set(hash, index);
      }
      cell.pop();
    }

    this.metadata.delete(entity);
  }

  clear(): void {
    this.grid.clear();
    this.metadata.clear();
  }

  query(x: number, y: number, width: number, height: number): T[] {
    const [left, top, right, bottom] = this.getCellBounds(x, y, width, height);
    const entities = new Set<T>();

    for (let i = left; i <= right; i++) {
      for (let j = top; j <= bottom; j++) {
        const hash = this.hash(i, j);
        const cell = this.grid.get(hash);
        if (cell) {
          for (const entity of cell) {
            entities.add(entity);
          }
        }
      }
    }

    return Array.from(entities);
  }

  forEach(callback: (cell: T[]) => void): void {
    this.grid.forEach(callback);
  }

  private getCellBounds(
    x: number,
    y: number,
    width: number,
    height: number,
  ): [left: number, top: number, right: number, bottom: number] {
    const left = x >> this.cellSize;
    const top = y >> this.cellSize;
    const right = (x + width) >> this.cellSize;
    const bottom = (y + height) >> this.cellSize;
    return [left, top, right, bottom];
  }
}
