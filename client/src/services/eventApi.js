const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const BASE = `${API}/api/events`;

// helper to clean query params
function cleanParams(params = {}) {
  const cleaned = {};
  for (const [key, value] of Object.entries(params)) {
    if (
      value === undefined ||
      value === null ||
      value === '' ||
      value === 'undefined' ||
      value === 'null'
    ) continue;
    cleaned[key] = value;
  }
  return cleaned;
}

export async function listEvents(params = {}) {
  const q = new URLSearchParams(cleanParams(params)).toString();
  const url = q ? `${BASE}?${q}` : BASE;
  try {
    const headers = {};
    const res = await fetch(url, { headers });
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`Failed to fetch events: ${res.status} ${res.statusText} ${txt}`);
    }
    return res.json();
  } catch (e) {
    // Network error or other
    throw new Error(e.message || 'Failed to fetch events');
  }
}

export async function getEvent(id) {
  try {
    const res = await fetch(`${BASE}/${id}`);
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`Event fetch failed: ${res.status} ${res.statusText} ${txt}`);
    }
    return res.json();
  } catch (e) {
    throw new Error(e.message || 'Event not found');
  }
}

export async function createEvent(payload) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': 'secret' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Failed to create event: ${res.status} ${res.statusText} ${txt}`);
  }
  return res.json();
}

export async function updateEvent(id, patch) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'x-api-key': 'secret' },
    body: JSON.stringify(patch)
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Failed to update event: ${res.status} ${res.statusText} ${txt}`);
  }
  return res.json();
}

export async function deleteEvent(id) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
    headers: { 'x-api-key': 'secret' }
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Failed to delete event: ${res.status} ${res.statusText} ${txt}`);
  }
  return true;
}
