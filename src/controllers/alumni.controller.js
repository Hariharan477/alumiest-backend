import prisma from '../utils/prisma.js';

export const getAlumniDirectory = async (req, res) => {
    try {
        const { department, batch, company } = req.query;

        const filters = {};
        if (department) filters.department = { contains: department };
        if (batch) filters.batch = batch;
        if (company) filters.company = { contains: company };

        const alumni = await prisma.alumni.findMany({
            where: filters,
            include: {
                user: {
                    select: { email: true, createdAt: true }
                }
            }
        });

        res.json(alumni);
    } catch (error) {
        console.error('Error fetching alumni:', error);
        res.status(500).json({ error: 'Failed to retrieve alumni directory' });
    }
};

export const getAlumniProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const profile = await prisma.alumni.findUnique({
            where: { id: Number(id) },
            include: {
                user: { select: { email: true } },
                jobsPosted: true
            }
        });

        if (!profile) {
            return res.status(404).json({ error: 'Alumni not found' });
        }

        res.json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to retrieve profile' });
    }
};
