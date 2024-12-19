export type Vector2 = {
  x: number;
  y: number;
};

export const isVector2InBounds = (
  v: Vector2,
  width: number,
  height: number
): boolean => {
  return v.x >= 0 && v.x < width && v.y >= 0 && v.y < height;
};

export const vector2ToString = (v: Vector2) => `${v.x},${v.y}`;

export const parseVector2 = (v: string): Vector2 => {
  const values = v.split(',');
  if (values.length !== 2) {
    throw new Error('Unable to parse vector2. Invalid number of elements');
  }
  try {
    return { x: parseInt(values[0], 10), y: parseInt(values[1], 10) };
  } catch (error) {
    throw new Error('Unable to parse vetor2');
  }
};

export const rotate90 = (
  direction: Vector2,
  clockwise: boolean = true
): Vector2 => {
  return clockwise
    ? { x: -direction.y, y: direction.x }
    : { x: direction.y, y: direction.x };
};
