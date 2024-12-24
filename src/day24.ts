import { readFileContents } from './utils/file';
import { Vector2 } from './utils/vector2';

type Gate = 'AND' | 'XOR' | 'OR';

type Operation = {
  key: string;
  lhs: string;
  rhs: string;
  gate: Gate;
  result: string;
};

type Data = {
  inputs: Map<string, number>;
  operations: Operation[];
};

const parseFileContents = (fileContents: string): Data => {
  const sections = fileContents.split('\n\n');
  if (sections.length !== 2) {
    throw new Error('Unable to parse file contents. Invalid format');
  }

  const inputs: Map<string, number> = new Map();
  sections[0].split('\n').forEach((line) => {
    const data = line.split(': ');
    const label = data[0];
    const value = parseInt(data[1], 10);
    inputs.set(label, value);
  });

  const operations = sections[1].split('\n').map((line) => {
    const data = line.split(' -> ');
    const operands = data[0].split(' ');
    const result = data[1];
    return {
      key: line,
      lhs: operands[0],
      rhs: operands[2],
      gate: operands[1] as Gate,
      result,
    };
  });

  return { inputs, operations };
};

const sort = (a: string, b: string): number => {
  if (a > b) {
    return -1;
  }
  if (b > a) {
    return 1;
  }
  return 0;
};

const processOperations = (data: Data): Map<string, number> => {
  const results: Map<string, number> = new Map();

  for (const [key, value] of data.inputs) {
    results.set(key, value);
  }

  const completedOperations: Set<string> = new Set();
  while (completedOperations.size !== data.operations.length) {
    const operations = data.operations.filter(
      (operation) => !completedOperations.has(operation.key)
    );
    for (const operation of operations) {
      const { lhs, rhs, gate, result } = operation;

      const key = `${lhs} ${gate} ${rhs} -> ${result}`;
      const left = results.get(lhs);
      const right = results.get(rhs);
      if (left === undefined || right === undefined) {
        continue;
      }

      switch (gate) {
        case 'AND': {
          const value = left && right ? 1 : 0;
          results.set(result, value);
          break;
        }
        case 'XOR': {
          const value = (left && !right) || (!left && right) ? 1 : 0;
          results.set(result, value);
          break;
        }
        case 'OR': {
          const value = left || right ? 1 : 0;
          results.set(result, value);
          break;
        }
        default: {
          throw new Error('Inavlid gate found');
        }
      }

      completedOperations.add(key);
    }

    for (const [key, _] of data.inputs) {
      results.delete(key);
    }
  }

  return results;
};

const getNumberFromResults = (results: Map<string, number>): number => {
  const keys = Array.from(results.keys()).filter((key) => key.startsWith('z'));
  keys.sort(sort);

  const bits: number[] = [];
  for (const key of keys) {
    const value = results.get(key)!;
    bits.push(value);
  }

  console.log(keys);
  console.log(bits.join(''));

  let integerValue = 0;
  for (const bit of bits) {
    integerValue = integerValue * 2 + bit;
  }
  return integerValue;
};

const solvePartOne = (data: Data): number => {
  const results = processOperations(data);
  const total = getNumberFromResults(results);
  return total;
};

const solvePartTwo = (data: Data): number => {
  let total = 0;
  return total;
};

const main = () => {
  const filename = 'day24/data.txt';
  const fileContents = readFileContents(filename);
  const parsedData = parseFileContents(fileContents);

  const partOne = solvePartOne(parsedData);
  console.log({ partOne });

  const partTwo = solvePartTwo(parsedData);
  console.log({ partTwo });
};

main();