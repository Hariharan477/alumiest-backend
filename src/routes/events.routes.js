import express from 'express';
import { createEvent, getEvents, getEventById } from '../controllers/events.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authenticate, authorizeRoles('ADMIN', 'ALUMNI'), createEvent);
router.get('/', authenticate, getEvents);
router.get('/:id', authenticate, getEventById);

export default router;
