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

const findIndicesForBadUpdate = (
  update: number[],
  pageOrdering: Order[]
): number[] | undefined => {
  for (let i = 0; i < update.length; ++i) {
    const first = update[i];
    for (let j = i + 1; j < update.length; ++j) {
      const second = update[j];
      if (
        pageOrdering.some(
          (order) => order.before === second && order.after === first
        )
      ) {
        return [i, j];
      }
    }
  }
  return undefined;
};

const fixUpdate = (update: number[], pageOrdering: Order[]): number[] => {
  let result = [...update];
  let indices = findIndicesForBadUpdate(result, pageOrdering);
  while (indices) {
    const [first, second] = indices;
    const temp = result[first];
    result[first] = result[second];
    result[second] = temp;
    indices = findIndicesForBadUpdate(result, pageOrdering);
  }

  return result;
};

const solvePartOne = (data: Data): number => {
  const validUpdates = getValidUpdates(data);
  return calculateTotal(validUpdates);
};

const solvePartTwo = (data: Data): number => {
  const invalidUpdates = data.updates.filter(
    (update) => !isValidUpdate(update, data.pageOrdering)
  );
  const fixedUpdates: number[][] = [];
  for (const update of invalidUpdates) {
    const fixed = fixUpdate(update, data.pageOrdering);
    fixedUpdates.push(fixed);
  }
  return calculateTotal(fixedUpdates);
};

const main = () => {
  const filename = 'day5/data.txt';
  const fileContents = readFileContents(filename);
  const parsedData = parseFileContents(fileContents);

  const partOne = solvePartOne(parsedData);
  console.log({ partOne });

  const partTwo = solvePartTwo(parsedData);
  console.log({ partTwo });
};

main();
