import { z } from 'zod';

const emptyToUndef = (v) =>
  v === '' || v === 'undefined' || v === 'null' || v === undefined || v === null
    ? undefined
    : v;

export const createNotificationSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  type: z.enum(['Assignment', 'Update', 'Reminder', 'Cancellation'], {
    errorMap: () => ({ message: 'Type must be Assignment, Update, Reminder, or Cancellation' })
  }),
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  eventId: z.string().optional(),
  eventName: z.string().optional(),
  priority: z.enum(['High', 'Medium', 'Low']).optional().default('Medium'),
  timestamp: z.string().optional()
});

export const notificationQuerySchema = z.object({
  type: z.preprocess(
    emptyToUndef,
    z.enum(['Assignment', 'Update', 'Reminder', 'Cancellation']).optional()
  ),
  read: z.preprocess(emptyToUndef, z.string().optional()),
  includeDismissed: z.preprocess(emptyToUndef, z.string().optional()),
  limit: z.preprocess((v) => {
    const val = emptyToUndef(v);
    if (val === undefined) return undefined;
    const n = Number(val);
    return Number.isNaN(n) ? undefined : n;
  }, z.number().int().positive().max(200).optional()),
  offset: z.preprocess((v) => {
    const val = emptyToUndef(v);
    if (val === undefined) return undefined;
    const n = Number(val);
    return Number.isNaN(n) ? undefined : n;
  }, z.number().int().min(0).optional()),
});

export const notifyAssignmentSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  event: z.object({
    id: z.string().min(1, 'Event ID is required'),
    eventName: z.string().optional(),
    name: z.string().optional(),
    eventDate: z.string().min(1, 'Event date is required'),
    urgency: z.enum(['High', 'Medium', 'Low']).optional()
  })
});

export const notifyUpdateSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  event: z.object({
    id: z.string().min(1, 'Event ID is required'),
    eventName: z.string().optional(),
    name: z.string().optional()
  }),
  updateMessage: z.string().optional()
});

export const notifyReminderSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  event: z.object({
    id: z.string().min(1, 'Event ID is required'),
    eventName: z.string().optional(),
    name: z.string().optional(),
    eventDate: z.string().min(1, 'Event date is required')
  })
});

export const notifyCancellationSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  event: z.object({
    id: z.string().min(1, 'Event ID is required'),
    eventName: z.string().optional(),
    name: z.string().optional(),
    eventDate: z.string().min(1, 'Event date is required')
  })
});

