import { readFileContents } from './utils/file';

type Connection = [string, string];

type Data = {
  connections: Connection[];
};

const parseFileContents = (fileContents: string): Data => {
  const connections = fileContents.split('\n').map((line) => {
    const data = line.split('-');
    if (data.length !== 2) {
      throw new Error('Unable to parse file contents. Invalid format');
    }
    return data as Connection;
  });

  return { connections };
};

const sort = (a: string, b: string): number => {
  if (a < b) {
    return -1;
  }
  if (b < a) {
    return 1;
  }
  return 0;
};

type TrippleConnection = [string, string, string];
const getInterconnectedComputers = (data: Data): TrippleConnection[] => {
  const results: Set<string> = new Set();
  const connections: Map<string, Set<string>> = new Map();

  for (const connection of data.connections) {
    const [computerA, computerB] = connection;
    const connectionsA = connections.get(computerA) || new Set();
    const connectionsB = connections.get(computerB) || new Set();

    connectionsA.add(computerB);
    connectionsB.add(computerA);

    connections.set(computerA, connectionsA);
    connections.set(computerB, connectionsB);
  }

  for (const [first, firstConnections] of connections) {
    for (const second of firstConnections) {
      for (const third of firstConnections) {
        if (connections.get(second)!.has(third)) {
          const result = [first, second, third].sort(sort).join('-');
          results.add(result);
        }
      }
    }
  }

  return Array.from(results)
    .map((result) => result.split('-') as TrippleConnection)
    .sort((a, b) => sort(a[0], b[0]));
};

const solvePartOne = (data: Data): number => {
  const interconnectedComputers = getInterconnectedComputers(data);
  const filtered = interconnectedComputers.filter((connection) =>
    connection.some((value) => value.startsWith('t'))
  );
  const total = filtered.length;
  return total;
};

const solvePartTwo = (data: Data): number => {
  const total = 0;
  return total;
};

const main = () => {
  const filename = 'day23/data.txt';
  const fileContents = readFileContents(filename);
  const parsedData = parseFileContents(fileContents);

  const partOne = solvePartOne(parsedData);
  console.log({ partOne });

  const partTwo = solvePartTwo(parsedData);
  console.log({ partTwo });
};

main();
