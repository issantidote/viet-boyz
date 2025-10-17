// server/src/validations/volunteerHistory.schemas.js
import { z } from 'zod';

// helper to normalize empty values from query strings
const emptyToUndef = (v) =>
  v === '' || v === 'undefined' || v === 'null' || v === undefined || v === null
    ? undefined
    : v;

// Base volunteer history event schema
export const BaseVolunteerEvent = z.object({
  name: z.string().min(1).max(100, 'Event name must be 100 characters or less'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  requiredSkills: z.array(z.string()).min(1, 'At least one required skill must be specified'),
  urgency: z.enum(['High', 'Medium', 'Low'], {
    errorMap: () => ({ message: 'Urgency must be High, Medium, or Low' })
  }),
  status: z.enum(['Started', 'Not Start', 'Done'], {
    errorMap: () => ({ message: 'Status must be Started, Not Start, or Done' })
  }),
  eventDate: z.string().optional(), // ISO date string for when the event occurred/will occur
  volunteerId: z.string().optional(), // Link to volunteer profile if needed
  organizerId: z.string().optional(), // Link to organizer if needed
  participationHours: z.number().min(0).optional(), // Hours contributed
  notes: z.string().optional() // Additional notes about participation
});

export const createVolunteerEventSchema = BaseVolunteerEvent;
export const updateVolunteerEventSchema = BaseVolunteerEvent.partial();

// Query schema for filtering volunteer history
export const listVolunteerHistoryQuerySchema = z.object({
  name: z.preprocess(emptyToUndef, z.string().optional()),
  location: z.preprocess(emptyToUndef, z.string().optional()),
  skill: z.preprocess(emptyToUndef, z.string().optional()),
  urgency: z.preprocess(emptyToUndef, z.enum(['High', 'Medium', 'Low']).optional()),
  status: z.preprocess(emptyToUndef, z.enum(['Started', 'Not Start', 'Done']).optional()),
  volunteerId: z.preprocess(emptyToUndef, z.string().optional()),
  q: z.preprocess(emptyToUndef, z.string().optional()), // general search query
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