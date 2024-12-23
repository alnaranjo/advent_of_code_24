import { readFileContents } from './utils/file';
import { createGraph, dijkstra } from './utils/graph';
import { Vector2 } from './utils/vector2';

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

  for (let i = 0; i <= iterations; ++i) {
    const corruptedLocation = data.corruptedMemory[i];
    grid[corruptedLocation.y][corruptedLocation.x] = '#';
  }

  return grid;
};

const solvePartOne = (data: Data): number => {
  const memory = simulateMemoryCorruption({ data, iterations: 1023 });
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

const solvePartTwo = (data: Data): string => {
  for (let i = 0; i < data.corruptedMemory.length; ++i) {
    const memory = simulateMemoryCorruption({ data, iterations: i });

    const graph = createGraph(memory);
    const path = dijkstra({
      graph,
      start: { x: 0, y: 0 },
      end: { x: data.width - 1, y: data.height - 1 },
      canTraverse: (node) => node.value !== '#',
    });

    if (path.length === 0) {
      const badLocation = data.corruptedMemory[i];
      return `${badLocation.x},${badLocation.y}`;
    }
  }

  // Don't count the start node
  return '';
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
