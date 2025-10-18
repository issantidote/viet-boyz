import { Router } from 'express';
import * as Auth from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../validations/auth.schemas.js';

const r = Router();

r.post('/register', validate(registerSchema), Auth.register);
r.post('/login', validate(loginSchema), Auth.login);

export default r;