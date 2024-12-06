import { readFileContents } from './utils/file';

type Order = {
  before: number;
  after: number;
};

type Data = {
  pageOrdering: Order[];
  updates: number[][];
};

const parseFileContents = (fileContents: string): Data => {
  const [pageOrderingString, updatesString] = fileContents.split('\n\n');

  const pageOrdering = pageOrderingString.split('\n').map((line) => {
    const values = line.split('|').map((value) => parseInt(value, 10));
    return {
      before: values[0],
      after: values[1],
    };
  });
  const updates = updatesString
    .split('\n')
    .map((line) => line.split(',').map((value) => parseInt(value, 10)));

  return { pageOrdering, updates };
};

const isValidUpdate = (update: number[], pageOrdering: Order[]): boolean => {
  for (let i = 0; i < update.length; ++i) {
    const first = update[i];
    for (let j = i + 1; j < update.length; ++j) {
      const second = update[j];
      if (
        pageOrdering.some(
          (order) => order.before === second && order.after === first
        )
      ) {
        return false;
      }
    }
  }
  return true;
};

const getValidUpdates = (data: Data): number[][] => {
  const validUpdates: number[][] = [];

  for (const update of data.updates) {
    if (isValidUpdate(update, data.pageOrdering)) {
      validUpdates.push(update);
    }
  }

  return validUpdates;
};

const calculateTotal = (updates: number[][]): number => {
  let total = 0;
  for (const update of updates) {
    const index = Math.floor(update.length / 2);
    total += update[index];
  }
  return total;
};

const solvePartOne = (data: Data): number => {
  const validUpdates = getValidUpdates(data);
  const total = calculateTotal(validUpdates);
  return total;
};

const solvePartTwo = (data: string[][]): number => {
  return -1;
};

const main = () => {
  const filename = 'day5/data.txt';
  const fileContents = readFileContents(filename);
  const parsedData = parseFileContents(fileContents);

  const partOne = solvePartOne(parsedData);
  console.log({ partOne });

  // const partTwo = solvePartTwo(parsedData);
  // console.log({ partTwo });
};

main();
