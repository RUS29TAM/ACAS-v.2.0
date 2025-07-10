import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const clients = await prisma.client.findMany({
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

        return NextResponse.json({
            clients: clients.map(client => ({
                ...client,
                centerName: client.Center?.name
            }))
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Ошибка при получении данных клиентов' },
            { status: 500 }
        );
    }
}
