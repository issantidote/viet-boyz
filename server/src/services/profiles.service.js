import { v4 as uuid } from 'uuid';
import store from '../store/memoryStore.js';
import { memoizeByKey } from '../utils/cache.js';
import { persistToFile } from '../utils/persist.js';

function matches(p, { city, skill, availableOn, q }) {
  if (city && p.location.city.toLowerCase() !== city.toLowerCase()) return false;
  if (skill && !p.skills.map(s=>s.toLowerCase()).includes(skill.toLowerCase())) return false;
  if (availableOn && !p.availability.days.includes(availableOn)) return false;
  if (q) {
    const blob = [p.name, p.skills.join(' ')].join(' ').toLowerCase();
    if (!blob.includes(q.toLowerCase())) return false;
  }
  return true;
}

const cachedList = memoizeByKey(async (key) => {
  const query = JSON.parse(key);
  const all = store.getAll();
  const filtered = all.filter(p => matches(p, query));
  const limit = query.limit ?? 50;
  const offset = query.offset ?? 0;
  return { total: filtered.length, items: filtered.slice(offset, offset + limit) };
});

export async function list(query) {
  const key = JSON.stringify({
    city: query.city, skill: query.skill,
    availableOn: query.availableOn, q: query.q,
    limit: query.limit, offset: query.offset
  });
  return cachedList(key);
}
export async function getById(id) { return store.get(id) || null; }
export async function create(input) {
  const now = new Date().toISOString();
  const profile = { id: uuid(), createdAt: now, updatedAt: now, ...input };
  store.set(profile.id, profile); await persistToFile(); return profile;
}
export async function update(id, patch) {
  const existing = store.get(id); if (!existing) return null;
  const updated = { ...existing, ...patch, updatedAt: new Date().toISOString() };
  store.set(id, updated); cachedList.clear(); await persistToFile(); return updated;
}
export async function remove(id) {
  const ok = store.delete(id); if (ok) { cachedList.clear(); await persistToFile(); }
  return ok;
}
