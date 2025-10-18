import { z } from 'zod';

const emptyToUndef = (v) =>
  v === '' || v === 'undefined' || v === 'null' || v === undefined || v === null
    ? undefined
    : v;

export const matchingQuerySchema = z.object({
  minPercentage: z.preprocess((v) => {
    const val = emptyToUndef(v);
    if (val === undefined) return undefined;
    const n = Number(val);
    return Number.isNaN(n) ? undefined : n;
  }, z.number().int().min(0).max(100).optional()),
  
  matchLevel: z.preprocess(
    emptyToUndef,
    z.enum(['High', 'Medium', 'Low']).optional()
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

