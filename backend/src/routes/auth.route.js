import express from 'express'; 
import { signup, login, logout,onboard } from '../controller/auth.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';
const router = express.Router();
 
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/onboarding',protectedRoute,onboard);

export default router;