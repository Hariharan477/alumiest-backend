import prisma from '../utils/prisma.js';

export const createEvent = async (req, res) => {
    try {
        const { name, date, location, description } = req.body;

        const event = await prisma.event.create({
            data: {
                name,
                date: new Date(date),
                location,
                description
            }
        });

        res.status(201).json({ message: 'Event created successfully', event });
    } catch (error) {
        console.error('Event creation error:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
};

export const getEvents = async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            orderBy: { date: 'asc' }
        });
        res.json(events);
    } catch (error) {
        console.error('Fetch events error:', error);
        res.status(500).json({ error: 'Failed to retrieve events' });
    }
};

export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await prisma.event.findUnique({
            where: { id: Number(id) }
        });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        console.error('Fetch event error:', error);
        res.status(500).json({ error: 'Failed to retrieve event' });
    }
};
