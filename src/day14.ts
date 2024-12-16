import { readFileContents } from './utils/file';
import { parseVector2, Vector2, vector2ToString } from './utils/vector2';

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

const printRobots = (robots: Robot[]) => {
  const map: Map<string, boolean> = new Map();

  for (const robot of robots) {
    const key = vector2ToString(robot.position);
    map.set(key, true);
  }

  for (let y = 0; y < HEIGHT; ++y) {
    for (let x = 0; x < WIDTH; ++x) {
      const key = `${x},${y}`;
      if (map.has(key)) {
        process.stdout.write('#');
      } else {
        process.stdout.write('.');
      }
    }
    console.log();
  }
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

const printPossibleTree = (robots: Robot[], iteration: number) => {
  const seen: Map<string, boolean> = new Map();
  let overlaps = false;
  for (const { position } of robots) {
    const key = vector2ToString(position);
    if (seen.has(key)) {
      overlaps = true;
      break;
    } else {
      seen.set(key, true);
    }
  }

  if (!overlaps) {
    console.clear();
    console.log(`=== iteration: ${iteration} ===`);
    printRobots(robots);
  }
};

const runSimulation2 = ({
  robots,
  iterations,
}: {
  robots: Robot[];
  iterations: number;
}) => {
  const results = [...robots];

  for (let i = 1; i < iterations; ++i) {
    for (let robotIndex = 0; robotIndex < results.length; ++robotIndex) {
      const { position, velocity } = results[robotIndex];
      let newPosition = { ...position };

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

      results[robotIndex] = { position: newPosition, velocity };
    }

    printPossibleTree(results, i);
  }
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

const solvePartTwo = (robots: Robot[]) => {
  runSimulation2({ robots, iterations: 10000 });
};

const main = () => {
  const filename = 'day14/data.txt';
  const fileContents = readFileContents(filename);
  const parsedData = parseFileContents(fileContents);

  const partOne = solvePartOne(parsedData);
  console.log({ partOne });

  solvePartTwo(parsedData);
};

main();
