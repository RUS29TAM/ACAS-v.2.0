import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    await prisma.center.createMany({
        data: [
            { name: 'Центр 1', description: 'Описание центра 1' },
            { name: 'Центр 2', description: 'Описание центра 2' },
            { name: 'Центр 3', description: 'Описание центра 3' },
            { name: 'Центр 4', description: 'Описание центра 4' },
            { name: 'Центр 5', description: 'Описание центра 5' },
            { name: 'Центр 6', description: 'Описание центра 6' },
            { name: 'Центр 7', description: 'Описание центра 7' },
            { name: 'Центр 8', description: 'Описание центра 8' },
            { name: 'Центр 9', description: 'Описание центра 9' },
            { name: 'Отдел', description: 'Главный отдел', isDepartment: true }
        ]
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
