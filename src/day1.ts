import { readFileContents } from './utils/file';

type Data = {
  listA: number[];
  listB: number[];
};

const parseInputData = (input: string): Data => {
  const listA: number[] = [];
  const listB: number[] = [];

  const lines = input.split('\n');
  if (lines.length === 0) {
    throw new Error('Unable to parse input. No Data provided');
  }

  lines.forEach((line) => {
    const items = line.split('   ');

    if (items.length !== 2) {
      throw new Error(
        'Unable to parse input line. Invalid number of items found'
      );
    }

    try {
      const itemA = parseInt(items[0], 10);
      const itemB = parseInt(items[1], 10);
      listA.push(itemA);
      listB.push(itemB);
    } catch (error) {
      throw new Error('Unable to parse line items. Expected number');
    }
  });

  return { listA, listB };
};

const calculateDistances = (listA: number[], listB: number[]): number[] => {
  if (listA.length !== listB.length) {
    throw new Error('Unable to calculate distances. Mismatched list lenghts');
  }

  // Sorted not in place so original data is preserved
  const sortedListA = [...listA].sort((a, b) => a - b);
  const sortedListB = [...listB].sort((a, b) => a - b);

  const distances: number[] = [];
  for (let i = 0; i < sortedListA.length; ++i) {
    const distance = Math.abs(sortedListA[i] - sortedListB[i]);
    distances.push(distance);
  }

  return distances;
};

const calculateSimilarityScores = (
  listA: number[],
  listB: number[]
): number[] => {
  if (listA.length !== listB.length) {
    throw new Error(
      'Unable to calculate similarity score. Mismatched list lenghts'
    );
  }

  const appereances: Map<number, number> = new Map();
  for (let i = 0; i < listB.length; ++i) {
    const target = listB[i];
    const count = appereances.get(target);
    appereances.set(target, (count || 0) + 1);
  }

  const scores: number[] = [];
  listA.forEach((value) => {
    const count = appereances.get(value) || 0;
    const score = value * count;
    scores.push(score);
  });

  return scores;
};

const calculateTotal = (list: number[]): number => {
  return list.reduce((prev, curr) => {
    return prev + curr;
  }, 0);
};

const main = () => {
  const filename = 'day1/data.txt';
  const input = readFileContents(filename);
  const data = parseInputData(input);

  // Part One
  const distances = calculateDistances(data.listA, data.listB);
  const totalDistance = calculateTotal(distances);
  console.log({ totalDistance });

  // Part Two
  const scores = calculateSimilarityScores(data.listA, data.listB);
  const totalScore = calculateTotal(scores);
  console.log({ totalScore });
};

main();
