import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const clientId = Number(params.id);
        const data = await request.json();

        // Валидация
        if (!data.inn || !data.lastName || !data.firstName || !data.phone) {
            return NextResponse.json(
                { error: 'Заполните обязательные поля' },
                { status: 400 }
            );
        }

        const updatedClient = await prisma.client.update({
            where: { id: clientId },
            data: {
                inn: data.inn,
                organizationName: data.organizationName || null,
                lastName: data.lastName,
                firstName: data.firstName,
                middleName: data.middleName || null,
                phone: data.phone,
                email: data.email || null,
                clientType: data.clientType,
                smsp: Boolean(data.smsp),
                communicationType: data.communicationType,
                project: data.project,
                notes: data.notes || null,
            },
        });

        return NextResponse.json(updatedClient);
    } catch (error) {
        console.error('Error updating client:', error);
        return NextResponse.json(
            { error: 'Ошибка при обновлении клиента' },
            { status: 500 }
        );
    }
}
