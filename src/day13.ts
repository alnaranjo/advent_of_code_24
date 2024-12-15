import { readFileContents } from './utils/file';
import { calculateExtendedGCD } from './utils/math';
import { Vector2 } from './utils/vector2';

type Machine = {
  buttonA: Vector2;
  buttonB: Vector2;
  prize: Vector2;
};

type Data = Machine[];

const parseCoordinates = (line: string, separator: string = ''): Vector2 => {
  const data = line.split(': ');
  if (data.length !== 2) {
    throw new Error(`Unable to parse line. Invalid format. ${line}`);
  }
  const coordinatesString = data[1];
  const params = coordinatesString.split(', ');

  if (params.length !== 2) {
    throw new Error(`Unable to parse coordinates params. ${params}`);
  }

  const x = params[0].replace(`X${separator}`, '');
  const y = params[1].replace(`Y${separator}`, '');

  try {
    return {
      x: parseInt(x, 10),
      y: parseInt(y, 10),
    };
  } catch (error) {
    throw new Error(`Unable to parse coordinates. Invalud format. ${params}`);
  }
};

const parseFileContents = (fileContents: string): Data => {
  const results = fileContents.split('\n\n').map((machine) => {
    const lines = machine.split('\n');
    if (lines.length !== 3) {
      throw new Error('Unable to parse input. Invalid machine format');
    }

    const buttonA = parseCoordinates(lines[0]);
    const buttonB = parseCoordinates(lines[1]);
    const prize = parseCoordinates(lines[2], '=');

    return { buttonA, buttonB, prize };
  });

  return results;
};

const solveLinearEquations = ({
  buttonA,
  buttonB,
  prize,
}: {
  buttonA: Vector2;
  buttonB: Vector2;
  prize: Vector2;
}): [number, number] => {
  const a1 = buttonA.x;
  const b1 = buttonB.x;
  const c1 = prize.x;

  const a2 = buttonA.y;
  const b2 = buttonB.y;
  const c2 = prize.y;

  const y = (a2 * c1 - a1 * c2) / (a2 * b1 - a1 * b2);
  const x = (c1 - b1 * y) / a1;

  return [x, y];
};

const solvePartOne = (data: Data): number => {
  let total = 0;
  const TOKENS_A = 3;
  const TOKENS_B = 1;

  for (const machine of data) {
    const { buttonA, buttonB, prize } = machine;
    const [x, y] = solveLinearEquations({ buttonA, buttonB, prize });

    if (Math.floor(x) !== x || Math.floor(y) !== y) {
      continue;
    }

    if (x < 0 || y < 0) {
      continue;
    }

    if (x > 100 || y > 100) {
      continue;
    }

    total += x * TOKENS_A + y * TOKENS_B;
  }

  return total;
};

const solvePartTwo = (data: Data): number => {
  const OFFSET = 10000000000000;
  const TOKENS_A = 3;
  const TOKENS_B = 1;

  let total = 0;
  for (const machine of data) {
    const { buttonA, buttonB, prize } = machine;
    const [x, y] = solveLinearEquations({
      buttonA,
      buttonB,
      prize: { x: prize.x + OFFSET, y: prize.y + OFFSET },
    });

    if (Math.floor(x) !== x || Math.floor(y) !== y) {
      continue;
    }

    if (x < 0 || y < 0) {
      continue;
    }

    total += x * TOKENS_A + y * TOKENS_B;
  }

  return total;
};

const main = () => {
  const filename = 'day13/data.txt';
  const fileContents = readFileContents(filename);
  const parsedData = parseFileContents(fileContents);

  const partOne = solvePartOne(parsedData);
  console.log({ partOne });

  const partTwo = solvePartTwo(parsedData);
  console.log({ partTwo });
};

main();
