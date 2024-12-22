import { readFileContents } from './utils/file';
import { MinHeap } from './utils/minHeap';
import {
  createGraph,
  getNode,
  getNodeKey,
  Graph,
  Node,
  parseNodeKey,
} from './utils/graph';
import { Vector2 } from './utils/vector2';

type Data = {
  map: string[][];
  start: Vector2;
  end: Vector2;
  initialDirection: Direction;
};

type Direction = 'N' | 'S' | 'E' | 'W';

const DirectionLabels: Record<Direction, string> = {
  N: '^',
  S: 'v',
  E: '>',
  W: '<',
};

const getDirectionLabel = (direction: Vector2): string => {
  const { x, y } = direction;

  if (x == 0 && y == -1) {
    return DirectionLabels['N'];
  }

  if (x == 0 && y == 1) {
    return DirectionLabels['S'];
  }

  if (x == 1 && y == 0) {
    return DirectionLabels['E'];
  }

  if (x == -1 && y == 0) {
    return DirectionLabels['W'];
  }

  return '';
};

const determineDirection = (
  fromNode: Node<string>,
  toNode: Node<string>
): Direction => {
  const from = parseNodeKey(fromNode.key);
  const to = parseNodeKey(toNode.key);

  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (dx === 1) return 'E'; // Moving East
  if (dx === -1) return 'W'; // Moving West
  if (dy === 1) return 'S'; // Moving South
  if (dy === -1) return 'N'; // Moving North

  throw new Error('Invalid move direction');
};

const canTraverse = (node: Node<string>) => node.value !== '#';

const getCost = (
  fromNode: Node<string>,
  toNode: Node<string>,
  currentDirection: Direction
): number => {
  const nextDirection = determineDirection(fromNode, toNode);

  const directionOrder: Direction[] = ['N', 'E', 'S', 'W'];
  const currentIndex = directionOrder.indexOf(currentDirection);
  const nextIndex = directionOrder.indexOf(nextDirection);

  const clockwiseRotations = (nextIndex - currentIndex + 4) % 4;
  const counterClockwiseRotations = (currentIndex - nextIndex + 4) % 4;

  const minimalRotations = Math.min(
    clockwiseRotations,
    counterClockwiseRotations
  );

  return 1 + minimalRotations * 1000;
};

type Path = { path: Node<string>[]; cost: number };

const findBestPath = ({
  graph,
  start,
  end,
  initialDirection,
  canTraverse,
  getCost,
}: {
  graph: Graph<string>;
  start: { x: number; y: number };
  end: { x: number; y: number };
  initialDirection: Direction;
  canTraverse: (node: Node<string>) => boolean;
  getCost: (
    fromNode: Node<string>,
    toNode: Node<string>,
    currentDirection: Direction
  ) => number;
}): Path => {
  const startKey = getNodeKey(start.x, start.y);
  const endKey = getNodeKey(end.x, end.y);

  const distances: Map<string, number> = new Map();
  const previous: Map<string, { key: string; direction: Direction }> =
    new Map();

  const priorityQueue = new MinHeap<{
    key: string;
    distance: number;
    direction: Direction;
  }>((a, b) => a.distance - b.distance);

  // graph.forEach((_, key) => {
  //   distances.set(key, Number.MAX_SAFE_INTEGER);
  //   previous.set(key, null);
  // });

  distances.set(`${startKey}:${initialDirection}`, 0);
  priorityQueue.push({
    key: startKey,
    distance: 0,
    direction: initialDirection,
  });

  let bestCost = Number.MAX_SAFE_INTEGER;
  let bestPath: Node<string>[] = [];

  while (priorityQueue.size() > 0) {
    // sort queue by lowest distance
    const current = priorityQueue.pop()!;
    // const stateKey = `${current.key}:${current.direction}`;

    // if (distances.has(stateKey)) {
    //   continue;
    // }

    // Path found, reconstrtuct path
    if (current.key === endKey) {
      let backtrack = { key: endKey, direction: current.direction };

      const path: Node<string>[] = [];

      while (backtrack) {
        const position = parseNodeKey(backtrack.key);
        const node = getNode(graph, position.x, position.y);
        if (node) {
          path.push(node);
        }
        backtrack = previous.get(`${backtrack.key}:${backtrack.direction}`)!;
      }

      console.log({ distance: current.distance });

      if (current.distance < bestCost) {
        bestCost = current.distance;
        bestPath = path;
      }
      continue;
    }

    const currentPosition = parseNodeKey(current.key);
    const currentNode = getNode(graph, currentPosition.x, currentPosition.y);

    if (!currentNode) {
      continue;
    }

    // Process neighbors
    for (const neighbor of currentNode.neighbors) {
      if (!canTraverse(neighbor)) {
        continue;
      }

      const stepCost = getCost(currentNode, neighbor, current.direction);
      const nextDirection = determineDirection(currentNode, neighbor);

      const newDistance = current.distance + stepCost;
      const neighborStateKey = `${neighbor.key}:${nextDirection}`;

      if (
        !distances.has(neighborStateKey) ||
        newDistance < distances.get(neighborStateKey)!
      ) {
        distances.set(neighborStateKey, newDistance);
        previous.set(neighborStateKey, {
          key: current.key,
          direction: current.direction,
        });
        priorityQueue.push({
          key: neighbor.key,
          distance: newDistance,
          direction: nextDirection,
        });
      }
    }
  }

  return { path: bestPath, cost: bestCost };
};

const parseFileContents = (fileContents: string): Data => {
  const map = fileContents.split('\n').map((line) => line.split(''));

  const width = map[0].length;
  const height = map.length;

  const start = { x: -1, y: -1 };
  const end = { x: -1, y: -1 };

  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      const tile = map[y][x];
      if (tile === 'S') {
        start.x = x;
        start.y = y;
      } else if (tile === 'E') {
        end.x = x;
        end.y = y;
      }
    }
  }

  return { map, start, end, initialDirection: 'E' };
};

const printMap = (map: string[][]) => {
  const height = map.length;
  const width = map[0].length;

  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      const tile = map[y][x];
      process.stdout.write(tile);
    }
    console.log();
  }
  console.log();
};

const solvePartOne = (data: Data): number => {
  printMap(data.map);

  const graph = createGraph(data.map);
  const path = findBestPath({
    graph,
    start: data.start,
    end: data.end,
    initialDirection: data.initialDirection,
    canTraverse,
    getCost,
  });

  console.log({ path });

  const total = 0;
  return total;
};

const solvePartTwo = (data: Data): number => {
  const total = 0;
  return total;
};

const main = () => {
  const filename = 'day16/data.txt';
  const fileContents = readFileContents(filename);
  const parsedData = parseFileContents(fileContents);

  const partOne = solvePartOne(parsedData);
  console.log({ partOne });

  const partTwo = solvePartTwo(parsedData);
  console.log({ partTwo });
};

main();
