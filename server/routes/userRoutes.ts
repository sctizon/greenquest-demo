import express from 'express';
import { loginUser, registerUser, getUserProfile, getEventsByUser } from '../controllers/userController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', getUserProfile);
router.get('/user/events', getEventsByUser)

export default router;
