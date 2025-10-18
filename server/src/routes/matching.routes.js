import { Router } from 'express';
import * as Matching from '../controllers/matching.controller.js';
import { validate } from '../middlewares/validate.js';
import { matchingQuerySchema } from '../validations/matching.schemas.js';

const r = Router();

// Get matching volunteers for an event
r.get('/events/:eventId/volunteers', 
  validate(matchingQuerySchema, 'query'), 
  Matching.getMatchingVolunteers
);

// Get match score for a specific volunteer-event pair
r.get('/events/:eventId/volunteers/:volunteerId',
  Matching.getMatchScore
);

// Get matching events for a volunteer
r.get('/volunteers/:volunteerId/events',
  validate(matchingQuerySchema, 'query'),
  Matching.getMatchingEvents
);

export default r;

