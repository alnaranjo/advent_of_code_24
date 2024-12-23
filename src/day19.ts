import { readFileContents } from './utils/file';
import { Vector2 } from './utils/vector2';
import { createGraph, findAllPaths, dijkstra, getNodeKey } from './utils/graph';

type Data = {
  patterns: string[];
  designs: string[];
};

const parseFileContents = (fileContents: string): Data => {
  const sections = fileContents.split('\n\n');

  if (sections.length !== 2) {
    throw new Error('Unable to parse file contents. Invalid format');
  }

  const patterns = sections[0].split(', ');
  const designs = sections[1].split('\n');

  return { patterns, designs };
};

const canFormPattern = (design: string, patterns: string[]): boolean => {
  const cache: Map<string, boolean> = new Map(); // Cache for memoization

  const canForm = (target: string): boolean => {
    if (target === '') {
      return true;
    }

    if (cache.has(target)) {
      return cache.get(target)!;
    }

    for (const pattern of patterns) {
      if (target.startsWith(pattern)) {
        if (canForm(target.slice(pattern.length))) {
          cache.set(target, true);
          return true;
        }
      }
    }

    cache.set(target, false);
    return false;
  };

  return canForm(design);
};

const countFormPattern = (design: string, patterns: string[]): number => {
  const cache: Map<string, number> = new Map(); // Cache for memoization

  const countForm = (target: string): number => {
    if (target === '') {
      return 1;
    }

    if (cache.has(target)) {
      return cache.get(target)!;
    }

    let count = 0;

    for (const pattern of patterns) {
      if (target.startsWith(pattern)) {
        count += countForm(target.slice(pattern.length));
      }
    }

    cache.set(target, count);
    return count;
  };

  return countForm(design);
};

const solvePartOne = (data: Data): number => {
  let total = 0;

  for (const design of data.designs) {
    if (canFormPattern(design, data.patterns)) {
      total += 1;
    }
  }
  return total;
};

const solvePartTwo = (data: Data): number => {
  let total = 0;

  for (const design of data.designs) {
    total += countFormPattern(design, data.patterns);
  }
  return total;
};

const main = () => {
  const filename = 'day19/data.txt';
  const fileContents = readFileContents(filename);
  const parsedData = parseFileContents(fileContents);

  const partOne = solvePartOne(parsedData);
  console.log({ partOne });

  const partTwo = solvePartTwo(parsedData);
  console.log({ partTwo });
};

main();
