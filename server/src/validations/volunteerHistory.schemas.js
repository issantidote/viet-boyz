import { z } from 'zod';

const emptyToUndef = (v) =>
  v === '' || v === 'undefined' || v === 'null' || v === undefined || v === null
    ? undefined
    : v;

// Base volunteer history event schema
export const createVolunteerEventSchema = z.object({
  volunteerId: z.string().min(1, 'Volunteer ID is required'),
  eventId: z.string().optional(), // Optional since it can be auto-generated or derived
  name: z.string().min(1, 'Event name is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  requiredSkills: z.array(z.string()).min(1, 'At least one skill is required'),
  urgency: z.enum(['High', 'Medium', 'Low'], {
    errorMap: () => ({ message: 'Urgency must be High, Medium, or Low' })
  }),
  eventDate: z.string().refine((date) => {
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, { message: 'Invalid date format' }),
  status: z.enum(['Not Start', 'Started', 'Done']).default('Not Start'),
  participationHours: z.number().min(0).optional(),
  notes: z.string().optional()
});

export const updateVolunteerEventSchema = createVolunteerEventSchema.partial();

export const listVolunteerHistoryQuerySchema = z.object({
  volunteerId: z.preprocess(emptyToUndef, z.string().optional()),
  eventId: z.preprocess(emptyToUndef, z.string().optional()),
  name: z.preprocess(emptyToUndef, z.string().optional()),
  location: z.preprocess(emptyToUndef, z.string().optional()),
  skill: z.preprocess(emptyToUndef, z.string().optional()),
  urgency: z.preprocess(emptyToUndef, z.enum(['High', 'Medium', 'Low']).optional()),
  status: z.preprocess(emptyToUndef, z.enum(['Not Start', 'Started', 'Done']).optional()),
  q: z.preprocess(emptyToUndef, z.string().optional()),
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
