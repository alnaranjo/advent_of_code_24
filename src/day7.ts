import { readFileContents } from './utils/file';

type Equation = {
  testValue: number;
  operators: number[];
};

type Data = Equation[];

const parseFileContents = (fileContents: string): Data => {
  const result = fileContents.split('\n').map((line) => {
    const [testValueString, operatorsString] = line.split(': ');
    const testValue = parseInt(testValueString, 10);
    const operators = operatorsString
      .split(' ')
      .map((operator) => parseInt(operator, 10));
    return { testValue, operators };
  });
  return result;
};

type Operand = '+' | '*';
type Permutation = (number | Operand)[];

const getPermutations = (
  numbers: number[],
  operands: Operand[] = ['+', '*']
): Permutation[] => {
  const results: Permutation[] = [];

  const helper = (current: Permutation, index: number): void => {
    if (index === numbers.length - 1) {
      results.push(current);
      return;
    }

    for (let i = 0; i < operands.length; ++i) {
      const operand = operands[i];
      const nextIndex = index + 1;
      helper([...current, operand as Operand, numbers[nextIndex]], nextIndex);
    }
  };

  if (numbers.length > 0) {
    const first = numbers[0];
    helper([first], 0);
  }

  return results;
};

const isValid = (permutation: Permutation, testValue: number): boolean => {
  // need at least two numbers and an operand
  if (permutation.length < 3) {
    return false;
  }

  let total = permutation[0] as number; // first number
  for (let i = 1; i < permutation.length; i += 2) {
    const operand = permutation[i] as Operand;
    const number = permutation[i + 1] as number;

    if (operand === '+') {
      total += number;
    } else if (operand === '*') {
      total *= number;
    }
  }

  return total === testValue;
};

const solvePartOne = (data: Data): number => {
  let total = 0;

  for (const equation of data) {
    const permutations = getPermutations(equation.operators);
    for (const permutation of permutations) {
      if (isValid(permutation, equation.testValue)) {
        total += equation.testValue;
        break;
      }
    }
  }

  return total;
};

const solvePartTwo = (data: Data): number => {
  return -1;
};

const main = () => {
  const filename = 'day7/data.txt';
  const fileContents = readFileContents(filename);
  const parsedData = parseFileContents(fileContents);

  const partOne = solvePartOne(parsedData);
  console.log({ partOne });

  const partTwo = solvePartTwo(parsedData);
  console.log({ partTwo });
};

main();
