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

const findPositiveCoefficients = ({
  a,
  b,
  target,
  maxIterations = 100,
}: {
  a: number;
  b: number;
  target: number;
  maxIterations?: number;
}): [number, number][] | undefined => {
  const { x, y, gcd } = calculateExtendedGCD(a, b);

  // checks if there's a solution
  if (target % gcd !== 0) {
    return undefined;
  }

  const k = target / gcd;
  let x0 = x * k;
  let y0 = y * k;

  // Adjust coefficients to ensure both are positive
  if (x0 < 0) {
    const t = Math.ceil(-x0 / b);
    x0 += b * t;
    y0 -= a * t;
  }
  if (y0 < 0) {
    const t = Math.ceil(-y0 / a);
    x0 -= b * t;
    y0 += a * t;
  }

  const solutions: [number, number][] = [];
  for (let t = -maxIterations; t <= maxIterations; t++) {
    const x = x0 + (b / gcd) * t;
    const y = y0 - (a / gcd) * t;
    if (x >= 0 && y >= 0) {
      solutions.push([x, y]);
    }
  }

  return solutions;
};

const commonCoefficients = (
  listA: [number, number][],
  listB: [number, number][]
): [number, number][] => {
  const result: [number, number][] = [];

  for (const coefficientsA of listA) {
    if (
      listB.some(
        (coefficientsB) =>
          coefficientsA[0] === coefficientsB[0] &&
          coefficientsA[1] === coefficientsB[1]
      )
    ) {
      result.push(coefficientsA);
    }
  }

  return result;
};

const solvePartOne = (data: Data): number => {
  let total = 0;
  const TOKENS_A = 3;
  const TOKENS_B = 1;

  for (const machine of data) {
    const { buttonA, buttonB, prize } = machine;
    const coefficientsX = findPositiveCoefficients({
      a: buttonA.x,
      b: buttonB.x,
      target: prize.x,
    });

    const coefficientsY = findPositiveCoefficients({
      a: buttonA.y,
      b: buttonB.y,
      target: prize.y,
    });

    if (!coefficientsX || !coefficientsY) {
      continue;
    }

    const coefficients = commonCoefficients(coefficientsX, coefficientsY);

    if (coefficients.length === 0) {
      continue;
    }

    const costs = coefficients.map((c) => TOKENS_A * c[0] + TOKENS_B * c[1]);
    const min = Math.min(...costs);

    console.log({ costs, min });

    total += min;
  }

  return total;
};

const solvePartTwo = (data: Data): number => {
  let total = 0;
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
