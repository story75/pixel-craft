import { BinaryGrid } from './binary-grid';
import { Cell } from './flood-fill';

export type Room = {
  cells: Cell[];
  connections: Set<Room>;
  size: number;
  isMain?: boolean;
  canReachMain?: boolean;
};

/**
 * Connects rooms in a grid.
 *
 * @remarks
 * This will modify the grid in place.
 * To create rooms use {@link getRegions} and map the regions to {@link Room}.
 * It is recommended to cull small rooms before connecting them.
 *
 * @example
 * ```ts
 * const grid = randomGrid({...});
 * const regions = getRegions(grid, 0);
 * const rooms = regions.map((cells) => ({cells, connections: new Set(), size: cells.length}));
 * connectRooms(grid, rooms);
 * ```
 *
 * @param grid - The grid you want to use
 * @param rooms - The rooms you want to connect
 * @param forceConnection - If true, all rooms will be connected
 *
 * TODO: forceConnection does not seem to work as expected. Dungeon generation currently requires two calls to connectRooms.
 */
export function connectRooms(grid: BinaryGrid, rooms: Room[], forceConnection = false): void {
  let shortestDistance = 0;
  let bestCellA: Cell;
  let bestCellB: Cell;
  let bestRoomA: Room;
  let bestRoomB: Room;
  let foundConnection = false;

  const setReachable = (room: Room) => {
    if (room.canReachMain) {
      return;
    }
    room.canReachMain = true;
    room.connections.forEach((r) => setReachable(r));
  };

  const createConnection = () => {
    if (bestRoomA.canReachMain) {
      setReachable(bestRoomB);
    }
    if (bestRoomB.canReachMain) {
      setReachable(bestRoomA);
    }
    bestRoomA.connections.add(bestRoomB);
    bestRoomB.connections.add(bestRoomA);

    const line: Cell[] = [];

    let x = bestCellA.x;
    let y = bestCellA.y;

    const dX = bestCellB.x - bestCellA.x;
    const dY = bestCellB.y - bestCellA.y;

    let longest = Math.abs(dX);
    let shortest = Math.abs(dY);
    let step = Math.sign(dX);
    let gradientStep = Math.sign(dY);

    const inverted = longest < shortest;

    if (inverted) {
      longest = Math.abs(dY);
      shortest = Math.abs(dX);
      step = Math.sign(dY);
      gradientStep = Math.sign(dX);
    }

    let gA = longest / 2;
    for (let i = 0; i < longest; i++) {
      line.push({
        x,
        y,
        type: grid[x][y],
      });

      if (inverted) {
        y += step;
      } else {
        x += step;
      }

      gA += shortest;
      if (gA >= longest) {
        if (inverted) {
          x += gradientStep;
        } else {
          y += gradientStep;
        }
        gA -= longest;
      }
    }

    const r = 2;
    line.forEach((cell) => {
      for (let x = -r; x <= r; x++) {
        for (let y = -r; y <= r; y++) {
          const passageCell = grid[cell.x + x]?.[cell.y + y];
          if (passageCell) {
            grid[cell.x + x][cell.y + y] = 0;
          }
        }
      }
    });
  };

  let listA: Room[] = [];
  let listB: Room[] = [];

  if (forceConnection) {
    rooms.forEach((room) => {
      if (room.canReachMain) {
        listB.push(room);
      } else {
        listA.push(room);
      }
    });
  } else {
    listA = rooms;
    listB = rooms;
  }

  for (const roomA of listA) {
    if (!forceConnection) {
      foundConnection = false;
      if (roomA.connections.size > 0) {
        continue;
      }
    }

    for (const roomB of listB) {
      if (roomA === roomB || roomA.connections.has(roomB)) {
        continue;
      }

      roomA.cells.forEach((cellA) => {
        roomB.cells.forEach((cellB) => {
          const distance = Math.pow(cellA.x - cellB.x, 2) + Math.pow(cellA.y - cellB.y, 2);

          if (distance < shortestDistance || !foundConnection) {
            shortestDistance = distance;
            bestCellA = cellA;
            bestCellB = cellB;
            bestRoomA = roomA;
            bestRoomB = roomB;
            foundConnection = true;
          }
        });
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (foundConnection && !forceConnection) {
      createConnection();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (foundConnection && forceConnection) {
    createConnection();
    connectRooms(grid, rooms, true);
  }

  if (!forceConnection) {
    connectRooms(grid, rooms, true);
  }
}
