import { Card, CardBody, CardTitle, Col, Row } from 'react-bootstrap';
import ExcelExportButton from '@/components/ExcelExportButton/ExcelExportButton';
import prisma from '@/lib/prisma';
import Link from "next/link";
import CenterFilter from '@/components/CenterFilter/CenterFilter';


type PageProps = {
    searchParams: Promise<{ centerId: string }>;
};
export default async function DepartmentPage({
                                                 searchParams,
                                             }:PageProps) {
    // Получаем выбранный центр (если есть)
    const centerId = (await searchParams)?.centerId ? parseInt((await searchParams).centerId) : undefined;
    console.log(centerId)
    // Запросы данных
    const [centers, stats, uniqueClients] = await Promise.all([
        prisma.center.findMany(),

        // Общая статистика
        prisma.client.groupBy({
            by: ['clientType'],
            _count: {
                _all: true,
            },
            where: centerId ? { centerId } : {},
        }),

        // Уникальные клиенты (по ИНН)
        prisma.client.groupBy({
            by: ['inn'],
            _count: {
                _all: true,
            },
            where: centerId ? { centerId } : {},
        }),
    ]);

    const totalClients = stats.reduce((sum, item) => sum + item._count._all, 0);
    const totalUniqueClients = uniqueClients.length;

    const clientTypes = ['ИП', 'СЗ', 'ЮЛ', 'ФЛ'];
    const statistics = clientTypes.map(type => ({
        type,
        total: stats.find(item => item.clientType === type)?._count._all || 0,
    }));

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link href="/" className="btn btn-outline-secondary me-2">
                    На главную
                </Link>
                <h1>Административная панель аналитика</h1>
                <ExcelExportButton allCenters={!centerId} centerId={centerId} />
            </div>

            <div className="mb-4">
                <CenterFilter centers={centers} selectedCenterId={centerId} />
            </div>

            {/* Общая статистика */}
            <Row className="mb-4">
                <Col md={6}>
                    <Card>
                        <CardBody className="text-center">
                            <CardTitle>Всего клиентов</CardTitle>
                            <h2>{totalClients}</h2>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <CardBody className="text-center">
                            <CardTitle>Из них уникальных клиентов <small className="text-muted">
                                (по ИНН)
                            </small></CardTitle>
                            <h2>{totalUniqueClients}</h2>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {/* Статистика по типам клиентов */}
            <h3 className="mb-3">Статистика по типам клиентов</h3>
            <Row>
                {statistics.map(({ type, total }) => (
                    <Col md={3} key={type} className="mb-3">
                        <Card>
                            <CardBody className="text-center">
                                <CardTitle>{type}</CardTitle>
                                <h4>{total}</h4>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>

            <div className="mt-4">
                <Link href="/department/clients" className="btn btn-outline-primary">
                    Просмотреть всех клиентов
                </Link>
            </div>
        </div>
    );
}
