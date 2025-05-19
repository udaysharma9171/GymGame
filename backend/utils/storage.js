import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataDir = path.join(__dirname, '../data');

export const ensureDataFilesExist = () => {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  ['users.json', 'plans.json', 'progress.json'].forEach(file => {
    const fullPath = path.join(dataDir, file);
    if (!fs.existsSync(fullPath)) fs.writeFileSync(fullPath, '[]');
  });
};

export const readData = (file) => {
  try {
    return JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));
  } catch {
    return [];
  }
};

export const writeData = (file, data) => {
  fs.writeFileSync(path.join(dataDir, file), JSON.stringify(data, null, 2));
};
