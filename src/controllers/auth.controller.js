import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

export const register = async (req, res) => {
    try {
        const { email, password, role, ...profileData } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
            },
        });

        try {
            if (role === 'ALUMNI') {
                const { jobRole, ...restProfile } = profileData;
                await prisma.alumni.create({
                    data: {
                        ...restProfile,
                        role: jobRole || restProfile.role || 'Unspecified',
                        userId: user.id
                    }
                });
            } else if (role === 'STUDENT') {
                await prisma.student.create({
                    data: {
                        ...profileData, // expects name, department, skills, career_goal
                        userId: user.id
                    }
                });
            }
        } catch (profileError) {
            await prisma.user.delete({ where: { id: user.id } }); // Rollback user creation
            console.error('Profile creation error:', profileError);
            return res.status(400).json({ error: 'Profile creation failed due to missing or invalid fields. Please check required fields: name, batch, department, company, jobRole (or role), skills, location (for Alumni) OR name, department, skills, career_goal (for Student).' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ message: 'User registered successfully', token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        res.json({ message: 'Login successful', token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};
