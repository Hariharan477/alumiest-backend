import express from 'express';
import { createJob, getJobs, getJobById } from '../controllers/jobs.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authenticate, authorizeRoles('ALUMNI', 'ADMIN'), createJob);
router.get('/', authenticate, getJobs);
router.get('/:id', authenticate, getJobById);

export default router;
