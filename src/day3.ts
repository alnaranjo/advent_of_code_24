import { readFileContents } from './utils/file';

type Multiplicands = {
  left: number;
  right: number;
};

const parseMultiplicants = (fileContents: string): Multiplicands[] => {
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

const parseMultiplicantsPartTwo = (fileContents: string): Multiplicands[] => {
  const data = fileContents.split('do()');

  const results = data.flatMap((item) => {
    const parts = item.split("don't()");
    if (parts.length > 1) {
      // console.log(`\t${parts[0]}`);
      return parseMultiplicants(parts[0]);
    } else {
      // console.log(`\t${item}`);
      return parseMultiplicants(item);
    }
  });

  return results;
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

  const parsedDataPartOne = parseMultiplicants(fileContents);
  const partOne = calculateTotal(parsedDataPartOne);
  console.log({ partOne });

  const parsedDataPartTwo = parseMultiplicantsPartTwo(fileContents);
  const partTwo = calculateTotal(parsedDataPartTwo);
  console.log({ partTwo });
};

main();
