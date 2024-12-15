export const calculateGCD = (a: number, b: number): number => {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }

  return a;
};

export const calculateExtendedGCD = (
  x: number,
  y: number
): { gcd: number; x: number; y: number } => {
  if (y === 0) {
    return { gcd: x, x: 1, y: 0 };
  }
  const result = calculateExtendedGCD(y, x % y);
  return {
    gcd: result.gcd,
    x: result.y,
    y: result.x - Math.floor(x / y) * result.y,
  };
};
