import ClientTable from '@/components/ClientTable/ClientTable';
import SearchBar from '@/components/SearchBar/SearchBar';
import ExcelExportButton from '@/components/ExcelExportButton/ExcelExportButton';
import  prisma  from '@/lib/prisma'; // Используем именованный импорт если export был не default
import Link from 'next/link';
import Pagination from "@/components/Pagination";
import type { Prisma } from '@prisma/client'; // Правильный импорт типов Prisma

export default async function DepartmentClientsPage({
                                                        searchParams,
                                                    }: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const page = Number(searchParams.page) || 1;
    const perPage = 10;
    const searchQuery = searchParams.search?.toString() || '';
    const centerFilter = searchParams.center?.toString();

    // Правильное использование типа
    const where: Prisma.ClientWhereInput = {
        ...(searchQuery && {
            OR: [
                { inn: { contains: searchQuery } },
                { lastName: { contains: searchQuery } },
                { organizationName: { contains: searchQuery } },
            ],
        }),
        ...(centerFilter && { centerId: Number(centerFilter) }),
    };

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
                <Link href="/department" className="btn btn-outline-secondary me-2">
                    Назад
                </Link>
                <h1>Все клиенты отдела</h1>
                <div>
                    <ExcelExportButton allCenters={true} />
                    <Link href="/department" className="btn btn-outline-secondary ms-2">
                        Назад
                    </Link>
                </div>
            </div>

            <div className="mb-4">
                <SearchBar centers={centers} initialSearch={searchQuery} />
            </div>

            <ClientTable
                clients={clients.map(client => ({
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
