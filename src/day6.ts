import { readFileContents } from './utils/file';
import { Vector2, rotate90 } from './utils/vector2';

type Data = {
  width: number;
  height: number;
  grid: string[][];
  start: Vector2;
  direction: Vector2;
  obstacles: Vector2[];
};

const getDirection = (orientation: string): Vector2 => {
  switch (orientation) {
    case '^':
      return { x: 0, y: -1 };
    case '>':
      return { x: 1, y: 0 };
    case 'v':
      return { x: 0, y: 1 };
    case '<':
      return { x: -1, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
};

const isObstacle = (position: Vector2, positions: Vector2[]): boolean => {
  const found = positions.some(
    (item) => item.x === position.x && item.y === position.y
  );
  return found;
};

const parseFileContents = (fileContents: string): Data => {
  const grid = fileContents.split('\n').map((line) => line.split(''));
  const height = grid.length;
  const width = grid[0].length;

  const start = { x: -1, y: -1 };
  const obstacles: Vector2[] = [];

  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      const tile = grid[y][x];
      if (tile === '^' || tile === '>' || tile === 'v' || tile === '<') {
        start.x = x;
        start.y = y;
      }
      if (tile === '#') {
        obstacles.push({ x, y });
      }
    }
  }

  const direction = getDirection(grid[start.y][start.x]);

  return { width, height, grid, start, direction, obstacles };
};

const toString = (position: Vector2): string => `${position.x},${position.y}`;

const solvePartOne = (data: Data): number => {
  let position = data.start;
  let direction = data.direction;

  const visitedPositions: Set<string> = new Set();
  visitedPositions.add(toString(position));

  while (true) {
    const nextPosition = {
      x: position.x + direction.x,
      y: position.y + direction.y,
    };

    // check boundaries
    if (
      nextPosition.y < 0 ||
      nextPosition.x >= data.width ||
      nextPosition.y >= data.height ||
      nextPosition.x < 0
    ) {
      break;
    }

    // check obstacles
    if (isObstacle(nextPosition, data.obstacles)) {
      direction = rotate90(direction);
    } else {
      position = nextPosition;
      visitedPositions.add(toString(position));
    }
  }

  return visitedPositions.size;
};

const isLooping = (data: Data, newObstacle: Vector2): boolean => {
  let position = data.start;
  let direction = data.direction;
  const obstacles = [...data.obstacles, newObstacle];

  const visitedPositions: Set<string> = new Set();
  visitedPositions.add(`${toString(position)}-${toString(direction)}`);

  while (true) {
    const nextPosition = {
      x: position.x + direction.x,
      y: position.y + direction.y,
    };

    // check boundaries
    if (
      nextPosition.y < 0 ||
      nextPosition.x >= data.width ||
      nextPosition.y >= data.height ||
      nextPosition.x < 0
    ) {
      break;
    }

    // check obstacles
    if (isObstacle(nextPosition, obstacles)) {
      direction = rotate90(direction);
    } else {
      position = nextPosition;
      if (
        visitedPositions.has(`${toString(position)}-${toString(direction)}`)
      ) {
        return true;
      }
      visitedPositions.add(`${toString(position)}-${toString(direction)}`);
    }
  }

  return false;
};

const solvePartTwo = (data: Data): number => {
  let total = 0;

  for (let y = 0; y < data.height; ++y) {
    for (let x = 0; x < data.width; ++x) {
      const position = { x, y };
      if (isObstacle(position, data.obstacles)) {
        continue;
      }

      if (isLooping(data, position)) {
        total += 1;
      }
    }
  }

  return total;
};

const main = () => {
  const filename = 'day6/data.txt';
  const fileContents = readFileContents(filename);
  const parsedData = parseFileContents(fileContents);

  const partOne = solvePartOne(parsedData);
  console.log({ partOne });

  const partTwo = solvePartTwo(parsedData);
  console.log({ partTwo });
};

main();
