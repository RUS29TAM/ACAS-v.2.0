import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type RouteParams<T extends Record<string, string>> = {
    params: Promise<T>;
};
export async function GET(request: Request, { params }: RouteParams<{ id: string }>) {
    const { searchParams } = new URL(request.url);
    const organizationName = searchParams.get('organizationName');

    if (!organizationName) {
        return NextResponse.json(
            { error: 'ИНН не указан' },
            { status: 400 }
        );
    }

    try {
        const lastClient = await prisma.client.findFirst({
            where: { organizationName },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(lastClient);
    } catch (error) {
        return NextResponse.json(
            { error: 'Ошибка при поиске клиента' },
            { status: 500 }
        );
    }
}
