import { v4 as uuid } from 'uuid';
import { memoizeByKey } from '../utils/cache.js';
import fs from 'fs';

// Volunteer History specific data storage
const VOLUNTEER_HISTORY_FILE = 'volunteerHistory.data.json';
const volunteerHistoryMap = new Map();

// Load volunteer history data from file on startup
function loadVolunteerHistoryData() {
  if (fs.existsSync(VOLUNTEER_HISTORY_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(VOLUNTEER_HISTORY_FILE, 'utf8'));
      if (Array.isArray(data)) {
        data.forEach(item => volunteerHistoryMap.set(item.id, item));
        console.log(`Loaded ${data.length} volunteer history events from file`);
      }
    } catch (e) {
      console.warn('Failed to load volunteer history data file:', e.message);
    }
  }
}

// Save volunteer history data to file
async function saveVolunteerHistoryData() {
  try {
    const data = Array.from(volunteerHistoryMap.values());
    await fs.promises.writeFile(VOLUNTEER_HISTORY_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save volunteer history data:', e.message);
  }
}

// Load data on module initialization
loadVolunteerHistoryData();

// Enhanced store wrapper for volunteer history
const volunteerHistoryStore = {
  getAll() {
    return Array.from(volunteerHistoryMap.values());
  },
  get(id) {
    return volunteerHistoryMap.get(id) || null;
  },
  set(id, item) {
    volunteerHistoryMap.set(id, item);
  },
  delete(id) {
    return volunteerHistoryMap.delete(id);
  }
};

// Filter function for volunteer history matching
function matches(event, { name, location, skill, urgency, status, volunteerId, q, userId }) {
  // First check user ownership - this is the most important filter
  if (userId && event.userId !== userId) return false;
  
  if (name && !event.name?.toLowerCase().includes(name.toLowerCase())) return false;
  if (location && !event.location?.toLowerCase().includes(location.toLowerCase())) return false;
  if (skill && !(event.requiredSkills || []).map(s => s.toLowerCase()).includes(skill.toLowerCase())) return false;
  if (urgency && event.urgency !== urgency) return false;
  if (status && event.status !== status) return false;
  if (volunteerId && event.volunteerId !== volunteerId) return false;
  if (q) {
    const searchText = [
      event.name || '',
      event.description || '',
      event.location || '',
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
export async function list(query, userId = null) {
  const key = JSON.stringify({
    name: query.name,
    location: query.location,
    skill: query.skill,
    urgency: query.urgency,
    status: query.status,
    volunteerId: query.volunteerId,
    q: query.q,
    limit: query.limit,
    offset: query.offset,
    userId: userId // Include userId in cache key
  });
  return cachedList(key);
}

export async function getById(id, userId = null) {
  const event = volunteerHistoryStore.get(id);
  if (!event) return null;
  
  // Check if user owns this event
  if (userId && event.userId !== userId) return null;
  
  return event;
}

export async function create(input, userId = null) {
  const now = new Date().toISOString();
  const event = { 
    id: uuid(), 
    createdAt: now, 
    updatedAt: now,
    userId: userId, // Associate with user
    ...input 
  };
  volunteerHistoryStore.set(event.id, event);
  cachedList.clear();
  await saveVolunteerHistoryData();
  return event;
}

export async function update(id, patch, userId = null) {
  const existing = volunteerHistoryStore.get(id);
  if (!existing) return null;
  
  // Check if user owns this event
  if (userId && existing.userId !== userId) return null;
  
  const updated = { 
    ...existing, 
    ...patch, 
    updatedAt: new Date().toISOString() 
  };
  volunteerHistoryStore.set(id, updated);
  cachedList.clear();
  await saveVolunteerHistoryData();
  return updated;
}

export async function remove(id, userId = null) {
  const existing = volunteerHistoryStore.get(id);
  if (!existing) return false;
  
  // Check if user owns this event
  if (userId && existing.userId !== userId) return false;
  
  const ok = volunteerHistoryStore.delete(id);
  if (ok) {
    cachedList.clear();
    await saveVolunteerHistoryData();
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