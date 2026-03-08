import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import alumniRoutes from './routes/alumni.routes.js';
import mentorshipRoutes from './routes/mentorship.routes.js';
import jobsRoutes from './routes/jobs.routes.js';
import eventsRoutes from './routes/events.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/events', eventsRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
