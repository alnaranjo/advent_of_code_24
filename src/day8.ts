import { permission } from 'process';
import { readFileContents } from './utils/file';

type Vector2 = {
  x: number;
  y: number;
};

type Data = {
  antenas: Map<string, Vector2[]>;
  width: number;
  height: number;
  grid: string[][];
};

const regex = /^[a-zA-Z0-9]+$/;

const parseFileContents = (fileContents: string): Data => {
  const grid = fileContents.split('\n').map((line) => line.split(''));
  const height = grid.length;
  const width = grid[0].length;

  const antenas: Map<string, Vector2[]> = new Map();

  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      const tile = grid[y][x];
      if (regex.test(tile)) {
        const coordinates = antenas.get(tile) || [];
        coordinates.push({ x, y });
        antenas.set(tile, coordinates);
      }
    }
  }

  return { antenas, width, height, grid };
};

function getPermutations(vectors: Vector2[]): [Vector2, Vector2][] {
  const uniquePairs: [Vector2, Vector2][] = [];
  const n = vectors.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      uniquePairs.push([vectors[i], vectors[j]]);
    }
  }

  return uniquePairs;
}

const isInBounds = (v: Vector2, width: number, height: number): boolean => {
  return v.x >= 0 && v.x < width && v.y >= 0 && v.y < height;
};

const getAntinodes = ([v1, v2]: [Vector2, Vector2], data: Data): Vector2[] => {
  const distance = {
    x: v2.x - v1.x,
    y: v2.y - v1.y,
  };

  const p1 = { x: v1.x - distance.x, y: v1.y - distance.y };
  const p2 = { x: v2.x + distance.x, y: v2.y + distance.y };

  const result: Vector2[] = [];
  if (isInBounds(p1, data.width, data.height)) {
    result.push(p1);
  }

  if (isInBounds(p2, data.width, data.height)) {
    result.push(p2);
  }

  return result;
};

const toString = (v: Vector2) => `${v.x},${v.y}`;

const solvePartOne = (data: Data): number => {
  let totalAntinodes: Set<string> = new Set();

  for (const [_, coordinates] of data.antenas.entries()) {
    const permutations = getPermutations(coordinates);
    for (const permutation of permutations) {
      const antinodes = getAntinodes(permutation, data);
      antinodes.forEach((value) => totalAntinodes.add(toString(value)));
    }
  }

  console.log(totalAntinodes);

  return totalAntinodes.size;
};

const solvePartTwo = (data: Data): number => {
  let total = 0;

  return total;
};

const main = () => {
  const filename = 'day8/data.txt';
  const fileContents = readFileContents(filename);
  const parsedData = parseFileContents(fileContents);

  const partOne = solvePartOne(parsedData);
  console.log({ partOne });

  const partTwo = solvePartTwo(parsedData);
  console.log({ partTwo });
};

main();
