const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const BASE = `${API}/api/volunteer-history`;

// 🧼 helper to clean query params
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

export async function listVolunteerHistory(params = {}) {
  const q = new URLSearchParams(cleanParams(params)).toString();
  const url = q ? `${BASE}?${q}` : BASE;
  try {
    const headers = {};
    
    // Add user ID to headers if provided
    if (params.userId) {
      headers['x-user-id'] = params.userId;
    }
    
    const res = await fetch(url, { headers });
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`Failed to fetch volunteer history: ${res.status} ${res.statusText} ${txt}`);
    }
    return res.json();
  } catch (e) {
    // Network error or other
    throw new Error(e.message || 'Failed to fetch volunteer history');
  }
}

export async function getVolunteerHistoryById(id) {
  try {
    const res = await fetch(`${BASE}/${id}`);
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`Volunteer history fetch failed: ${res.status} ${res.statusText} ${txt}`);
    }
    return res.json();
  } catch (e) {
    throw new Error(e.message || 'Volunteer history event not found');
  }
}

export async function createVolunteerHistory(payload) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': 'secret' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Failed to create volunteer history: ${res.status} ${res.statusText} ${txt}`);
  }
  return res.json();
}

export async function updateVolunteerHistory(id, patch) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'x-api-key': 'secret' },
    body: JSON.stringify(patch)
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Failed to update volunteer history: ${res.status} ${res.statusText} ${txt}`);
  }
  return res.json();
}

export async function deleteVolunteerHistory(id) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
    headers: { 'x-api-key': 'secret' }
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Failed to delete volunteer history: ${res.status} ${res.statusText} ${txt}`);
  }
  return true;
}

// Specialized API functions for volunteer history

export async function getVolunteerHistoryByVolunteerId(volunteerId) {
  try {
    const res = await fetch(`${BASE}/volunteer/${volunteerId}`);
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`Failed to fetch volunteer history by volunteer ID: ${res.status} ${res.statusText} ${txt}`);
    }
    return res.json();
  } catch (e) {
    throw new Error(e.message || 'Failed to fetch volunteer history by volunteer ID');
  }
}

export async function getVolunteerHistoryByStatus(status) {
  try {
    const res = await fetch(`${BASE}/status/${encodeURIComponent(status)}`);
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`Failed to fetch volunteer history by status: ${res.status} ${res.statusText} ${txt}`);
    }
    return res.json();
  } catch (e) {
    throw new Error(e.message || 'Failed to fetch volunteer history by status');
  }
}

export async function getVolunteerHistoryStatistics() {
  try {
    const res = await fetch(`${BASE}/stats/overview`);
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`Failed to fetch volunteer history statistics: ${res.status} ${res.statusText} ${txt}`);
    }
    return res.json();
  } catch (e) {
    throw new Error(e.message || 'Failed to fetch volunteer history statistics');
  }
}