import * as NotificationsService from '../services/notifications.service.js';

/**
 * Get all notifications for a user
 * GET /api/notifications/users/:userId
 */
export const getUserNotifications = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const options = {
      type: req.query.type,
      read: req.query.read === 'true' ? true : req.query.read === 'false' ? false : undefined,
      includeDismissed: req.query.includeDismissed === 'true',
      limit: req.query.limit ? parseInt(req.query.limit) : 50,
      offset: req.query.offset ? parseInt(req.query.offset) : 0
    };

    const result = await NotificationsService.getUserNotifications(userId, options);
    res.json(result);
  } catch (e) {
    next(e);
  }
};

/**
 * Get a specific notification
 * GET /api/notifications/:id
 */
export const getById = async (req, res, next) => {
  try {
    const notification = await NotificationsService.getById(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.json(notification);
  } catch (e) {
    next(e);
  }
};

/**
 * Create a new notification
 * POST /api/notifications
 */
export const create = async (req, res, next) => {
  try {
    const notification = await NotificationsService.createNotification(req.body);
    res.status(201).json(notification);
  } catch (e) {
    next(e);
  }
};

/**
 * Mark a notification as read
 * PATCH /api/notifications/:id/read
 */
export const markAsRead = async (req, res, next) => {
  try {
    const userId = req.body.userId || req.header('x-user-id');
    const notification = await NotificationsService.markAsRead(req.params.id, userId);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found or access denied' });
    }
    
    res.json(notification);
  } catch (e) {
    next(e);
  }
};

/**
 * Mark all notifications as read for a user
 * POST /api/notifications/users/:userId/read-all
 */
export const markAllAsRead = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const count = await NotificationsService.markAllAsRead(userId);
    res.json({ message: `${count} notifications marked as read`, count });
  } catch (e) {
    next(e);
  }
};

/**
 * Dismiss a notification
 * PATCH /api/notifications/:id/dismiss
 */
export const dismiss = async (req, res, next) => {
  try {
    const userId = req.body.userId || req.header('x-user-id');
    const ok = await NotificationsService.dismiss(req.params.id, userId);
    
    if (!ok) {
      return res.status(404).json({ error: 'Notification not found or access denied' });
    }
    
    res.json({ message: 'Notification dismissed' });
  } catch (e) {
    next(e);
  }
};

/**
 * Delete a notification
 * DELETE /api/notifications/:id
 */
export const remove = async (req, res, next) => {
  try {
    const userId = req.header('x-user-id');
    const ok = await NotificationsService.remove(req.params.id, userId);
    
    if (!ok) {
      return res.status(404).json({ error: 'Notification not found or access denied' });
    }
    
    res.status(204).send();
  } catch (e) {
    next(e);
  }
};

/**
 * Specialized notification creation routes
 */

export const notifyAssignment = async (req, res, next) => {
  try {
    const { userId, event } = req.body;
    const notification = await NotificationsService.notifyAssignment(userId, event);
    res.status(201).json(notification);
  } catch (e) {
    next(e);
  }
};

export const notifyUpdate = async (req, res, next) => {
  try {
    const { userId, event, updateMessage } = req.body;
    const notification = await NotificationsService.notifyUpdate(userId, event, updateMessage);
    res.status(201).json(notification);
  } catch (e) {
    next(e);
  }
};

export const notifyReminder = async (req, res, next) => {
  try {
    const { userId, event } = req.body;
    const notification = await NotificationsService.notifyReminder(userId, event);
    res.status(201).json(notification);
  } catch (e) {
    next(e);
  }
};

export const notifyCancellation = async (req, res, next) => {
  try {
    const { userId, event } = req.body;
    const notification = await NotificationsService.notifyCancellation(userId, event);
    res.status(201).json(notification);
  } catch (e) {
    next(e);
  }
};

