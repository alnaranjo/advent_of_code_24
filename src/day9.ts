import { readFileContents } from './utils/file';

type Data = {
  diskmap: string[];
};

const parseFileContents = (fileContents: string): Data => {
  const densediskmap = fileContents.split('').map((val) => parseInt(val, 10));

  let id = 0;
  let diskmap: string[] = [];
  for (let i = 0; i < densediskmap.length; ++i) {
    const size = densediskmap[i];
    if (i % 2 === 0) {
      diskmap = diskmap.concat(Array(size).fill(id.toString()));
      id += 1;
    } else {
      diskmap = diskmap.concat(Array(size).fill('.'));
    }
  }

  return { diskmap };
};

const sortDiskmap = (diskmap: string[]): string[] => {
  const sorted = [...diskmap];
  let left = 0;
  let right = sorted.length - 1;
  while (left <= right) {
    // skip if not an empty space from left
    if (sorted[left] !== '.') {
      left += 1;
    }
    // skip if not a valid file size from right
    else if (sorted[right] === '.') {
      right -= 1;
    } else {
      const temp = sorted[left];
      sorted[left] = sorted[right];
      sorted[right] = temp;
    }
  }

  return sorted;
};

const getNextAvailableIndex = (
  size: number,
  right: number,
  sorted: string[]
): number => {
  let count = 0;
  for (let i = 0; i < right; ++i) {
    if (sorted[i] === '.') {
      count += 1;
      if (count == size) {
        return i - size + 1;
      }
    } else {
      count = 0;
    }
  }

  return -1;
};

const getSizeNeeded = (index: number, sorted: string[]): number => {
  let size = 0;
  let i = index;
  let value = sorted[i];
  while (sorted[i] === value) {
    size += 1;
    i -= 1;
  }

  return size;
};

const sortDiskmapTwo = (diskmap: string[]): string[] => {
  const sorted = [...diskmap];
  // let left = 0;
  let right = sorted.length - 1;

  while (right > 0) {
    if (sorted[right] === '.') {
      right -= 1;
      continue;
    }

    const size = getSizeNeeded(right, sorted);
    const nextAvailableIndex = getNextAvailableIndex(size, right, sorted);
    if (nextAvailableIndex === -1) {
      right -= size;
      continue;
    }

    for (let i = nextAvailableIndex; i < nextAvailableIndex + size; ++i) {
      const temp = sorted[i];
      sorted[i] = sorted[right];
      sorted[right] = temp;
      right -= 1;
    }
  }

  return sorted;
};

const calculateChecksum = (diskmap: string[]): number => {
  let total = 0;
  for (let i = 0; i < diskmap.length; ++i) {
    const value = diskmap[i];
    if (value === '.') {
      continue;
    }
    total += i * parseInt(value, 10);
  }
  return total;
};

const solvePartOne = (data: Data): number => {
  const sorted = sortDiskmap(data.diskmap);
  return calculateChecksum(sorted);
};

const solvePartTwo = (data: Data): number => {
  const sorted = sortDiskmapTwo(data.diskmap);
  return calculateChecksum(sorted);
};

const main = () => {
  const filename = 'day9/data.txt';
  const fileContents = readFileContents(filename);
  const parsedData = parseFileContents(fileContents);

  const partOne = solvePartOne(parsedData);
  console.log({ partOne });

  const partTwo = solvePartTwo(parsedData);
  console.log({ partTwo });
};

main();
