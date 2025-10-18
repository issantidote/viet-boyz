import { Router } from 'express';
import * as Notifications from '../controllers/notifications.controller.js';
import { requireApiKey } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import {
  createNotificationSchema,
  notificationQuerySchema,
  notifyAssignmentSchema,
  notifyUpdateSchema,
  notifyReminderSchema,
  notifyCancellationSchema
} from '../validations/notifications.schemas.js';

const r = Router();

// Get all notifications for a specific user
r.get('/users/:userId',
  validate(notificationQuerySchema, 'query'),
  Notifications.getUserNotifications
);

// Mark all notifications as read for a user
r.post('/users/:userId/read-all',
  Notifications.markAllAsRead
);

// Get a specific notification
r.get('/:id',
  Notifications.getById
);

// Create a general notification
r.post('/',
  requireApiKey,
  validate(createNotificationSchema),
  Notifications.create
);

// Mark a notification as read
r.patch('/:id/read',
  Notifications.markAsRead
);

// Dismiss a notification
r.patch('/:id/dismiss',
  Notifications.dismiss
);

// Delete a notification
r.delete('/:id',
  requireApiKey,
  Notifications.remove
);

// Specialized notification creation routes
r.post('/assignment',
  requireApiKey,
  validate(notifyAssignmentSchema),
  Notifications.notifyAssignment
);

r.post('/update',
  requireApiKey,
  validate(notifyUpdateSchema),
  Notifications.notifyUpdate
);

r.post('/reminder',
  requireApiKey,
  validate(notifyReminderSchema),
  Notifications.notifyReminder
);

r.post('/cancellation',
  requireApiKey,
  validate(notifyCancellationSchema),
  Notifications.notifyCancellation
);

export default r;

