import { Card, CardBody, CardTitle, Col, Row } from 'react-bootstrap';
import ExcelExportButton from '@/components/ExcelExportButton/ExcelExportButton';
import prisma from '@/lib/prisma';
import Link from "next/link";
import CenterFilter from '@/components/CenterFilter/CenterFilter';
import { PROJECTS } from '@/lib/constants';

type PageProps = {
    searchParams: Promise<{ centerId: string }>;
};

export default async function DepartmentPage({searchParams,}: PageProps) {
    const centerId = (await searchParams)?.centerId ? parseInt((await searchParams).centerId) : undefined;

    // Запросы данных
    const [centers, stats, uniqueClients, smspStats, projectStats] = await Promise.all([
        prisma.center.findMany(),

        // Общая статистика по типам клиентов
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
            where: centerId ? { centerId } : {},
        }),

        // Статистика по Субъектам МСП
        prisma.client.groupBy({
            by: ['smsp'],
            _count: {
                _all: true,
            },
            where: centerId ? { centerId } : {},
        }),

        // Статистика по проектам
        prisma.client.groupBy({
            by: ['project'],
            _count: {
                _all: true,
            },
            where: centerId ? { centerId } : {},
        }),
    ]);

    const totalClients = stats.reduce((sum, item) => sum + item._count._all, 0);
    const totalUniqueClients = uniqueClients.length;
    const smspCount = smspStats.find(item => item.smsp)?._count._all || 0;
    const nonSmspCount = smspStats.find(item => !item.smsp)?._count._all || 0;

    const clientTypes = ['ИП', 'СЗ', 'ЮЛ', 'ФЛ', 'Другое'];
    const statistics = clientTypes.map(type => ({
        type,
        total: stats.find(item => item.clientType === type)?._count._all || 0,
    }));

    // Статистика по проектам
    const projectsStatistics = PROJECTS.map(project => ({
        project,
        count: projectStats.find(item => item.project === project)?._count._all || 0,
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
            <h3 className="mb-3">Общая статистика</h3>
            <Row className="mb-4">
                <Col md={4}>
                    <Card>
                        <CardBody className="text-center">
                            <CardTitle>Всего клиентов</CardTitle>
                            <h2>{totalClients}</h2>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card>
                        <CardBody className="text-center">
                            <CardTitle>Уникальных клиентов <small className="text-muted">(по ИНН)</small></CardTitle>
                            <h2>{totalUniqueClients}</h2>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card>
                        <CardBody className="text-center">
                            <CardTitle>Субъектов МСП</CardTitle>
                            <h2>{smspCount}</h2>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {/* Статистика по типам клиентов */}
            <h3 className="mb-3">Статистика по типам клиентов</h3>
            <Row className="mb-4">
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

            {/* Статистика по проектам */}
            <h3 className="mb-3">Статистика по проектам</h3>
            <Row className="mb-4">
                {projectsStatistics.map(({ project, count }) => (
                    <Col md={4} key={project} className="mb-3">
                        <Card>
                            <CardBody className="text-center">
                                <CardTitle>{project}</CardTitle>
                                <h4>{count}</h4>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Статистика по Субъектам МСП */}
            <h3 className="mb-3">Статистика по Субъектам МСП</h3>
            <Row className="mb-4">
                <Col md={6}>
                    <Card>
                        <CardBody className="text-center">
                            <CardTitle>Являются Субъектами МСП</CardTitle>
                            <h4>{smspCount}</h4>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <CardBody className="text-center">
                            <CardTitle>Не являются Субъектами МСП</CardTitle>
                            <h4>{nonSmspCount}</h4>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <div className="mt-4">
                <Link href="/department/clients" className="btn btn-outline-primary">
                    Просмотреть всех клиентов
                </Link>
            </div>
        </div>
    );
}
