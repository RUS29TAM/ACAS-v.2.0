import ClientTable from '@/components/ClientTable/ClientTable';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function CenterClientsPage({params,}: {params: { id: string };}) {
    const { id } = await params;

    const centerId = parseInt(id);
    const center = await prisma.center.findUnique({
        where: { id: centerId },
    });

    if (!center) {
        return <div>Центр не найден</div>;
    }

    const clients = await prisma.client.findMany({
        where: { centerId },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Клиенты центра: {center.name}</h1>
                <Link href={`/centers/${centerId}`} className="btn btn-outline-secondary">
                    Назад к центру
                </Link>
            </div>

            <ClientTable clients={clients} />

            <div className="mt-4">
                <Link href={`/centers/${centerId}/add-client`} className="btn btn-primary">
                    Добавить клиента
                </Link>
            </div>
        </div>
    );
}
