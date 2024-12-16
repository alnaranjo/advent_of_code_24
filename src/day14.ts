import { readFileContents } from './utils/file';
import { parseVector2, Vector2 } from './utils/vector2';

// const WIDTH = 11;
// const HEIGHT = 7;
const WIDTH = 101;
const HEIGHT = 103;

type Robot = {
  position: Vector2;
  velocity: Vector2;
};

const parseFileContents = (fileContents: string): Robot[] => {
  const results = fileContents.split('\n').map((line) => {
    const data = line.split(' ');
    if (data.length !== 2) {
      throw new Error('Unable to parse input. Invalid machine format');
    }

    const positionString = data[0].replace('p=', '');
    const velocityString = data[1].replace('v=', '');

    const position = parseVector2(positionString);
    const velocity = parseVector2(velocityString);

    return { position, velocity };
  });

  return results;
};

const runSimulation = ({
  robots,
  iterations,
}: {
  robots: Robot[];
  iterations: number;
}): Robot[] => {
  const results = [...robots];

  for (let robotIndex = 0; robotIndex < results.length; ++robotIndex) {
    const { position, velocity } = robots[robotIndex];
    let newPosition = { ...position };

    for (let i = 0; i < iterations; ++i) {
      newPosition.x += velocity.x;
      newPosition.y += velocity.y;

      // wrap around
      if (newPosition.x < 0) {
        newPosition.x += WIDTH;
      } else if (newPosition.x >= WIDTH) {
        newPosition.x -= WIDTH;
      }

      if (newPosition.y < 0) {
        newPosition.y += HEIGHT;
      } else if (newPosition.y >= HEIGHT) {
        newPosition.y -= HEIGHT;
      }
    }

    results[robotIndex] = { position: newPosition, velocity };
  }

  return results;
};

const countRobotsPerQuadrant = (
  robots: Robot[]
): {
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
} => {
  const HALF_WIDTH = Math.floor(WIDTH / 2);
  const HALF_HEIGHT = Math.floor(HEIGHT / 2);
  let topLeft = 0;
  let topRight = 0;
  let bottomLeft = 0;
  let bottomRight = 0;

  for (const { position } of robots) {
    if (position.x === HALF_WIDTH || position.y === HALF_HEIGHT) {
      continue;
    }

    if (position.x < HALF_WIDTH && position.y < HALF_HEIGHT) {
      topLeft += 1;
    }

    if (position.x > HALF_WIDTH && position.y < HALF_HEIGHT) {
      topRight += 1;
    }

    if (position.x < HALF_WIDTH && position.y > HALF_HEIGHT) {
      bottomLeft += 1;
    }

    if (position.x > HALF_WIDTH && position.y > HALF_HEIGHT) {
      bottomRight += 1;
    }
  }

  return { topLeft, topRight, bottomLeft, bottomRight };
};

const solvePartOne = (robots: Robot[]): number => {
  const results = runSimulation({ robots, iterations: 100 });
  const { topLeft, topRight, bottomLeft, bottomRight } =
    countRobotsPerQuadrant(results);
  const total = topLeft * topRight * bottomLeft * bottomRight;
  return total;
};

const solvePartTwo = (data: Robot[]): number => {
  let total = 0;
  return total;
};

const main = () => {
  const filename = 'day14/data.txt';
  const fileContents = readFileContents(filename);
  const parsedData = parseFileContents(fileContents);

  const partOne = solvePartOne(parsedData);
  console.log({ partOne });

  const partTwo = solvePartTwo(parsedData);
  console.log({ partTwo });
};

main();
