// Backend Notifications API calls
const API_BASE = 'http://localhost:4000/api';

/**
 * Get auth token from localStorage
 */
function getAuthToken() {
  return localStorage.getItem('token');
}

/**
 * Get notifications for a user
 * @param {Object} params - Query parameters
 * @param {string} params.userId - User ID
 * @param {string} [params.type] - Filter by notification type (Assignment, Update, Reminder, Cancellation)
 * @param {boolean} [params.unreadOnly] - Only show unread notifications
 * @returns {Promise<Array>}
 */
export async function listNotifications({ userId, type, unreadOnly }) {
  const token = getAuthToken();
  const params = new URLSearchParams();
  
  if (userId) params.append('userId', userId);
  if (type) params.append('type', type);
  if (unreadOnly !== undefined) params.append('unreadOnly', unreadOnly);

  const response = await fetch(`${API_BASE}/notifications?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch notifications' }));
    throw new Error(error.message || 'Failed to fetch notifications');
  }

  return response.json();
}

/**
 * Create a new notification (admin only)
 * @param {Object} data - Notification data
 * @returns {Promise<Object>}
 */
export async function createNotification(data) {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE}/notifications`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create notification' }));
    throw new Error(error.message || 'Failed to create notification');
  }

  return response.json();
}

/**
 * Mark notification as read
 * @param {string} id - Notification ID
 * @returns {Promise<Object>}
 */
export async function markAsRead(id) {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE}/notifications/${id}/read`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to mark as read' }));
    throw new Error(error.message || 'Failed to mark as read');
  }

  return response.json();
}

/**
 * Dismiss/delete notification
 * @param {string} id - Notification ID
 * @returns {Promise<void>}
 */
export async function dismissNotification(id) {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE}/notifications/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to dismiss notification' }));
    throw new Error(error.message || 'Failed to dismiss notification');
  }
}

