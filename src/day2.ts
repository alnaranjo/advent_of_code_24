import { readFileContents } from './utils/file';

type Report = {
  levels: number[];
};

type Data = {
  reports: Report[];
};

const parseInputData = (input: string): Data => {
  const reports: Report[] = [];

  const lines = input.split('\n');
  if (lines.length === 0) {
    throw new Error('Unable to parse input. No Data provided');
  }

  lines.forEach((line) => {
    const items = line.split(' ');
    if (items.length === 0) {
      throw new Error(
        'Unable to parse input line. Invalid number of levels found'
      );
    }

    const levels = items.map((item) => {
      try {
        return parseInt(item, 10);
      } catch (error) {
        throw new Error('Unable to parse input line. Expected number');
      }
    });

    reports.push({ levels });
  });

  return { reports };
};

const isReportSafe = (levels: number[]): boolean => {
  let totalLevels = levels.length;
  let totalIncreases = 0;
  let totalDecreases = 0;

  for (let i = 0; i < totalLevels - 1; ++i) {
    const previous = levels[i];
    const current = levels[i + 1];
    const difference = current - previous;

    if (Math.abs(difference) < 1 || Math.abs(difference) > 3) {
      return false;
    }

    if (difference < 0) {
      totalIncreases += 1;
    } else {
      totalDecreases += 1;
    }
  }

  if (
    totalIncreases === totalLevels - 1 ||
    totalDecreases === totalLevels - 1
  ) {
    return true;
  }

  return false;
};

const getPermutations = (list: number[]): number[][] => {
  const permutations: number[][] = [];

  for (let i = 0; i < list.length; ++i) {
    const modified = [...list];
    modified.splice(i, 1);
    permutations.push(modified);
  }

  return permutations;
};

const calculatePartOne = (
  reports: Report[]
): { totalSafe: number; totalUnsafe: number } => {
  let totalSafe = 0;
  let totalUnsafe = 0;

  reports.forEach((report) => {
    const isSafe = isReportSafe(report.levels);
    if (isSafe) {
      totalSafe += 1;
    } else {
      totalUnsafe += 1;
    }
  });

  return { totalSafe, totalUnsafe };
};

const calculatePartTwo = (
  reports: Report[]
): { totalSafe: number; totalUnsafe: number } => {
  let totalSafe = 0;
  let totalUnsafe = 0;

  reports.forEach((report) => {
    const isSafe = isReportSafe(report.levels);

    if (isSafe) {
      totalSafe += 1;
    } else {
      const permutations = getPermutations(report.levels);
      let safeFound = false;
      for (let i = 0; i < permutations.length; ++i) {
        safeFound = isReportSafe(permutations[i]);
        if (safeFound) {
          break;
        }
      }

      if (safeFound) {
        totalSafe += 1;
      } else {
        totalUnsafe += 1;
      }
    }
  });

  return { totalSafe, totalUnsafe };
};

const main = () => {
  const filename = 'day2/data.txt';
  const input = readFileContents(filename);
  const data = parseInputData(input);

  const partOne = calculatePartOne(data.reports);
  console.log({ partOne });

  const partTwo = calculatePartTwo(data.reports);
  console.log({ partTwo });
};

main();
