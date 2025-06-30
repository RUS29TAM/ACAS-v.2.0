import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    await prisma.center.createMany({
        data: [
            { name: 'ЦПП', description: 'Центр поддержки предпринимательства' },
            { name: 'ЦКР', description: 'Центр кластерного развития' },
            { name: 'ЦРИД', description: 'Центр развития инвестиционной деятельности' },
            { name: 'Инноватика', description: 'Центр развития инновационной деятельности' },
            { name: 'ГЧП', description: 'Государственно-частное партнерство' },
            { name: 'ЦПЭ', description: 'Центр поддержки экспорта' },
            { name: 'РЦК', description: 'Региональный центр компетенций' },
            { name: 'СМиА', description: 'Служба маркетинга и аналитики' },
            { name: 'Входная группа', description: 'Клиенты входящего потока' },
            { name: 'Аналитик', description: 'Отчеты центров', isDepartment: true }
        ]
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
