import { readFileContents } from './utils/file';
import { isVector2InBounds, Vector2 } from './utils/vector2';

type Movement = '^' | 'v' | '<' | '>';

const MOVEMENTS: Record<Movement, Vector2> = {
  '^': { x: 0, y: -1 },
  v: { x: 0, y: 1 },
  '<': { x: -1, y: 0 },
  '>': { x: 1, y: 0 },
};

type Data = {
  map: string[][];
  width: number;
  height: number;
  movements: Movement[];
  start: Vector2;
};

const parseFileContents = (fileContents: string): Data => {
  const sections = fileContents.split('\n\n');
  if (sections.length !== 2) {
    throw new Error('Unable to parse input. Inavlid data');
  }

  const mapString = sections[0];
  const movementsString = sections[1];

  const map = mapString.split('\n').map((line) => line.split(''));
  const height = map.length;
  const width = map[0].length;

  const start = { x: -1, y: -1 };
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      const tile = map[y][x];
      if (tile === '@') {
        start.x = x;
        start.y = y;
        break;
      }
    }
  }

  const movements = movementsString
    .split('\n')
    .join('')
    .split('')
    .map((movement) => movement as Movement);

  return { map, width, height, movements, start };
};

const printMapState = ({ map, title }: { map: string[][]; title: string }) => {
  const height = map.length;
  const width = map[0].length;

  console.log(title);
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      const tile = map[y][x];
      process.stdout.write(tile);
    }
    console.log();
  }
  console.log();
};

const getStepsToEdge = ({
  position,
  movement,
  width,
  height,
}: {
  position: Vector2;
  movement: Movement;
  width: number;
  height: number;
}): number => {
  const { x, y } = position;

  let stepsToEdge = 0;
  switch (movement) {
    case '^':
      stepsToEdge = y;
      break;
    case 'v':
      stepsToEdge = height - y - 1;
      break;
    case '<':
      stepsToEdge = x;
      break;
    case '>':
      stepsToEdge = width - x - 1;
      break;
    default:
  }

  return stepsToEdge;
};

const isInBounds = ({
  position,
  width,
  height,
}: {
  position: Vector2;
  width: number;
  height: number;
}): boolean => isVector2InBounds(position, width, height);

const checkCanMove = ({
  map,
  position,
  movement,
}: {
  map: string[][];
  position: Vector2;
  movement: Movement;
}): boolean => {
  const width = map[0].length;
  const height = map.length;

  // out of bounds
  if (!isInBounds({ position, width, height })) {
    return false;
  }

  let nextPosition = getNextPosition({ position, movement });
  let nextTile = map[nextPosition.y][nextPosition.x];

  // wall
  if (nextTile === '#') {
    return false;
  }

  // empty space
  if (nextTile === '.') {
    return true;
  }

  // box
  if (nextTile === 'O') {
    const nextEmptyPosittion = getNextEmptyPosition({
      map,
      position,
      movement,
    });
    return nextEmptyPosittion !== undefined;
  }

  return false;
};

const getNextPosition = ({
  position,
  movement,
}: {
  position: Vector2;
  movement: Movement;
}): Vector2 => {
  const direction = MOVEMENTS[movement];
  const newPosition = {
    x: position.x + direction.x,
    y: position.y + direction.y,
  };
  return newPosition;
};

const getNextEmptyPosition = ({
  map,
  position,
  movement,
}: {
  map: string[][];
  position: Vector2;
  movement: Movement;
}): Vector2 | undefined => {
  const width = map[0].length;
  const height = map.length;

  if (!isInBounds({ position, width, height })) {
    return undefined;
  }

  const stepsToEdge = getStepsToEdge({
    position,
    movement,
    width,
    height,
  });

  let currenttPosition = position;
  for (let i = 0; i < stepsToEdge; ++i) {
    const nextPosition = getNextPosition({
      position: currenttPosition,
      movement,
    });

    if (!isInBounds({ position: nextPosition, width, height })) {
      return undefined;
    }

    const nextTile = map[nextPosition.y][nextPosition.x];

    if (nextTile === '#') {
      return undefined;
    }

    if (nextTile === '.') {
      return nextPosition;
    }
    currenttPosition = nextPosition;
  }

  return undefined;
};

const move = ({
  map,
  position,
  movement,
}: {
  map: string[][];
  position: Vector2;
  movement: Movement;
}): Vector2 => {
  const nextPosition = getNextPosition({ position, movement });

  const currentTile = map[position.y][position.x];
  const nextTile = map[nextPosition.y][nextPosition.x];

  if (nextTile == 'O') {
    const nextEmptyPosittion = getNextEmptyPosition({
      map,
      position,
      movement,
    });
    if (nextEmptyPosittion) {
      map[nextEmptyPosittion.y][nextEmptyPosittion.x] = 'O';
    }
  }

  map[nextPosition.y][nextPosition.x] = currentTile;
  map[position.y][position.x] = '.';
  return nextPosition;
};

const processMovements = (data: Data): string[][] => {
  const { map: originalMap, start, movements } = data;

  const map = [...originalMap];
  let position = start;

  // printMapState({ map, title: 'Initial state:' });

  console.log({ totalMovements: movements.length });

  let steps = 0;
  for (const movement of movements) {
    const canMove = checkCanMove({ map, position, movement });
    if (canMove) {
      position = move({ map, position, movement });
    }

    steps += 1;
    console.log({ steps });
    // printMapState({ map, title: `Move ${movement}:` });
    // if (!canMove) {
    //   console.log(`can't move ${movement}\n`);
    // }
  }

  return map;
};

const calculateGPSCoordinates = (map: string[][]): number[] => {
  const height = map.length;
  const width = map[0].length;

  const coordinates: number[] = [];
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      const tile = map[y][x];
      if (tile === 'O') {
        const gpsCoordinate = 100 * y + x;
        coordinates.push(gpsCoordinate);
      }
    }
  }

  return coordinates;
};

const solvePartOne = (data: Data): number => {
  const map = processMovements(data);
  const coordinates = calculateGPSCoordinates(map);
  const total = coordinates.reduce((prev, curr) => prev + curr, 0);
  return total;
};

const solvePartTwo = (data: Data): number => {
  const total = 0;
  return total;
};

const main = () => {
  const filename = 'day15/data.txt';
  const fileContents = readFileContents(filename);
  const parsedData = parseFileContents(fileContents);

  const partOne = solvePartOne(parsedData);
  console.log({ partOne });

  const partTwo = solvePartTwo(parsedData);
  console.log({ partTwo });
};

main();
