import fs from 'fs';
import path from 'path';

export const readFileContents = (filename: string): string => {
  try {
    const filePath = path.join(__dirname, '..', 'data', filename);
    const data = fs.readFileSync(filePath);
    return data.toString('utf8');
  } catch (error) {
    throw new Error(`Unable to read file "${filename}". ${error}`);
  }
};
