import { Vector2 } from './vector2';

export type Node<T> = { key: string; value: T; neighbors: Node<T>[] };
export type Graph<T> = Map<string, Node<T>>;

export const getNodeKey = (x: number, y: number): string => `${x},${y}`;

export const parseNodeKey = (key: string): Vector2 => {
  const values = key.split(',');
  if (values.length !== 2) {
    throw new Error('Unable to parse key. Invalid key provided');
  }
  try {
    return {
      x: parseInt(values[0], 10),
      y: parseInt(values[1], 10),
    };
  } catch (error) {
    throw new Error('Unable to parse node key. Invalid coordinate');
  }
};

export const getNode = <T>(
  graph: Graph<T>,
  x: number,
  y: number
): Node<T> | undefined => {
  const key = getNodeKey(x, y);
  return graph.get(key);
};

export const createGraph = <T>(grid: T[][]): Graph<T> => {
  const height = grid.length;
  const width = grid[0].length;

  const graph: Graph<T> = new Map();

  const directions: Vector2[] = [
    { x: 0, y: -1 }, // up
    { x: 0, y: 1 }, // down
    { x: -1, y: 0 }, // left
    { x: 1, y: 0 }, // right
  ];

  // create nodes
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      const key = getNodeKey(x, y);
      const node: Node<T> = { key, value: grid[y][x], neighbors: [] };
      graph.set(key, node);
    }
  }

  // establish edges
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      const key = getNodeKey(x, y);
      const node = graph.get(key);

      if (!node) {
        continue;
      }

      for (const dir of directions) {
        const neighborX = x + dir.x;
        const neighborY = y + dir.y;

        if (
          neighborX >= 0 &&
          neighborX < width &&
          neighborY >= 0 &&
          neighborY < height
        ) {
          const neighborKey = getNodeKey(neighborX, neighborY);
          const neighborNode = graph.get(neighborKey);
          if (neighborNode) {
            node.neighbors.push(neighborNode);
          }
        }
      }
    }
  }

  return graph;
};

export type TraversalParams<T> = {
  graph: Graph<T>;
  startKey: string;
  target?: number;
  predicate?: (current: Node<T>, neighbor: Node<T>) => boolean;
};

export const graphBFS = <T>({
  graph,
  startKey,
  target,
  predicate,
}: TraversalParams<T>): Node<T>[] => {
  const queue: { node: Node<T>; path: Node<T>[] }[] = [];
  const visited = new Set<Node<T>>();

  const startNode = graph.get(startKey);
  if (!startNode) {
    return [];
  }

  queue.push({ node: startNode, path: [startNode] });
  visited.add(startNode);

  while (queue.length > 0) {
    const { node: current, path } = queue.shift()!;

    if (target !== undefined && current.value === target) {
      return path;
    }

    // visit neighbors
    for (const neighbor of current.neighbors) {
      if (
        !visited.has(neighbor) &&
        (predicate === undefined || predicate(current, neighbor))
      ) {
        queue.push({ node: neighbor, path: [...path, neighbor] });
        visited.add(neighbor);
      }
    }
  }

  return Array.from(visited);
};

export const graphDFS = <T>({
  graph,
  startKey,
  target,
  predicate,
}: TraversalParams<T>): Node<T>[] => {
  const stack: { node: Node<T>; path: Node<T>[] }[] = [];
  const visited = new Set<Node<T>>();

  const startNode = graph.get(startKey);
  if (!startNode) {
    return [];
  }

  stack.push({ node: startNode, path: [startNode] });
  visited.add(startNode);

  while (stack.length > 0) {
    const { node: current, path } = stack.pop()!;

    if (target !== undefined && current.value === target) {
      return path;
    }

    //visit neighbors
    for (const neighbor of current.neighbors) {
      if (
        !visited.has(neighbor) &&
        (predicate === undefined || predicate(current, neighbor))
      ) {
        stack.push({ node: neighbor, path: [...path, neighbor] });
        visited.add(neighbor);
      }
    }
  }

  return Array.from(visited);
};

export const findAllPaths = <T>({
  graph,
  startKey,
  target,
  predicate,
}: {
  graph: Graph<T>;
  startKey: string;
  target?: number;
  predicate: (current: Node<T>, neighbor: Node<T>) => boolean;
}) => {
  const startNode = graph.get(startKey);
  if (!startNode) {
    return [];
  }

  const allPaths: Node<T>[][] = [];

  const dfs = (current: Node<T>, path: Node<T>[]) => {
    const newPath = [...path, current];

    if (target === undefined || current.value === target) {
      allPaths.push(newPath);
    }

    for (const neighbor of current.neighbors) {
      if (!path.includes(neighbor) && predicate(current, neighbor)) {
        dfs(neighbor, newPath);
      }
    }
  };

  dfs(startNode, []);

  return allPaths;
};

export const arePathsEqual = <T>(
  path1: Node<T>[],
  path2: Node<T>[]
): boolean => {
  const set1 = new Set(path1.map((node) => node.key));
  const set2 = new Set(path2.map((node) => node.key));

  if (set1.size !== set2.size) {
    return false;
  }

  for (const key of set1) {
    if (!set2.has(key)) {
      return false;
    }
  }

  return true;
};
