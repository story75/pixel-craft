import { describe, expect, it } from 'bun:test';
import { SpatialHashGrid } from './spatial-hash-grid';

type Entity = {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

describe('SpatialHashGrid', () => {
  it('can add, update, remove and query entities', () => {
    const grid = new SpatialHashGrid<Entity>();
    const singleCellSize = (1 << grid.cellSize) - 1;

    // spans only 1 cell
    const a: Entity = {
      name: 'a',
      x: 0,
      y: 0,
      width: singleCellSize,
      height: singleCellSize,
    };
    // spans 4 cells, overlaps with a
    const b: Entity = {
      name: 'b',
      x: singleCellSize / 2,
      y: singleCellSize / 2,
      width: singleCellSize,
      height: singleCellSize,
    };
    // spans 1 cell, does not overlap with a or b
    const c: Entity = {
      name: 'c',
      x: 5 << grid.cellSize,
      y: 5 << grid.cellSize,
      width: singleCellSize,
      height: singleCellSize,
    };

    grid.add(a.x, a.y, a.width, a.height, a);
    grid.add(b.x, b.y, b.width, b.height, b);
    grid.add(c.x, c.y, c.width, c.height, c);

    // query by cells
    const cells = [];
    grid.forEach((cell) => {
      cells.push(cell);
    });
    expect(cells).toEqual([[a, b], [b], [b], [b], [c]]);

    // query by area
    const searchCell0 = grid.query(0, 0, singleCellSize, singleCellSize);
    expect(searchCell0).toEqual([a, b]);

    const searchCell1 = grid.query(
      singleCellSize + 1,
      0,
      singleCellSize,
      singleCellSize,
    );
    expect(searchCell1).toEqual([b]);

    const searchAll = grid.query(0, 0, 5 << grid.cellSize, 5 << grid.cellSize);
    expect(searchAll).toEqual([a, b, c]);

    // move b into a new cell, now overlapping with c
    grid.update(
      (4 << grid.cellSize) + singleCellSize / 2,
      (4 << grid.cellSize) + singleCellSize / 2,
      b.width,
      b.height,
      b,
    );

    // re-query by cells
    const cellsAfterUpdate: Entity[][] = [];
    grid.forEach((cell) => {
      cellsAfterUpdate.push(cell);
    });
    expect(cellsAfterUpdate.filter((c) => c.length)).toEqual([
      [a],
      [c, b],
      [b],
      [b],
      [b],
    ]);
    // re-query by area
    const searchUpdatedCell0 = grid.query(0, 0, singleCellSize, singleCellSize);
    expect(searchUpdatedCell0).toEqual([a]);

    const searchUpdatedCell1 = grid.query(
      singleCellSize + 1,
      0,
      singleCellSize,
      singleCellSize,
    );
    expect(searchUpdatedCell1).toEqual([]);

    const searchUpdatedAll = grid.query(
      0,
      0,
      5 << grid.cellSize,
      5 << grid.cellSize,
    );
    expect(searchUpdatedAll).toEqual([a, b, c]);

    // remove b
    grid.remove(b);
    // re-query by cells
    const cellsAfterRemove: Entity[][] = [];
    grid.forEach((cell) => {
      cellsAfterRemove.push(cell);
    });
    expect(cellsAfterRemove.filter((c) => c.length)).toEqual([[a], [c]]);
    // re-query by area
    const searchRemovedCell0 = grid.query(0, 0, singleCellSize, singleCellSize);
    expect(searchRemovedCell0).toEqual([a]);

    const searchRemovedCell1 = grid.query(
      singleCellSize + 1,
      0,
      singleCellSize,
      singleCellSize,
    );
    expect(searchRemovedCell1).toEqual([]);

    const searchRemovedAll = grid.query(
      0,
      0,
      5 << grid.cellSize,
      5 << grid.cellSize,
    );
    expect(searchRemovedAll).toEqual([a, c]);

    // clear all
    grid.clear();
    // re-query by cells
    const cellsAfterClear: Entity[][] = [];
    grid.forEach((cell) => {
      cellsAfterClear.push(cell);
    });
    expect(cellsAfterClear.filter((c) => c.length)).toEqual([]);
    // re-query by area
    const searchClearedCell0 = grid.query(0, 0, singleCellSize, singleCellSize);
    expect(searchClearedCell0).toEqual([]);

    const searchClearedAll = grid.query(
      0,
      0,
      5 << grid.cellSize,
      5 << grid.cellSize,
    );
    expect(searchClearedAll).toEqual([]);
  });
});
