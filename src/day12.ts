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

    const top = getNode(graph, x, y - 1);
    const bottom = getNode(graph, x, y + 1);
    const left = getNode(graph, x - 1, y);
    const right = getNode(graph, x + 1, y);

    if (!top || top.value !== plant) {
      total += 1;
    }

    if (!bottom || bottom.value !== plant) {
      total += 1;
    }

    if (!left || left.value !== plant) {
      total += 1;
    }

    if (!right || right.value !== plant) {
      total += 1;
    }
  }

  return total;
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
  let total = 0;
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
