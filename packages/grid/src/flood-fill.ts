import { BinaryGrid } from './binary-grid';

/**
 * Basic cell definition to work with tile processing inside flood fill
 */
export type Cell = {
  /**
   * x coordinate of the tile
   */
  x: number;

  /**
   * y coordinate of the tile
   */
  y: number;

  /**
   * Type of the tile.
   */
  type: 0 | 1;
};

/**
 * Create a unique id string for a cell
 *
 * @remarks
 * Because objects in Sets are compared by identity we cannot create a similar looking object
 * and compare against the value in the set.
 * If we instead use string identifiers we can create new strings and compare for equality that way.
 *
 * @param c - The cell you want to create the key for
 */
function cellIndex(c: Cell) {
  return `${c.x}:${c.y}`;
}

/**
 * Process a room from the start cell until every connected cell of the same type was visited.
 *
 * @remarks
 * Every cell is only visited once.
 *
 * @param grid - The grid to analyse
 * @param startCell - The cell to start on
 *
 * @returns List of every cell in this room
 */
function getRegion(grid: BinaryGrid, startCell: Cell): Cell[] {
  const cells: Cell[] = [];
  const queue: Cell[] = [];
  const processed = new Set<string>();
  const type = startCell.type;

  queue.push(startCell);
  processed.add(cellIndex(startCell));

  while (queue.length > 0) {
    // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
    const current = queue.pop() as Cell;
    cells.push(current);

    for (let cX = -1; cX <= 1; cX++) {
      for (let cY = -1; cY <= 1; cY++) {
        if (Math.abs(cX) === Math.abs(cY)) {
          continue;
        }
        const cell = {
          x: current.x + cX,
          y: current.y + cY,
          type: grid[current.x + cX]?.[current.y + cY],
        };
        if (!processed.has(cellIndex(cell)) && cell.type === type) {
          processed.add(cellIndex(cell));
          queue.push(cell);
        }
      }
    }
  }

  return cells;
}

/**
 * Process a grid to find every room of the same tile type.
 *
 * @see {@link https://en.wikipedia.org/wiki/Flood_fill}
 *
 * @remarks
 * Every cell is only visited once.
 * Once a cell is visited, which was not yet processed,
 * it's delegated to {@link getRegion} because it's the indicator for a new room.
 *
 * Once a room was evaluated every room tile is added to the processed cache.
 *
 * @param grid - The grid you want to analyse
 * @param searchType - The type of tiles you want to visit
 *
 * @returns List of every room which in turn contains every cell of the room
 */
export function floodFill(grid: BinaryGrid, searchType: Cell['type']): Cell[][] {
  const regions: Cell[][] = [];
  const processed = new Set<string>();
  const gridWidth = grid.length;
  const gridHeight = grid[0].length;

  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      const cell = {
        x,
        y,
        type: grid[x][y],
      };

      if (processed.has(cellIndex(cell)) || cell.type !== searchType) {
        continue;
      }

      const region = getRegion(grid, cell);
      regions.push(region);
      region.forEach((c) => processed.add(cellIndex(c)));
    }
  }

  return regions;
}
