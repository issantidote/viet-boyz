// server/src/validations/profiles.schemas.js
import { z } from 'zod';

// helper to normalize empty values from query strings
const emptyToUndef = (v) =>
  v === '' || v === 'undefined' || v === 'null' || v === undefined || v === null
    ? undefined
    : v;

export const Availability = z.object({
  days: z.array(z.enum(['Monday','Tueday','Wednesday','Thursday','Friday','Saturday','Sunday'])).min(1),
  windows: z.array(z.object({ start: z.string(), end: z.string() })).default([])
});

export const BaseProfile = z.object({
  name: z.string().min(1),
  location: z.object({
    address1: z.string().min(1).max(100),
    address2: z.string().max(100).optional(),
    city: z.string().min(1),
    state: z.string().optional()
  }),
  skills: z.array(z.string()).default([]),
  preferences: z.object({ notes: z.string().optional() }).default({}),
  availability: Availability
});

export const createProfileSchema = BaseProfile;
export const updateProfileSchema = BaseProfile.partial();

export const listQuerySchema = z.object({
  city: z.preprocess(emptyToUndef, z.string().optional()),
  skill: z.preprocess(emptyToUndef, z.string().optional()),
  q: z.preprocess(emptyToUndef, z.string().optional()),
  availableOn: z.preprocess(
    emptyToUndef,
    z.enum(['Mon','Tue','Wed','Thu','Fri','Sat','Sun']).optional()
  ),
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
