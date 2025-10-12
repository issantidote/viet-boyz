import fs from 'fs/promises';
import store from '../store/memoryStore.js';
let timer = null;
export function persistToFile() {
  return new Promise((resolve, reject) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(async () => {
      try {
        await fs.writeFile(store.DB_FILE, JSON.stringify(store.getAll(), null, 2), 'utf8');
        resolve();
      } catch (e) { reject(e); }
    }, 100);
  });
}
