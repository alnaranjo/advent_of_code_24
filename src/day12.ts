import { readFileContents } from './utils/file';
import {
  createGraph,
  Graph,
  Node,
  getNodeKey,
  graphDFS,
  arePathsEqual,
  parseNodeKey,
  getNode,
} from './utils/graph';

type Data = {
  plot: string[][];
  width: number;
  height: number;
  plants: Map<string, string[]>;
};

const parseFileContents = (fileContents: string): Data => {
  const plot = fileContents.split('\n').map((item) => item.split(''));
  const width = plot[0].length;
  const height = plot.length;

  const plants: Map<string, string[]> = new Map();

  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      const plant = plot[y][x];
      const key = getNodeKey(x, y);
      const keys = plants.get(plant) || [];
      keys.push(key);
      plants.set(plant, keys);
    }
  }

  return { plot, width, height, plants };
};

const getRegions = (
  graph: Graph<string>,
  locations: string[]
): Node<string>[][] => {
  const regions: Node<string>[][] = [];

  for (const location of locations) {
    const region = graphDFS({
      graph,
      startKey: location,
      predicate: (current, neighbor) => current.value === neighbor.value,
    });

    const newRegion = regions.every(
      (existingRegion) => !arePathsEqual(region, existingRegion)
    );

    if (newRegion) {
      regions.push(region);
    }
  }

  return regions;
};

const getPerimeter = ({
  graph,
  plant,
  region,
}: {
  graph: Graph<string>;
  plant: string;
  region: Node<string>[];
}): number => {
  let total = 0;
  for (const node of region) {
    const { x, y } = parseNodeKey(node.key);

    const top = getNode(graph, x, y - 1)?.value;
    const bottom = getNode(graph, x, y + 1)?.value;
    const left = getNode(graph, x - 1, y)?.value;
    const right = getNode(graph, x + 1, y)?.value;

    if (top !== plant) {
      total += 1;
    }

    if (bottom !== plant) {
      total += 1;
    }

    if (left !== plant) {
      total += 1;
    }

    if (right !== plant) {
      total += 1;
    }
  }

  return total;
};

const getSides = ({
  graph,
  plant,
  region,
}: {
  graph: Graph<string>;
  plant: string;
  region: Node<string>[];
}) => {
  let totalSides = 0;

  for (const node of region) {
    const { x, y } = parseNodeKey(node.key);

    const topLeft = getNode(graph, x - 1, y - 1)?.value;
    const top = getNode(graph, x, y - 1)?.value;
    const topRight = getNode(graph, x + 1, y - 1)?.value;
    const left = getNode(graph, x - 1, y)?.value;
    const right = getNode(graph, x + 1, y)?.value;
    const bottomLeft = getNode(graph, x - 1, y + 1)?.value;
    const bottom = getNode(graph, x, y + 1)?.value;
    const bottomRight = getNode(graph, x + 1, y + 1)?.value;

    // outter corners
    if (top !== plant && left !== plant) {
      totalSides += 1;
    }

    if (top !== plant && right !== plant) {
      totalSides += 1;
    }

    if (bottom !== plant && left !== plant) {
      totalSides += 1;
    }

    if (bottom !== plant && right !== plant) {
      totalSides += 1;
    }

    //inner corners
    if (top === plant && left === plant && topLeft !== plant) {
      totalSides += 1;
    }

    if (top === plant && right === plant && topRight !== plant) {
      totalSides += 1;
    }

    if (bottom === plant && left === plant && bottomLeft !== plant) {
      totalSides += 1;
    }

    if (bottom === plant && right === plant && bottomRight !== plant) {
      totalSides += 1;
    }
  }

  return totalSides;
};

const solvePartOne = (data: Data): number => {
  const graph = createGraph(data.plot);

  const allRegions: Map<string, Node<string>[][]> = new Map();
  for (const [plant, locations] of data.plants) {
    const regions = getRegions(graph, locations);
    allRegions.set(plant, regions);
  }

  let total = 0;
  for (const [plant, regions] of allRegions.entries()) {
    for (const region of regions) {
      const perimeter = getPerimeter({ graph, plant, region });
      const area = region.length;
      total += area * perimeter;
    }
  }

  return total;
};

const solvePartTwo = (data: Data): number => {
  const graph = createGraph(data.plot);

  const allRegions: Map<string, Node<string>[][]> = new Map();
  for (const [plant, locations] of data.plants) {
    const regions = getRegions(graph, locations);
    allRegions.set(plant, regions);
  }

  let total = 0;
  for (const [plant, regions] of allRegions.entries()) {
    for (const region of regions) {
      const sides = getSides({ graph, plant, region });
      const area = region.length;
      total += area * sides;
    }
  }

  return total;
};

const main = () => {
  const filename = 'day12/data.txt';
  const fileContents = readFileContents(filename);
  const parsedData = parseFileContents(fileContents);

  const partOne = solvePartOne(parsedData);
  console.log({ partOne });

  const partTwo = solvePartTwo(parsedData);
  console.log({ partTwo });
};

main();
