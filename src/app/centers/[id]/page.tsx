import ClientTable from '@/components/ClientTable/ClientTable';
import ExcelExportButton from '@/components/ExcelExportButton/ExcelExportButton';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface CenterPageProps {
    params: {
        id: string;
    };
}

export default async function CenterPage({ params }: CenterPageProps) {
    // Явно ожидаем параметры (хотя в данном случае это строка)
    const { id } = await params;
    const centerId = parseInt(id);

    const [center, recentClients] = await Promise.all([
        prisma.center.findUnique({
            where: { id: centerId },
        }),
        prisma.client.findMany({
            where: { centerId },
            orderBy: { createdAt: 'desc' },
            take: 5,
        })
    ]);

    if (!center) {
        return notFound();
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link href="/" className="btn btn-outline-secondary me-2">
                    На главную
                </Link>
                <h1>{center.name}</h1>
                <div>
                    <Link href={`/centers/${centerId}/add-client`} className="btn btn-primary me-2">
                        Добавить клиента
                    </Link>
                    <ExcelExportButton centerId={centerId} />
                </div>
            </div>

            <h3 className="mb-3">Последние добавленные клиенты</h3>
            <ClientTable clients={recentClients} />

            <div className="mt-4">
                <Link href={`/centers/${centerId}/clients`} className="btn btn-outline-primary">
                    Просмотреть всех клиентов
                </Link>
            </div>
        </div>
    );
}
