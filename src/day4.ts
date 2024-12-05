import { readFileContents } from './utils/file';

type Coordinates = {
  x: number;
  y: number;
};

type Data = {
  xCoordinates: Map<string, boolean>;
  mCoordinates: Map<string, boolean>;
  aCoordinates: Map<string, boolean>;
  sCoordinates: Map<string, boolean>;
  width: number;
  height: number;
};

const serializeKey = (coordinates: Coordinates): string =>
  `${coordinates.x},${coordinates.y}`;

const deserializeKey = (key: string): Coordinates => {
  const values = key.split(',');
  return {
    x: parseInt(values[0], 10),
    y: parseInt(values[1], 10),
  };
};

const parseFileContents = (fileContents: string): Data => {
  const lines = fileContents.split('\n');

  const xCoordinates: Map<string, boolean> = new Map();
  const mCoordinates: Map<string, boolean> = new Map();
  const aCoordinates: Map<string, boolean> = new Map();
  const sCoordinates: Map<string, boolean> = new Map();

  const width = lines[0].length;
  const height = lines.length;

  for (let y = 0; y < height; ++y) {
    const line = lines[y];
    for (let x = 0; x < width; ++x) {
      const letter = line[x];
      const key = serializeKey({ x, y });

      if (letter === 'X') {
        xCoordinates.set(key, true);
        continue;
      }

      if (letter === 'M') {
        mCoordinates.set(key, true);
        continue;
      }

      if (letter === 'A') {
        aCoordinates.set(key, true);
        continue;
      }

      if (letter === 'S') {
        sCoordinates.set(key, true);
        continue;
      }
    }
  }

  return {
    xCoordinates,
    mCoordinates,
    aCoordinates,
    sCoordinates,
    width,
    height,
  };
};

const getDirections = (
  target: Coordinates,
  list: Map<string, boolean>
): Coordinates[] => {
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

  const results: Coordinates[] = [];

  for (const direction of directions) {
    const coordinates = {
      x: target.x + direction.x,
      y: target.y + direction.y,
    };
    const key = serializeKey(coordinates);
    const found = list.get(key);
    if (found) {
      results.push(direction);
    }
  }

  return results;
};

const hasData = (target: Coordinates, list: Map<string, boolean>): boolean => {
  const key = serializeKey(target);
  return list.has(key);
};

const getValue = (target: Coordinates, data: Data): string => {
  if (hasData(target, data.xCoordinates)) {
    return 'X';
  } else if (hasData(target, data.mCoordinates)) {
    return 'M';
  } else if (hasData(target, data.aCoordinates)) {
    return 'A';
  } else {
    return 'S';
  }
};

const solvePartOne = (data: Data): number => {
  let total = 0;

  const xCoordinates = Array.from(data.xCoordinates.keys());
  for (let i = 0; i < xCoordinates.length; ++i) {
    const coordinates = deserializeKey(xCoordinates[i]);
    const directions = getDirections(coordinates, data.mCoordinates);

    for (let j = 0; j < directions.length; ++j) {
      const direction = directions[j];
      const aFound = hasData(
        {
          x: coordinates.x + direction.x * 2,
          y: coordinates.y + direction.y * 2,
        },
        data.aCoordinates
      );
      const sFound = hasData(
        {
          x: coordinates.x + direction.x * 3,
          y: coordinates.y + direction.y * 3,
        },
        data.sCoordinates
      );

      if (aFound && sFound) {
        total += 1;
      }
    }
  }

  return total;
};

const solvePartTwo = (data: Data): number => {
  let total = 0;

  const topLeft = { x: -1, y: -1 };
  const bottomLeft = { x: -1, y: 1 };
  const bottomRight = { x: 1, y: 1 };
  const topRight = { x: 1, y: -1 };

  const directions = [topLeft, bottomLeft, bottomRight, topRight];

  const aCoordinates = Array.from(data.aCoordinates.keys());
  for (let i = 0; i < aCoordinates.length; ++i) {
    const coordinates = deserializeKey(aCoordinates[i]);

    // skip borders
    if (
      coordinates.x === 0 ||
      coordinates.x === data.width - 1 ||
      coordinates.y === 0 ||
      coordinates.y === data.height - 1
    ) {
      continue;
    }

    const corners = directions.map((direction) => {
      const target = {
        x: coordinates.x + direction.x,
        y: coordinates.y + direction.y,
      };
      return getValue(target, data);
    });

    if (
      corners.includes('X') ||
      corners.includes('A') ||
      corners[0] === corners[2] ||
      corners[1] === corners[3]
    ) {
      continue;
    }

    total += 1;
  }

  return total;
};

const main = () => {
  const filename = 'day4/data.txt';
  const fileContents = readFileContents(filename);
  const parsedData = parseFileContents(fileContents);

  const partOne = solvePartOne(parsedData);
  console.log({ partOne });

  const partTwo = solvePartTwo(parsedData);
  console.log({ partTwo });
};

main();
