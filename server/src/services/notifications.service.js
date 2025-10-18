import { v4 as uuid } from 'uuid';
import fs from 'fs';

const NOTIFICATIONS_FILE = 'notifications.data.json';
const notificationsMap = new Map();

// Load notifications from file on startup
function loadNotificationsData() {
  if (fs.existsSync(NOTIFICATIONS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(NOTIFICATIONS_FILE, 'utf8'));
      if (Array.isArray(data)) {
        data.forEach(notif => notificationsMap.set(notif.id, notif));
        console.log(`Loaded ${data.length} notifications from file`);
      }
    } catch (e) {
      console.warn('Failed to load notifications data file:', e.message);
    }
  }
}

// Save notifications to file
async function saveNotificationsData() {
  try {
    const data = Array.from(notificationsMap.values());
    await fs.promises.writeFile(NOTIFICATIONS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save notifications data:', e.message);
  }
}

loadNotificationsData();

/**
 * Create a new notification
 * @param {Object} notification - Notification details
 * @returns {Promise<Object>} - Created notification
 */
export async function createNotification(notification) {
  const now = new Date().toISOString();
  const newNotif = {
    id: uuid(),
    createdAt: now,
    read: false,
    dismissed: false,
    ...notification,
    timestamp: notification.timestamp || now
  };

  notificationsMap.set(newNotif.id, newNotif);
  await saveNotificationsData();
  
  return newNotif;
}

/**
 * Get all notifications for a user
 * @param {string} userId - User ID
 * @param {Object} options - Filter options
 * @returns {Promise<Object>} - List of notifications
 */
export async function getUserNotifications(userId, options = {}) {
  const all = Array.from(notificationsMap.values());
  
  // Filter by userId
  let userNotifs = all.filter(n => n.userId === userId);

  // Filter by type if specified
  if (options.type) {
    userNotifs = userNotifs.filter(n => n.type === options.type);
  }

  // Filter by read status if specified
  if (options.read !== undefined) {
    userNotifs = userNotifs.filter(n => n.read === options.read);
  }

  // Filter by dismissed status
  if (options.includeDismissed !== true) {
    userNotifs = userNotifs.filter(n => !n.dismissed);
  }

  // Sort by timestamp (newest first)
  userNotifs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Apply pagination
  const limit = options.limit || 50;
  const offset = options.offset || 0;
  const paginated = userNotifs.slice(offset, offset + limit);

  return {
    userId,
    total: userNotifs.length,
    unreadCount: userNotifs.filter(n => !n.read).length,
    items: paginated
  };
}

/**
 * Get a notification by ID
 * @param {string} id - Notification ID
 * @returns {Promise<Object|null>} - Notification or null
 */
export async function getById(id) {
  return notificationsMap.get(id) || null;
}

/**
 * Mark a notification as read
 * @param {string} id - Notification ID
 * @param {string} userId - User ID (for security)
 * @returns {Promise<Object|null>} - Updated notification or null
 */
export async function markAsRead(id, userId = null) {
  const notif = notificationsMap.get(id);
  if (!notif) return null;

  // Security check: only the owner can mark as read
  if (userId && notif.userId !== userId) return null;

  const updated = { ...notif, read: true, readAt: new Date().toISOString() };
  notificationsMap.set(id, updated);
  await saveNotificationsData();

  return updated;
}

/**
 * Mark all notifications as read for a user
 * @param {string} userId - User ID
 * @returns {Promise<number>} - Number of notifications marked as read
 */
export async function markAllAsRead(userId) {
  const all = Array.from(notificationsMap.values());
  const userNotifs = all.filter(n => n.userId === userId && !n.read);

  let count = 0;
  for (const notif of userNotifs) {
    const updated = { ...notif, read: true, readAt: new Date().toISOString() };
    notificationsMap.set(notif.id, updated);
    count++;
  }

  if (count > 0) {
    await saveNotificationsData();
  }

  return count;
}

/**
 * Dismiss a notification (soft delete)
 * @param {string} id - Notification ID
 * @param {string} userId - User ID (for security)
 * @returns {Promise<boolean>} - Success status
 */
export async function dismiss(id, userId = null) {
  const notif = notificationsMap.get(id);
  if (!notif) return false;

  // Security check: only the owner can dismiss
  if (userId && notif.userId !== userId) return false;

  const updated = { ...notif, dismissed: true, dismissedAt: new Date().toISOString() };
  notificationsMap.set(id, updated);
  await saveNotificationsData();

  return true;
}

/**
 * Delete a notification permanently
 * @param {string} id - Notification ID
 * @param {string} userId - User ID (for security)
 * @returns {Promise<boolean>} - Success status
 */
export async function remove(id, userId = null) {
  const notif = notificationsMap.get(id);
  if (!notif) return false;

  // Security check: only the owner can delete
  if (userId && notif.userId !== userId) return false;

  const ok = notificationsMap.delete(id);
  if (ok) {
    await saveNotificationsData();
  }
  return ok;
}

/**
 * Create notification for event assignment
 * @param {string} userId - User ID
 * @param {Object} event - Event details
 * @returns {Promise<Object>} - Created notification
 */
export async function notifyAssignment(userId, event) {
  return createNotification({
    userId,
    type: 'Assignment',
    title: 'New Event Assignment',
    message: `You have been assigned to ${event.eventName || event.name} on ${new Date(event.eventDate).toLocaleDateString()}.`,
    eventId: event.id,
    eventName: event.eventName || event.name,
    priority: event.urgency || 'Medium'
  });
}

/**
 * Create notification for event update
 * @param {string} userId - User ID
 * @param {Object} event - Event details
 * @param {string} updateMessage - What changed
 * @returns {Promise<Object>} - Created notification
 */
export async function notifyUpdate(userId, event, updateMessage) {
  return createNotification({
    userId,
    type: 'Update',
    title: 'Event Updated',
    message: updateMessage || `${event.eventName || event.name} has been updated.`,
    eventId: event.id,
    eventName: event.eventName || event.name,
    priority: 'Medium'
  });
}

/**
 * Create notification reminder for upcoming event
 * @param {string} userId - User ID
 * @param {Object} event - Event details
 * @returns {Promise<Object>} - Created notification
 */
export async function notifyReminder(userId, event) {
  const eventDate = new Date(event.eventDate);
  const timeUntil = eventDate - new Date();
  const daysUntil = Math.ceil(timeUntil / (1000 * 60 * 60 * 24));
  
  let message;
  if (daysUntil <= 0) {
    message = `${event.eventName || event.name} is today!`;
  } else if (daysUntil === 1) {
    message = `${event.eventName || event.name} is tomorrow at ${eventDate.toLocaleTimeString()}.`;
  } else {
    message = `${event.eventName || event.name} is in ${daysUntil} days on ${eventDate.toLocaleDateString()}.`;
  }

  return createNotification({
    userId,
    type: 'Reminder',
    title: 'Upcoming Event Reminder',
    message,
    eventId: event.id,
    eventName: event.eventName || event.name,
    priority: 'Low'
  });
}

/**
 * Create notification for event cancellation
 * @param {string} userId - User ID
 * @param {Object} event - Event details
 * @returns {Promise<Object>} - Created notification
 */
export async function notifyCancellation(userId, event) {
  return createNotification({
    userId,
    type: 'Cancellation',
    title: 'Event Cancelled',
    message: `${event.eventName || event.name} on ${new Date(event.eventDate).toLocaleDateString()} has been cancelled.`,
    eventId: event.id,
    eventName: event.eventName || event.name,
    priority: 'High'
  });
}

