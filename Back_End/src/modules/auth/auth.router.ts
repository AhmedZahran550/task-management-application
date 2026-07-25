import { Router } from 'express';
import { register, login } from './auth.controller.js';
import { validate } from '../../middleware/validation.js';
import { registerSchema, loginSchema } from './auth.validation.js';

const router = Router();

router.post('/register', validate(registerSchema, 'body'), register);
router.post('/login', validate(loginSchema, 'body'), login);

export default router;
