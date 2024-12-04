import { readFileContents } from './utils/file';

type Data = {
  x: Map<string, boolean>;
  m: Map<string, boolean>;
  a: Map<string, boolean>;
  s: Map<string, boolean>;
};

const parseFileContents = (fileContents: string): Data => {
  const lines = fileContents.split('\n');

  const xSeen: Map<string, boolean> = new Map();
  const mSeen: Map<string, boolean> = new Map();
  const aSeen: Map<string, boolean> = new Map();
  const sSeen: Map<string, boolean> = new Map();

  for (let y = 0; y < lines.length; ++y) {
    const line = lines[y];
    for (let x = 0; x < line.length; ++x) {
      const letter = line[x];
      const coordinates = `${x},${y}`;
      if (letter === 'X') {
        xSeen.set(coordinates, true);
        continue;
      }

      if (letter === 'M') {
        mSeen.set(coordinates, true);
        continue;
      }

      if (letter === 'A') {
        aSeen.set(coordinates, true);
        continue;
      }

      if (letter === 'S') {
        sSeen.set(coordinates, true);
        continue;
      }
    }
  }

  return { x: xSeen, m: mSeen, a: aSeen, s: sSeen };
};

const getCoordinates = (value: string): { x: number; y: number } => {
  const [x, y] = value.split(',');
  return { x: parseInt(x), y: parseInt(y) };
};

const getDirections = (
  target: string,
  list: Map<string, boolean>
): { x: number; y: number }[] => {
  const topLeft = { x: -1, y: -1 };
  const top = { x: 0, y: -1 };
  const topRight = { x: 1, y: -1 };
  const left = { x: -1, y: 0 };
  const right = { x: 1, y: 0 };
  const bottomLeft = { x: -1, y: 1 };
  const bottom = { x: 0, y: 1 };
  const bottomRight = { x: 1, y: 1 };

  const directions = [
    topLeft,
    top,
    topRight,
    left,
    right,
    bottomLeft,
    bottom,
    bottomRight,
  ];

  const results: { x: number; y: number }[] = [];

  for (const direction of directions) {
    const position = getCoordinates(target);
    const location = `${position.x + direction.x},${position.y + direction.y}`;
    const found = list.get(location);
    if (found) {
      results.push(direction);
    }
  }

  return results;
};

const solvePartOne = (data: Data): number => {
  console.log(data);

  let total = 0;

  const keys = Array.from(data.x.keys());
  for (let i = 0; i < keys.length; ++i) {
    const xLocation = keys[i];
    let position = getCoordinates(xLocation);
    const directions = getDirections(xLocation, data.m);

    for (let j = 0; j < directions.length; ++j) {
      const direction = directions[j];
      console.log({ xLocation, direction });

      const aFound = data.a.has(
        `${position.x + direction.x * 2},${position.y + direction.y * 2}`
      );
      const sFound = data.s.has(
        `${position.x + direction.x * 3},${position.y + direction.y * 3}`
      );

      if (aFound && sFound) {
        total += 1;
      }
    }
  }

  return total;
};

const main = () => {
  const filename = 'day4/data.txt';
  const fileContents = readFileContents(filename);
  const parsedData = parseFileContents(fileContents);

  const partOne = solvePartOne(parsedData);
  console.log({ partOne });

  // const partTwo = solvePartOne(parsedData);
  // console.log({partTwo});
};

main();
