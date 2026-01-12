
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Checking Schools...');
    const schools = await prisma.school.findMany();
    console.log('Schools:', schools);

    console.log('Checking Parents...');
    const parents = await prisma.parent.findMany();
    console.log('Parents:', parents);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
