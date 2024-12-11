import { Vector2 } from './vector2';

export type Node = { key: string; value: number; neighbors: Node[] };
export type Graph = Map<string, Node>;

export const getNodeKey = (x: number, y: number): string => `${x},${y}`;

export const getNode = (
  graph: Graph,
  x: number,
  y: number
): Node | undefined => {
  const key = getNodeKey(x, y);
  return graph.get(key);
};

export const createGraph = (grid: number[][]): Graph => {
  const height = grid.length;
  const width = grid[0].length;

  const graph: Graph = new Map();

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
      const node: Node = { key, value: grid[y][x], neighbors: [] };
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

export type TraversalParams = {
  graph: Graph;
  startKey: string;
  target?: number;
  predicate?: (current: Node, neighbor: Node) => boolean;
};

export const graphBFS = ({
  graph,
  startKey,
  target,
  predicate,
}: TraversalParams): Node[] => {
  const queue: { node: Node; path: Node[] }[] = [];
  const visited = new Set<Node>();

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

  return [];
};

export const graphDFS = ({
  graph,
  startKey,
  target,
  predicate,
}: TraversalParams): Node[] => {
  const stack: { node: Node; path: Node[] }[] = [];
  const visited = new Set<Node>();

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

  return [];
};

export const findAllPaths = ({
  graph,
  startKey,
  target,
  predicate,
}: {
  graph: Graph;
  startKey: string;
  target: number;
  predicate: (current: Node, neighbor: Node) => boolean;
}) => {
  const startNode = graph.get(startKey);
  if (!startNode) {
    return [];
  }

  const allPaths: Node[][] = [];

  const dfs = (current: Node, path: Node[]) => {
    const newPath = [...path, current];

    if (current.value === target) {
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
