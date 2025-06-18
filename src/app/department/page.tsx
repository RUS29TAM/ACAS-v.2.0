import ClientTable from '@/components/ClientTable/ClientTable';
import SearchBar from '@/components/SearchBar/SearchBar';
import ExcelExportButton from '@/components/ExcelExportButton/ExcelExportButton';
import prisma from '@/lib/prisma';

export default async function DepartmentPage() {
    const recentClients = await prisma.client.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
            Center: {
                select: {
                    name: true,
                },
            },
        },
    });

    const centers = await prisma.center.findMany();

    // Преобразуем данные клиентов для таблицы
    const clientsForTable = recentClients.map(c => ({
        ...c,
        centerName: c.Center.name,
    }));

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Отдел</h1>
                {/* Убрали centerId, так как allCenters=true */}
                <ExcelExportButton allCenters={true} centerId={0} />
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <h3 className="card-title mb-3">Расширенный поиск</h3>
                    <SearchBar centers={centers} />
                </div>
            </div>

            <h3 className="mb-3">Последние добавленные клиенты</h3>
            {/* Убрали showCenter и передаем преобразованные данные */}
            <ClientTable clients={clientsForTable} />

            <div className="mt-4">
                <a href="/department/clients" className="btn btn-outline-primary">
                    Просмотреть всех клиентов
                </a>
            </div>
        </div>
    );
}
