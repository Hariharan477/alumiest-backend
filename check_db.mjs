import prisma from './src/utils/prisma.js';

async function check() {
    const users = await prisma.user.findMany();
    console.log("Users:", users);

    // Clean up any user that doesn't have a profile as a fix
    for (const user of users) {
        if (user.role === 'ALUMNI') {
            const profile = await prisma.alumni.findUnique({ where: { userId: user.id } });
            if (!profile) {
                console.log(`Deleting half-created user ${user.email}`);
                await prisma.user.delete({ where: { id: user.id } });
            }
        }
    }
}

check().catch(console.error).finally(() => prisma.$disconnect());
