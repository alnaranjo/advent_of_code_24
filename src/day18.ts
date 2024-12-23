import { readFileContents } from './utils/file';
import { Vector2 } from './utils/vector2';
import { createGraph, findAllPaths, dijkstra } from './utils/graph';

type Data = {
  corruptedMemory: Vector2[];
  width: number;
  height: number;
};

// From problem statement: https://adventofcode.com/2024/day/18
const getMemorySpace = (filename: string): Vector2 => {
  if (filename.includes('test.txt')) {
    return { x: 7, y: 7 };
  }
  return { x: 71, y: 71 };
};

const parseFileContents = (filename: string): Data => {
  const fileContents = readFileContents(filename);

  const corruptedMemory = fileContents.split('\n').map((line) => {
    const components = line.split(',').map((item) => parseInt(item, 10));
    return { x: components[0], y: components[1] };
  });

  const memorySpace = getMemorySpace(filename);

  return { corruptedMemory, width: memorySpace.x, height: memorySpace.y };
};

const simulateMemoryCorruption = ({
  data,
  iterations,
}: {
  data: Data;
  iterations: number;
}): string[][] => {
  const grid: string[][] = new Array(data.height)
    .fill('.')
    .map(() => new Array(data.width).fill('.'));

  for (let i = 0; i < iterations; ++i) {
    const corruptedLocation = data.corruptedMemory[i];
    grid[corruptedLocation.y][corruptedLocation.x] = '#';
  }

  return grid;
};

const printGrid = (grid: string[][]) => {
  const height = grid.length;
  const width = grid[0].length;

  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      const tile = grid[y][x];
      process.stdout.write(tile);
    }
    console.log();
  }
  console.log();
};

const solvePartOne = (data: Data): number => {
  console.log(data);

  const memory = simulateMemoryCorruption({ data, iterations: 1024 });
  const graph = createGraph(memory);
  const path = dijkstra({
    graph,
    start: { x: 0, y: 0 },
    end: { x: data.width - 1, y: data.height - 1 },
    canTraverse: (node) => node.value !== '#',
  });

  // Don't count the start node
  return path.length - 1;
};

const solvePartTwo = (data: Data): number => {
  const total = 0;
  return total;
};

const main = () => {
  const filename = 'day18/data.txt';
  const parsedData = parseFileContents(filename);

  const partOne = solvePartOne(parsedData);
  console.log({ partOne });

  const partTwo = solvePartTwo(parsedData);
  console.log({ partTwo });
};

main();
