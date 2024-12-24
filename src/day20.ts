import { readFileContents } from './utils/file';
import { createGraph, dijkstra, getNode, Node } from './utils/graph';
import { printGrid } from './utils/utils';
import { Vector2 } from './utils/vector2';

type Data = {
  grid: string[][];
  walls: Vector2[];
  width: number;
  height: number;
  start: Vector2;
  end: Vector2;
};

const parseFileContents = (fileContents: string): Data => {
  const grid = fileContents.split('\n').map((line) => line.split(''));
  const width = grid[0].length;
  const height = grid.length;

  const start = { x: -1, y: -1 };
  const end = { x: -1, y: -1 };
  const walls: Vector2[] = [];

  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      const tile = grid[y][x];

      if (tile === 'S') {
        start.x = x;
        start.y = y;
      } else if (tile === 'E') {
        end.x = x;
        end.y = y;
      } else if (tile === '#') {
        walls.push({ x, y });
      }
    }
  }

  return { grid, walls, width, height, start, end };
};

export const findPathWithCheating = ({
  originalPath,
  cheat,
  canTraverse,
}: {
  originalPath: Node<string>[];
  cheat: Node<string>;
  canTraverse: (node: Node<string>) => boolean;
}): Node<string>[] => {
  const cheatPath: Node<string>[] = [];
  let cheatStepsRemaining = 0;

  for (let i = 0; i < originalPath.length; i++) {
    const currentNode = originalPath[i];

    // Add the current node to the cheat path
    cheatPath.push(currentNode);

    // If cheat is active, decrement the remaining cheat steps
    if (cheatStepsRemaining > 0) {
      cheatStepsRemaining -= 1;
    }

    // Check if the current node is adjacent to the cheat wall and activate cheat
    if (
      cheatStepsRemaining === 0 &&
      currentNode.neighbors.includes(cheat) &&
      !canTraverse(cheat)
    ) {
      cheatStepsRemaining = 2; // Activate cheating for the next two iterations
    }

    // If cheating is active, try to find the next node in the path after skipping the wall
    if (cheatStepsRemaining > 0) {
      const cheatNeighbor = cheat.neighbors.find((neighbor) =>
        originalPath.includes(neighbor)
      );

      if (cheatNeighbor) {
        // Skip directly to the neighbor of the cheat wall in the original path
        const nextIndex = originalPath.indexOf(cheatNeighbor);
        if (nextIndex !== -1) {
          i = nextIndex - 1; // -1 to account for the loop increment
        }
      }
    }
  }

  return cheatPath;
};

const getOriginalPath = (data: Data): Node<string>[] => {
  const graph = createGraph(data.grid);
  const path = dijkstra({
    graph,
    start: data.start,
    end: data.end,
    canTraverse: (node) => node.value !== '#',
  });

  return path;
};

const getPathsByCheating = (
  originalPath: Node<string>[],
  data: Data
): Node<string>[][] => {
  const results: Node<string>[][] = [];

  const graph = createGraph(data.grid);

  for (const wall of data.walls) {
    // Can't cheat if wall is on the border of grid
    if (
      wall.x === 0 ||
      wall.y === 0 ||
      wall.x >= data.width ||
      wall.y >= data.height
    ) {
      continue;
    }
    const path = findPathWithCheating({
      originalPath,
      cheat: getNode(graph, wall.x, wall.y)!,
      canTraverse: (node) => node.value !== '#',
    });
    results.push(path);
  }

  return results;
};

const solvePartOne = (data: Data): number => {
  printGrid(data.grid);

  const originalPath = getOriginalPath(data);
  const pathsByCheating = getPathsByCheating(originalPath, data);

  const times: Map<number, number> = new Map();
  pathsByCheating.forEach((path) => {
    const length = path.length;
    const count = times.get(length) || 0;
    times.set(length, count + 1);
  });

  console.log(times);

  return 0;
};

const solvePartTwo = (data: Data): number => {
  let total = 0;
  return total;
};

const main = () => {
  const filename = 'day20/test.txt';
  const fileContents = readFileContents(filename);
  const parsedData = parseFileContents(fileContents);

  const partOne = solvePartOne(parsedData);
  console.log({ partOne });

  const partTwo = solvePartTwo(parsedData);
  console.log({ partTwo });
};

main();
