import prisma from '../utils/prisma.js';

export const requestMentorship = async (req, res) => {
    try {
        const { alumniId } = req.body;

        // Find the student ID for the currently logged in user
        const student = await prisma.student.findUnique({
            where: { userId: req.user.userId }
        });

        if (!student) {
            return res.status(404).json({ error: 'Student profile not found' });
        }

        const mentorshipRequest = await prisma.mentorRequest.create({
            data: {
                studentId: student.id,
                alumniId: Number(alumniId)
            }
        });

        res.status(201).json({ message: 'Mentorship requested successfully', mentorshipRequest });
    } catch (error) {
        console.error('Mentorship request error:', error);
        res.status(500).json({ error: 'Failed to request mentorship' });
    }
};

export const updateMentorshipStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'ACCEPTED' or 'REJECTED'

        if (!['ACCEPTED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const request = await prisma.mentorRequest.findUnique({ where: { id: Number(id) } });
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        const updatedRequest = await prisma.mentorRequest.update({
            where: { id: Number(id) },
            data: { status }
        });

        res.json({ message: `Mentorship ${status.toLowerCase()} successfully`, updatedRequest });
    } catch (error) {
        console.error('Mentorship update error:', error);
        res.status(500).json({ error: 'Failed to update mentorship status' });
    }
};

export const getMyRequests = async (req, res) => {
    try {
        let requests = [];
        if (req.user.role === 'STUDENT') {
            const student = await prisma.student.findUnique({ where: { userId: req.user.userId } });
            if (student) {
                requests = await prisma.mentorRequest.findMany({
                    where: { studentId: student.id },
                    include: { alumni: true }
                });
            }
        } else if (req.user.role === 'ALUMNI') {
            const alumni = await prisma.alumni.findUnique({ where: { userId: req.user.userId } });
            if (alumni) {
                requests = await prisma.mentorRequest.findMany({
                    where: { alumniId: alumni.id },
                    include: { student: true }
                });
            }
        }

        res.json(requests);
    } catch (error) {
        console.error('Fetch requests error:', error);
        res.status(500).json({ error: 'Failed to fetch mentorship requests' });
    }
};
