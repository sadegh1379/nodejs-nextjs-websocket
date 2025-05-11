import express, { RequestHandler } from 'express';
import { login, register } from '../controllers/auth.controller';

const router = express.Router();

router.post('/login', login as RequestHandler);
router.post('/register', register as RequestHandler);

export default router;
