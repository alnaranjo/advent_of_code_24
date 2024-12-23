export const printGrid = (grid: string[][]) => {
  const height = grid.length;
  const width = grid[0].length;

  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      const tile = grid[y][x];
      process.stdout.write(tile);
    }
    console.log();
  }
  console.log();
};
