import fs from 'node:fs';
import path from 'path';

type Data = {
  listA: number[];
  listB: number[];
};

const readInputData = (filename: string): string => {
  try {
    const filePath = path.join(__dirname, '..', 'data', filename);
    const data = fs.readFileSync(filePath);
    return data.toString('utf8');
  } catch (error) {
    throw new Error(`Unable to read file "${filename}". ${error}`);
  }
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

  const distances: number[] = [];
  for (let i = 0; i < listA.length; ++i) {
    const distance = Math.abs(listA[i] - listB[i]);
    distances.push(distance);
  }

  return distances;
};

const calculateTotalDistance = (distances: number[]): number => {
  return distances.reduce((prev, curr) => {
    return prev + curr;
  }, 0);
};

const main = () => {
  const filename = 'day1/part1.txt';
  const input = readInputData(filename);
  const data = parseInputData(input);

  data.listA.sort((a, b) => a - b);
  data.listB.sort((a, b) => a - b);

  const distances = calculateDistances(data.listA, data.listB);
  const totalDistance = calculateTotalDistance(distances);

  console.log({ totalDistance });
};

main();
