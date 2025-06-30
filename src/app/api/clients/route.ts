import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


type RouteParams<T extends Record<string, string>> = {
    params: Promise<T>;
};

export async function GET(request: Request, { params }: RouteParams<{ id: string }>) {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get('page')) || 1;
    const perPage = 10;
    const search = searchParams.get('search');
    const centerId = searchParams.get('centerId');

    const where = {
        ...(search && {
            OR: [
                { inn: { contains: search } },
                { lastName: { contains: search } },
            ],
        }),
        ...(centerId && { centerId: Number(centerId) }),
    };

    const [clients, total] = await Promise.all([
        prisma.client.findMany({
            where,
            skip: (page - 1) * perPage,
            take: perPage,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.client.count({ where }),
    ]);

    return NextResponse.json({ clients, total });
}

export async function POST(request: Request, { params }: RouteParams<{ id: string }>) {
    try {
        const data = await request.json();

        // Валидация обязательных полей (без проверки уникальности ИНН)
        if (!data.inn || !data.lastName || !data.firstName || !data.phone) {
            return NextResponse.json(
                { error: 'Заполните все обязательные поля: ИНН, Фамилия, Имя, Телефон' },
                { status: 400 }
            );
        }

        // Создаем нового клиента (разрешаем дубликаты ИНН)
        const client = await prisma.client.create({
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
                centerId: Number(data.centerId),
            },
        });

        return NextResponse.json(client, { status: 201 });
    } catch (error) {
        console.error('Error creating client:', error);
        return NextResponse.json(
            { error: 'Ошибка при создании клиента' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request, { params }: RouteParams<{ id: string }>) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'ID клиента не указан' },
                { status: 400 }
            );
        }

        const data = await request.json();

        const client = await prisma.client.update({
            where: { id: parseInt(id) },
            data,
        });

        return NextResponse.json(client);
    } catch (error) {
        return NextResponse.json(
            { error: 'Ошибка при обновлении клиента' },
            { status: 500 }
        );
    }
}
