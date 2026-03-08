import prisma from '../utils/prisma.js';

export const createJob = async (req, res) => {
    try {
        const { title, company, description } = req.body;

        let alumni;
        if (req.user.role === 'ALUMNI') {
            alumni = await prisma.alumni.findUnique({ where: { userId: req.user.userId } });
            if (!alumni) return res.status(404).json({ error: 'Alumni profile not found' });
        } else {
            // In a real application, an Admin might be able to post on behalf of an alumni or there would be a different flow.
            // For simplicity, requiring ALUMNI role or getting alumniId from body if admin.
            return res.status(403).json({ error: 'Only Alumni can post jobs directly in this version' });
        }

        const job = await prisma.job.create({
            data: {
                title,
                company,
                description,
                posted_byId: alumni.id
            }
        });

        res.status(201).json({ message: 'Job created successfully', job });
    } catch (error) {
        console.error('Job creation error:', error);
        res.status(500).json({ error: 'Failed to create job posting' });
    }
};

export const getJobs = async (req, res) => {
    try {
        const jobs = await prisma.job.findMany({
            include: {
                postedBy: { select: { name: true, company: true } }
            }
        });
        res.json(jobs);
    } catch (error) {
        console.error('Fetch jobs error:', error);
        res.status(500).json({ error: 'Failed to retrieve jobs' });
    }
};

export const getJobById = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await prisma.job.findUnique({
            where: { id: Number(id) },
            include: {
                postedBy: { select: { name: true, company: true, id: true } }
            }
        });

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        res.json(job);
    } catch (error) {
        console.error('Fetch job error:', error);
        res.status(500).json({ error: 'Failed to retrieve job' });
    }
};
