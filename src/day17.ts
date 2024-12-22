import { readFileContents } from './utils/file';

type ComputerState = {
  instructionPointer: number;
  registerA: number;
  registerB: number;
  registerC: number;
  program: number[];
};

type Opcode = number;

type Instruction =
  | 'adv'
  | 'bxl'
  | 'bst'
  | 'jnz'
  | 'bxc'
  | 'out'
  | 'bdv'
  | 'cdv';

const Instructions: Record<Opcode, Instruction> = {
  0: 'adv',
  1: 'bxl',
  2: 'bst',
  3: 'jnz',
  4: 'bxc',
  5: 'out',
  6: 'bdv',
  7: 'cdv',
};

const parseFileContents = (fileContents: string): ComputerState => {
  const sections = fileContents.split('\n\n');
  if (sections.length !== 2) {
    throw new Error('Unable to parse file contents. Invalid format');
  }

  const [registerA, registerB, registerC] = sections[0]
    .split('\n')
    .map((line, index) => {
      const registerValue = line.split(': ')[1];
      return parseInt(registerValue, 10);
    });

  const program = sections[1]
    .split(': ')[1]
    .split(',')
    .map((item) => parseInt(item, 10));

  return { instructionPointer: 0, registerA, registerB, registerC, program };
};

const getInstruction = (state: ComputerState): Instruction => {
  const { instructionPointer, program } = state;
  const opcode = program[instructionPointer];
  return Instructions[opcode];
};

const getLiteralOperand = (state: ComputerState): number => {
  const { instructionPointer, program } = state;
  return program[instructionPointer + 1];
};

const getComboOperand = (state: ComputerState): number => {
  const { instructionPointer, program } = state;
  const value = program[instructionPointer + 1];
  switch (value) {
    case 0:
      return 0;
    case 1:
      return 1;
    case 2:
      return 2;
    case 3:
      return 3;
    case 4:
      return state.registerA;
    case 5:
      return state.registerB;
    case 6:
      return state.registerC;
    default:
      return -1;
  }
};

const printProgam = (originalState: ComputerState) => {
  const state = { ...originalState };
  let line = 0;

  while (state.instructionPointer < state.program.length) {
    const instruction = getInstruction(state);
    const comboOperand = getComboOperand(state);
    const literalOperand = getLiteralOperand(state);

    console.log(
      `${line}: ${instruction} $[l: ${literalOperand}, c:  ${comboOperand}`
    );

    state.instructionPointer += 2;
    line += 1;
  }
};

const printState = (state: ComputerState) => {
  const { instructionPointer, registerA, registerB, registerC } = state;
  const instruction = getInstruction(state);
  const comboOperand = getComboOperand(state);
  const literalOperand = getLiteralOperand(state);

  const message = `
  instructionPointer: ${instructionPointer},
  registerA: ${registerA},
  registerB: ${registerB},
  registerC: ${registerC}
  instruction: ${instruction},
  literalOperand: ${literalOperand},
  comboOperand: ${comboOperand}
  `;

  console.log(message);
};

const computeProgram = (state: ComputerState): number[] => {
  printProgam(state);

  const output: number[] = [];
  while (state.instructionPointer < state.program.length) {
    // printState(state);

    // 2,4 bst registerA % 8 -> registerB
    // 1,1 bxl registerB ^ 1 -> registerB
    // 7,5 cdv registerA / 2^registerB -> registerC
    // 1,5 bxl registerB ^ 5 -> registerB
    // 4,1 bxc registerB ^ registerC -> registerB
    // 5,5 out registerB % 8
    // 0,3 adv registerA / 2^3 -> regisdterA
    // 3,0 jnz 0

    const instruction = getInstruction(state);
    const comboOperand = getComboOperand(state);
    const literalOperand = getLiteralOperand(state);

    switch (instruction) {
      case 'adv': {
        const numerator = state.registerA;
        const denominator = 2 ** comboOperand;
        const result = Math.floor(numerator / denominator);
        state.registerA = result;
        break;
      }

      case 'bxl': {
        const result = state.registerB ^ literalOperand;
        state.registerB = result;
        break;
      }

      case 'bst': {
        const result = comboOperand % 8;
        state.registerB = result;
        break;
      }

      case 'jnz': {
        if (state.registerA === 0) {
          break;
        }
        state.instructionPointer = literalOperand;
        continue;
      }

      case 'bxc': {
        const result = state.registerB ^ state.registerC;
        state.registerB = result;
        break;
      }

      case 'out': {
        const result = comboOperand % 8;
        output.push(result);
        break;
      }

      case 'bdv': {
        const numerator = state.registerA;
        const denominator = 2 ** comboOperand;
        const result = Math.floor(numerator / denominator);
        state.registerB = result;
        break;
      }

      case 'cdv': {
        const numerator = state.registerA;
        const denominator = 2 ** comboOperand;
        const result = Math.floor(numerator / denominator);
        state.registerC = result;
        break;
      }

      default:
    }

    state.instructionPointer += 2;
  }

  return output;
};

const solvePartOne = (state: ComputerState): string => {
  const output = computeProgram(state);
  return output.join(',');
};

const solvePartTwo = (data: ComputerState): string => {
  return '';
};

const main = () => {
  const filename = 'day17/data.txt';
  const fileContents = readFileContents(filename);
  const parsedData = parseFileContents(fileContents);

  const partOne = solvePartOne(parsedData);
  console.log({ partOne });

  const partTwo = solvePartTwo(parsedData);
  console.log({ partTwo });
};

main();
