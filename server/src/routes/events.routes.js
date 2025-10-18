import { Router } from 'express';
import * as Events from '../controllers/events.controller.js';
import { requireApiKey } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { createEventSchema, updateEventSchema, listQuerySchema } from '../validations/events.schemas.js';

const r = Router();
r.get('/', validate(listQuerySchema, 'query'), Events.list);
r.get('/:id', Events.getById);
r.post('/', requireApiKey, validate(createEventSchema), Events.create);
r.patch('/:id', requireApiKey, validate(updateEventSchema), Events.update);
r.delete('/:id', requireApiKey, Events.remove); 
export default r;
