import express from 'express';
import { getAlumniDirectory, getAlumniProfile } from '../controllers/alumni.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticate, getAlumniDirectory);
router.get('/:id', authenticate, getAlumniProfile);

export default router;
