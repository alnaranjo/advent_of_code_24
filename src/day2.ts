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

type Safeness = 'safe' | 'unsafe';
const calculateReportSafeness = (levels: number[]): Safeness => {
  let totalLevels = levels.length;
  let totalIncreases = 0;
  let totalDecreases = 0;

  for (let i = 0; i < totalLevels - 1; ++i) {
    const a = levels[i];
    const b = levels[i + 1];
    const difference = a - b;

    if (Math.abs(difference) < 1 || Math.abs(difference) > 3) {
      return 'unsafe';
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
    return 'safe';
  }

  return 'unsafe';
};

const calculateReportsSafeness = (
  reports: Report[]
): { totalSafe: number; totalUnsafe: number } => {
  let totalSafe = 0;
  let totalUnsafe = 0;

  const list = reports.map((report) => calculateReportSafeness(report.levels));
  list.forEach((item) => {
    if (item === 'safe') {
      totalSafe += 1;
    } else {
      totalUnsafe += 1;
    }
  });

  return { totalSafe, totalUnsafe };
};

const main = () => {
  const filename = 'day2/data.txt';
  const input = readFileContents(filename);
  const data = parseInputData(input);

  const totalReports = calculateReportsSafeness(data.reports);

  console.log({ totalReports });
};

main();
