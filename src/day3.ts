import { readFileContents } from './utils/file';

type Multiplicands = {
  left: number;
  right: number;
};
const parseFileContents = (fileContents: string): Multiplicands[] => {
  const regex = /mul\(\d+,\d+\)/gm;
  const match = fileContents.match(regex);
  if (!match) {
    return [];
  }

  const result: Multiplicands[] = [];
  match.forEach((m) => {
    const values = m.replace('mul(', '').replace(')', '').split(',');
    const left = parseInt(values[0], 10);
    const right = parseInt(values[1], 10);
    result.push({ left, right });
  });

  return result;
};

const calculateTotal = (list: Multiplicands[]): number => {
  let total = 0;
  list.forEach((data) => {
    total += data.left * data.right;
  });
  return total;
};

const main = () => {
  const filename = 'day3/data.txt';
  const fileContents = readFileContents(filename);
  const parsedData = parseFileContents(fileContents);

  const partOne = calculateTotal(parsedData);
  console.log({ partOne });
};

main();
