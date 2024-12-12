import { count } from 'console';
import { readFileContents } from './utils/file';

const parseFileContents = (fileContents: string): number[] => {
  const stones = fileContents.split(' ').map((item) => parseInt(item, 10));
  return stones;
};

const performIteration = (list: number[]): number[] => {
  const result: number[] = [];

  for (let i = 0; i < list.length; ++i) {
    const current = list[i];
    const currentString = `${current}`;

    if (current == 0) {
      result.push(1);
    } else if (currentString.length % 2 == 0) {
      const index = currentString.length / 2;
      const left = parseInt(currentString.substring(0, index), 10);
      const right = parseInt(currentString.substring(index), 10);
      result.push(left);
      result.push(right);
    } else {
      const newValue = current * 2024;
      result.push(newValue);
    }
  }

  return result;
};

const solvePartOne = (list: number[]): number => {
  let iteration = list;
  for (let i = 0; i < 25; ++i) {
    iteration = performIteration(iteration);
  }

  return iteration.length;
};

const solvePartTwo = (list: number[]): number => {
  let iteration: Map<number, number> = new Map();

  for (let i = 0; i < list.length; ++i) {
    const current = list[i];
    const count = iteration.get(current) || 0;
    iteration.set(current, count + 1);
  }

  for (let i = 0; i < 75; ++i) {
    const newIteration: Map<number, number> = new Map();

    for (const [current, count] of iteration.entries()) {
      const currentString = `${current}`;

      if (current === 0) {
        const currentCount = newIteration.get(1) || 0;
        newIteration.set(1, currentCount + count);
      } else if (currentString.length % 2 === 0) {
        const index = currentString.length / 2;
        const left = parseInt(currentString.substring(0, index), 10);
        const right = parseInt(currentString.substring(index), 10);

        const countLeft = newIteration.get(left) || 0;
        const countRight = newIteration.get(right) || 0;

        newIteration.set(left, countLeft + count);
        newIteration.set(right, countRight + count);
      } else {
        const index = current * 2024;
        const currentCount = newIteration.get(index) || 0;
        newIteration.set(index, currentCount + count);
      }
    }

    iteration = newIteration;
  }

  let total = 0;
  for (const [_, count] of iteration) {
    total += count;
  }

  return total;
};

const main = () => {
  const filename = 'day11/test.txt';
  const fileContents = readFileContents(filename);
  const parsedData = parseFileContents(fileContents);

  const partOne = solvePartOne(parsedData);
  console.log({ partOne });

  const partTwo = solvePartTwo(parsedData);
  console.log({ partTwo });
};

main();
