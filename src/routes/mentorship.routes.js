import express from 'express';
import { requestMentorship, updateMentorshipStatus, getMyRequests } from '../controllers/mentorship.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/request', authenticate, authorizeRoles('STUDENT'), requestMentorship);
router.put('/:id/status', authenticate, authorizeRoles('ALUMNI', 'ADMIN'), updateMentorshipStatus);
router.get('/my-requests', authenticate, getMyRequests);

export default router;
