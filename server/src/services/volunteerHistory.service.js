import { v4 as uuid } from 'uuid';
import store from '../store/memoryStore.js';
import { memoizeByKey } from '../utils/cache.js';
import { persistToFile } from '../utils/persist.js';

// Custom store key for volunteer history to separate from profiles
const VOLUNTEER_HISTORY_KEY = 'volunteer-history';

// Enhanced store wrapper for volunteer history
const volunteerHistoryStore = {
  getAll() {
    const data = store.get(VOLUNTEER_HISTORY_KEY) || [];
    return Array.isArray(data) ? data : [];
  },
  get(id) {
    const all = this.getAll();
    return all.find(item => item.id === id) || null;
  },
  set(id, item) {
    const all = this.getAll();
    const index = all.findIndex(existing => existing.id === id);
    if (index >= 0) {
      all[index] = item;
    } else {
      all.push(item);
    }
    store.set(VOLUNTEER_HISTORY_KEY, all);
  },
  delete(id) {
    const all = this.getAll();
    const index = all.findIndex(item => item.id === id);
    if (index >= 0) {
      all.splice(index, 1);
      store.set(VOLUNTEER_HISTORY_KEY, all);
      return true;
    }
    return false;
  }
};

// Filter function for volunteer history matching
function matches(event, { name, location, skill, urgency, status, volunteerId, q }) {
  if (name && !event.name.toLowerCase().includes(name.toLowerCase())) return false;
  if (location && !event.location.toLowerCase().includes(location.toLowerCase())) return false;
  if (skill && !event.requiredSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())) return false;
  if (urgency && event.urgency !== urgency) return false;
  if (status && event.status !== status) return false;
  if (volunteerId && event.volunteerId !== volunteerId) return false;
  if (q) {
    const searchText = [
      event.name,
      event.description,
      event.location,
      ...(event.requiredSkills || []),
      event.notes || ''
    ].join(' ').toLowerCase();
    if (!searchText.includes(q.toLowerCase())) return false;
  }
  return true;
}

// Cached list function with memoization
const cachedList = memoizeByKey(async (key) => {
  const query = JSON.parse(key);
  const all = volunteerHistoryStore.getAll();
  const filtered = all.filter(event => matches(event, query));
  
  // Sort by eventDate (most recent first) or createdAt
  filtered.sort((a, b) => {
    const dateA = new Date(a.eventDate || a.createdAt || 0);
    const dateB = new Date(b.eventDate || b.createdAt || 0);
    return dateB - dateA;
  });
  
  const limit = query.limit ?? 50;
  const offset = query.offset ?? 0;
  return { 
    total: filtered.length, 
    items: filtered.slice(offset, offset + limit) 
  };
});

// Service functions
export async function list(query) {
  const key = JSON.stringify({
    name: query.name,
    location: query.location,
    skill: query.skill,
    urgency: query.urgency,
    status: query.status,
    volunteerId: query.volunteerId,
    q: query.q,
    limit: query.limit,
    offset: query.offset
  });
  return cachedList(key);
}

export async function getById(id) {
  return volunteerHistoryStore.get(id);
}

export async function create(input) {
  const now = new Date().toISOString();
  const event = { 
    id: uuid(), 
    createdAt: now, 
    updatedAt: now, 
    ...input 
  };
  volunteerHistoryStore.set(event.id, event);
  cachedList.clear();
  await persistToFile();
  return event;
}

export async function update(id, patch) {
  const existing = volunteerHistoryStore.get(id);
  if (!existing) return null;
  
  const updated = { 
    ...existing, 
    ...patch, 
    updatedAt: new Date().toISOString() 
  };
  volunteerHistoryStore.set(id, updated);
  cachedList.clear();
  await persistToFile();
  return updated;
}

export async function remove(id) {
  const ok = volunteerHistoryStore.delete(id);
  if (ok) {
    cachedList.clear();
    await persistToFile();
  }
  return ok;
}

// Additional service functions specific to volunteer history

export async function getByVolunteerId(volunteerId) {
  const all = volunteerHistoryStore.getAll();
  return all.filter(event => event.volunteerId === volunteerId);
}

export async function getByStatus(status) {
  const all = volunteerHistoryStore.getAll();
  return all.filter(event => event.status === status);
}

export async function getStatistics() {
  const all = volunteerHistoryStore.getAll();
  
  const stats = {
    total: all.length,
    byStatus: {
      'Started': all.filter(e => e.status === 'Started').length,
      'Not Start': all.filter(e => e.status === 'Not Start').length,
      'Done': all.filter(e => e.status === 'Done').length
    },
    byUrgency: {
      'High': all.filter(e => e.urgency === 'High').length,
      'Medium': all.filter(e => e.urgency === 'Medium').length,
      'Low': all.filter(e => e.urgency === 'Low').length
    },
    totalHours: all.reduce((sum, e) => sum + (e.participationHours || 0), 0)
  };
  
  return stats;
}