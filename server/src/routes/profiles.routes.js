import { Router } from 'express';
import * as Profiles from '../controllers/profiles.controller.js';
import { requireApiKey } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { createProfileSchema, updateProfileSchema, listQuerySchema } from '../validations/profiles.schemas.js';

const r = Router();
r.get('/', validate(listQuerySchema, 'query'), Profiles.list);
r.get('/:id', Profiles.getById);
r.post('/', requireApiKey, validate(createProfileSchema), Profiles.create);
r.patch('/:id', requireApiKey, validate(updateProfileSchema), Profiles.update);
r.delete('/:id', requireApiKey, Profiles.remove);
export default r;
