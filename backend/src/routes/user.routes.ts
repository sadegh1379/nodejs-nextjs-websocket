import express from 'express';
import { getUsers, createUser, getUsersStream } from '../controllers/user.controller';

const router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);
router.get("/users-stream", getUsersStream);

export default router;
