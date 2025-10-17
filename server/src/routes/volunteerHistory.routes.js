import { Router } from 'express';
import * as VolunteerHistory from '../controllers/volunteerHistory.controller.js';
import { requireApiKey } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { 
  createVolunteerEventSchema, 
  updateVolunteerEventSchema, 
  listVolunteerHistoryQuerySchema 
} from '../validations/volunteerHistory.schemas.js';

const r = Router();

// Specialized routes MUST come before parameterized routes
r.get('/volunteer/:volunteerId', VolunteerHistory.getByVolunteerId);
r.get('/status/:status', VolunteerHistory.getByStatus);
r.get('/stats/overview', VolunteerHistory.getStatistics);

// Main CRUD routes
r.get('/', validate(listVolunteerHistoryQuerySchema, 'query'), VolunteerHistory.list);
r.get('/:id', VolunteerHistory.getById);
r.post('/', requireApiKey, validate(createVolunteerEventSchema), VolunteerHistory.create);
r.patch('/:id', requireApiKey, validate(updateVolunteerEventSchema), VolunteerHistory.update);
r.delete('/:id', requireApiKey, VolunteerHistory.remove);

export default r;