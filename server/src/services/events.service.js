import { v4 as uuid } from 'uuid';
import { memoizeByKey } from '../utils/cache.js';
import fs from 'fs';

// Event specific data storage
const EVENTS_FILE = 'events.data.json';
const eventsMap = new Map();

// Load event data from file on startup
function loadEventData() {
  if (fs.existsSync(EVENTS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf8'));
      if (Array.isArray(data)) {
        data.forEach(item => eventsMap.set(item.id, item));
        console.log(`Loaded ${data.length} events from file`);
      }
    } catch (e) {
      console.warn('Failed to load events data file:', e.message);
    }
  }
}

// Save event history data to file
async function saveEventData() {
  try {
    const data = Array.from(eventsMap.values());
    await fs.promises.writeFile(EVENTS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save event data:', e.message);
  }
}

// Load data on module initialization
loadEventData();

// Enhanced store wrapper for events
const eventStore = {
  getAll() {
    return Array.from(eventsMap.values());
  },
  get(id) {
    return eventsMap.get(id) || null;
  },
  set(id, item) {
    eventsMap.set(id, item);
  },
  delete(id) {
    return eventsMap.delete(id);
  }
};

// Filter function for event matching
function matches(event, { eventName, eventDescription, location, skill, urgency, status, eventDate, q, userId }) {
  // First check user ownership - this is the most important filter
  if (userId && event.userId !== userId) return false;
  
  if (eventName && !event.eventName?.toLowerCase().includes(eventName.toLowerCase())) return false;
  if (eventDescription && !event.eventDescription?.toLowerCase().includes(eventDescription.toLowerCase())) return false;
  if (location && !event.location?.toLowerCase().includes(location.toLowerCase())) return false;
  if (skill && !(event.requiredSkills || []).map(s => s.toLowerCase()).includes(skill.toLowerCase())) return false;
  if (urgency && event.urgency !== urgency) return false;
  if (eventDate && event.eventDate !== eventDate) return false;
  //if (status && event.status !== status) return false;
  //if (volunteerId && event.volunteerId !== volunteerId) return false;
  if (q) {
    const searchText = [
      event.eventName || '',
      event.eventDescription || '',
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
  const all = eventStore.getAll();
  const filtered = all.filter(event => matches(event, query));
  
  // Sort by eventDate (most recent first)
  filtered.sort((a, b) => {
    const dateA = new Date(a.eventDate || 0);
    const dateB = new Date(b.eventDate || 0);
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
    eventName: query.eventName,
    eventDescription: query.eventDescription,
    location: query.location,
    skills: query.skills,
    urgency: query.urgency,
    //status: query.status,
    eventDate: query.eventDate,
    userId: userId,
    q: query.q,
    limit: query.limit,
    offset: query.offset,
  });
  return cachedList(key);
}

export async function getById(id, userId = null) {
  const event = eventStore.get(id);
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
  eventStore.set(event.id, event);
  cachedList.clear();
  await saveEventData();
  return event;
}

export async function update(id, patch, userId = null) {
  const existing = eventStore.get(id);
  if (!existing) return null;
  
  // Check if user owns this event
  if (userId && existing.userId !== userId) return null;
  
  const updated = { 
    ...existing, 
    ...patch, 
    updatedAt: new Date().toISOString() 
  };
  eventStore.set(id, updated);
  cachedList.clear();
  await saveEventData();
  return updated;
}

export async function remove(id, userId = null) {
  const existing = eventStore.get(id);
  if (!existing) return false;
  
  // Check if user owns this event
  //if (userId && existing.userId !== userId) return false;
  
  const ok = eventStore.delete(id);
  if (ok) {
    cachedList.clear();
    await saveEventData();
  }
  return ok;
}

// Additional service functions specific to event

/*
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
*/