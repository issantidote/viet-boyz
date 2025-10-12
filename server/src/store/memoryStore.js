import fs from 'fs';
const DB_FILE = 'profiles.data.json';
const map = new Map();

if (fs.existsSync(DB_FILE)) {
  try { JSON.parse(fs.readFileSync(DB_FILE, 'utf8')).forEach(p => map.set(p.id, p)); }
  catch (e) { console.warn('Failed to load existing data file:', e.message); }
}

const snapshot = () => Array.from(map.values());
export default {
  get: (id) => map.get(id),
  set: (id, v) => map.set(id, v),
  delete: (id) => map.delete(id),
  getAll: () => snapshot(),
  size: () => map.size,
  DB_FILE,
};
