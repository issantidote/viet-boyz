import { z } from 'zod';

const emptyToUndef = (v) =>
  v === '' || v === 'undefined' || v === 'null' || v === undefined || v === null
    ? undefined
    : v;

export const createEventSchema = z.object({
  eventName: z.string().min(1, 'Event name is required').max(100, 'Event name must be 100 characters or less'),
  eventDescription: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  requiredSkills: z.array(z.string()).min(1, 'At least one skill is required'),
  urgency: z.enum(['High', 'Medium', 'Low'], {
    errorMap: () => ({ message: 'Urgency must be High, Medium, or Low' })
  }),
  eventDate: z.string().refine((date) => {
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, { message: 'Invalid date format' })
});

export const updateEventSchema = createEventSchema.partial();

export const listQuerySchema = z.object({
  eventName: z.preprocess(emptyToUndef, z.string().optional()),
  location: z.preprocess(emptyToUndef, z.string().optional()),
  skill: z.preprocess(emptyToUndef, z.string().optional()),
  urgency: z.preprocess(emptyToUndef, z.enum(['High', 'Medium', 'Low']).optional()),
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