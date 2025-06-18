import ClientForm from '@/components/ClientForm/ClientForm';
import prisma from '@/lib/prisma';

export default async function AddClientPage({params,}: {params: { id: string };}) {
    const { id } = await params;

    const centerId = parseInt(id);
    const center = await prisma.center.findUnique({
        where: { id: centerId },
    });

    if (!center) {
        return <div>Центр не найден</div>;
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Добавить клиента в {center.name}</h1>
            <ClientForm centerId={centerId} />
        </div>
    );
}
