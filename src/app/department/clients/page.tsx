import ClientTable from '@/components/ClientTable/ClientTable';
import SearchBar from '@/components/SearchBar/SearchBar';
import ExcelExportButton from '@/components/ExcelExportButton/ExcelExportButton';
import  prisma  from '@/lib/prisma';
import Link from 'next/link';
import Pagination from "@/components/Pagination";

// Тип для searchParams (можно переиспользовать в других страницах)
type SearchParams = Promise<{
    [key: string]: string | string[] | undefined;
}>;

// Тип пропсов страницы
type PageProps = {
    searchParams: SearchParams;
};

export default async function DepartmentClientsPage({ searchParams }: PageProps) {
    const params = await searchParams;

    const page = Number(params.page) || 1;
    const perPage = 10;
    const searchQuery = params.search?.toString() || '';
    const centerFilter = params.center?.toString();

    // Условия фильтрации
    const where: any = {
        ...(searchQuery && {
            OR: [
                { inn: { contains: searchQuery } },
                { lastName: { contains: searchQuery } },
                { organizationName: { contains: searchQuery } },
            ],
        }),
        ...(centerFilter && { centerId: Number(centerFilter) }),
    };

    // Параллельные запросы
    const [clients, totalClients, centers] = await Promise.all([
        prisma.client.findMany({
            where,
            skip: (page - 1) * perPage,
            take: perPage,
            orderBy: { createdAt: 'desc' },
            include: { Center: { select: { name: true } } },
        }),
        prisma.client.count({ where }),
        prisma.center.findMany(),
    ]);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link href="/" className="btn btn-outline-secondary me-2">
                    На главную
                </Link>

                <h1>Все клиенты агентства</h1>
                <div>
                    <Link href="/department" className="btn btn-outline-secondary me-2">
                        Назад
                    </Link>
                    <ExcelExportButton allCenters={true} />

                </div>
            </div>

            <div className="mb-4">
                <SearchBar centers={centers} initialSearch={searchQuery} />
            </div>

            <ClientTable
                clients={clients.map((client) => ({
                    ...client,
                    centerName: client.Center.name,
                }))}
            />

            <Pagination
                currentPage={page}
                totalItems={totalClients}
                itemsPerPage={perPage}
                className="mt-4"
            />
        </div>
    );
}
