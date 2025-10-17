// server/src/validations/profiles.schemas.js
import { z } from 'zod';

// helper to normalize empty values from query strings
const emptyToUndef = (v) =>
  v === '' || v === 'undefined' || v === 'null' || v === undefined || v === null
    ? undefined
    : v;

export const Availability = z.object({
  days: z.array(z.enum(['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'])).min(1),
  windows: z.array(z.object({ start: z.string(), end: z.string() })).default([])
});

export const BaseProfile = z.object({
  //eventID: 1,
  eventName: z.string().min(1).max(100, 'Event name must be 100 characters or less'),
  eventDescription: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  skills: z.array(z.string()).default([]),
  urgency: z.enum(['High', 'Medium', 'Low'], {
    errorMap: () => ({ message: 'Urgency must be High, Medium, or Low' })
  }),
  eventDate: z.iso.datetime(), // ISO date string for when the event occurred/will occur
});

export const createProfileSchema = BaseProfile;
export const updateProfileSchema = BaseProfile.partial();

export const listQuerySchema = z.object({
  eventName: z.preprocess(emptyToUndef, z.string().optional()),
  eventDescription: z.preprocess(emptyToUndef, z.string().optional()),
  location: z.preprocess(emptyToUndef, z.string().optional()),
  skills: z.preprocess(emptyToUndef, z.string().optional()),
  urgency: z.preprocess(emptyToUndef, z.enum(['High', 'Medium', 'Low']).optional()),
  eventDate: z.preprocess(emptyToUndef, z.iso.datetime().optional()),

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
