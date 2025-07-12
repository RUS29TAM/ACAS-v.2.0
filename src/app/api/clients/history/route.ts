import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const inn = searchParams.get('inn');

    if (!inn) {
        return NextResponse.json(
            { error: 'ИНН не указан' },
            { status: 400 }
        );
    }

    try {
        const history = await prisma.client.findMany({
            where: { inn },
            include: {
                Center: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(history);
    } catch (error) {
        return NextResponse.json(
            { error: 'Ошибка при получении истории клиента' },
            { status: 500 }
        );
    }
}
