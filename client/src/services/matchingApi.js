// Backend Volunteer Matching API calls
const API_BASE = 'http://localhost:4000/api';

/**
 * Get auth token from localStorage
 */
function getAuthToken() {
  return localStorage.getItem('token');
}

/**
 * Get matched volunteers for an event
 * @param {string} eventId - Event ID
 * @param {number} [minScore] - Minimum match score (0-100)
 * @returns {Promise<Array>} Array of matched volunteers with scores
 */
export async function getMatchedVolunteers(eventId, minScore = 0) {
  const token = getAuthToken();
  const params = new URLSearchParams();
  
  if (minScore) params.append('minScore', minScore);

  const response = await fetch(`${API_BASE}/matching/events/${eventId}/volunteers?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch matched volunteers' }));
    throw new Error(error.message || 'Failed to fetch matched volunteers');
  }

  return response.json();
}

/**
 * Get match score for a specific volunteer-event pair
 * @param {string} eventId - Event ID
 * @param {string} volunteerId - Volunteer ID
 * @returns {Promise<Object>} Match details with score and reasons
 */
export async function getMatchScore(eventId, volunteerId) {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE}/matching/events/${eventId}/volunteers/${volunteerId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch match score' }));
    throw new Error(error.message || 'Failed to fetch match score');
  }

  return response.json();
}

/**
 * Get matching events for a volunteer
 * @param {string} volunteerId - Volunteer ID
 * @param {number} [minScore] - Minimum match score (0-100)
 * @returns {Promise<Array>} Array of matched events with scores
 */
export async function getMatchingEvents(volunteerId, minScore = 0) {
  const token = getAuthToken();
  const params = new URLSearchParams();
  
  if (minScore) params.append('minScore', minScore);

  const response = await fetch(`${API_BASE}/matching/volunteers/${volunteerId}/events?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch matching events' }));
    throw new Error(error.message || 'Failed to fetch matching events');
  }

  return response.json();
}

