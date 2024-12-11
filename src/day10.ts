import { readFileContents } from './utils/file';
import { createGraph, findAllPaths, getNodeKey, Node } from './utils/graph';
import { Vector2 } from './utils/vector2';

type Data = {
  map: number[][];
  width: number;
  height: number;
  trailHeads: Vector2[];
};

const parseFileContents = (fileContents: string): Data => {
  const map = fileContents
    .split('\n')
    .map((line) => line.split('').map((item) => parseInt(item, 10)));

  const width = map[0].length;
  const height = map.length;

  const trailHeads: Vector2[] = [];
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      if (map[y][x] === 0) {
        trailHeads.push({ x, y });
      }
    }
  }

  return { map, width, height, trailHeads };
};

const predicate = (current: Node, neighbor: Node): boolean => {
  return neighbor.value - 1 === current.value;
};

const getScoreForPaths = (paths: Node[][]): number => {
  const uniqueKeys = new Set<string>();
  paths.forEach((path) => {
    const lasNode = path[path.length - 1];
    uniqueKeys.add(lasNode.key);
  });

  return uniqueKeys.size;
};

const solvePartOne = (data: Data): number => {
  const graph = createGraph(data.map);
  const trailHeads = data.trailHeads;

  let total = 0;
  for (const trailHead of trailHeads) {
    const startKey = getNodeKey(trailHead.x, trailHead.y);
    const allPaths = findAllPaths({ graph, startKey, target: 9, predicate });
    total += getScoreForPaths(allPaths);
  }

  return total;
};

const solvePartTwo = (data: Data): number => {
  const graph = createGraph(data.map);
  const trailHeads = data.trailHeads;

  let total = 0;
  for (const trailHead of trailHeads) {
    const startKey = getNodeKey(trailHead.x, trailHead.y);
    const allPaths = findAllPaths({ graph, startKey, target: 9, predicate });
    total += allPaths.length;
  }

  return total;
};

const main = () => {
  const filename = 'day10/data.txt';
  const fileContents = readFileContents(filename);
  const parsedData = parseFileContents(fileContents);

  const partOne = solvePartOne(parsedData);
  console.log({ partOne });

  const partTwo = solvePartTwo(parsedData);
  console.log({ partTwo });
};

main();
