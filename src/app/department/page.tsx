import { Card, CardBody, CardTitle, Col, Row } from 'react-bootstrap';
import ExcelExportButton from '@/components/ExcelExportButton/ExcelExportButton';
import prisma from '@/lib/prisma';
import Link from "next/link";
import CenterFilter from '@/components/CenterFilter/CenterFilter';
import { PROJECTS } from '@/lib/constants';
import styles from '@/app/styles/DepartmentPage.module.css';
import {GiReturnArrow} from "react-icons/gi";
import {FaRegEye} from "react-icons/fa";
type PageProps = {
    searchParams: Promise<{ centerId: string }>;
};

export default async function DepartmentPage({searchParams}: PageProps) {
    const centerId = (await searchParams)?.centerId ? parseInt((await searchParams).centerId) : undefined;

    // Запросы данных
    const [centers, stats, uniqueClients, smspStats, projectStats] = await Promise.all([
        prisma.center.findMany(),
        prisma.client.groupBy({
            by: ['clientType'],
            _count: { _all: true },
            where: centerId ? { centerId } : {},
        }),
        prisma.client.groupBy({
            by: ['inn'],
            where: centerId ? { centerId } : {},
        }),
        prisma.client.groupBy({
            by: ['smsp'],
            _count: { _all: true },
            where: centerId ? { centerId } : {},
        }),
        prisma.client.groupBy({
            by: ['project'],
            _count: { _all: true },
            where: centerId ? { centerId } : {},
        }),
    ]);

    // Расчет статистики
    const totalClients = stats.reduce((sum, item) => sum + item._count._all, 0);
    const totalUniqueClients = uniqueClients.length;
    const smspCount = smspStats.find(item => item.smsp)?._count._all || 0;
    const nonSmspCount = smspStats.find(item => !item.smsp)?._count._all || 0;

    const clientTypes = ['ИП', 'СЗ', 'ЮЛ', 'ФЛ', 'Другое'];
    const statistics = clientTypes.map(type => ({
        type,
        total: stats.find(item => item.clientType === type)?._count._all || 0,
    }));

    const projectsStatistics = PROJECTS.map(project => ({
        project,
        count: projectStats.find(item => item.project === project)?._count._all || 0,
    }));

    const filteredCenters = centers.filter(center => center.id !== 10);

    return (
        <div className={styles.dashboardContainer}>
            {/* Шапка дашборда */}
            <div className={styles.dashboardHeader}>
                <div>
                    <Link href="/" className="btn btn-outline-light me-2">
                        <i className=""><GiReturnArrow /></i> На главную
                    </Link>
                    <h1 className={styles.dashboardTitle}>Аналитическая панель</h1>
                </div>
                <ExcelExportButton allCenters={!centerId} centerId={centerId} />
            </div>

            {/* Фильтры */}
            <div className={styles.filterSection}>
                <CenterFilter centers={filteredCenters} selectedCenterId={centerId} />
            </div>

            {/* Основные метрики */}
            <div className={styles.metricsGrid}>
                <Card className={styles.metricCard}>
                    <CardBody>
                        <CardTitle className={styles.metricTitle}>Всего клиентов</CardTitle>
                        <div className={styles.metricValue}>{totalClients}</div>
                        <div className={styles.metricSubtext}>в системе</div>
                    </CardBody>
                </Card>

                <Card className={styles.metricCard}>
                    <CardBody>
                        <CardTitle className={styles.metricTitle}>Уникальных клиентов</CardTitle>
                        <div className={styles.metricValue}>{totalUniqueClients}</div>
                        <div className={styles.metricSubtext}>по ИНН</div>
                    </CardBody>
                </Card>

                <Card className={styles.metricCard}>
                    <CardBody>
                        <CardTitle className={styles.metricTitle}>Субъекты МСП</CardTitle>
                        <div className={styles.metricValue}>{smspCount}</div>
                        <div className={styles.metricSubtext}>{Math.round((smspCount / totalClients) * 100)}% от общего числа</div>
                    </CardBody>
                </Card>
            </div>

            {/* Разделы статистики */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Распределение по типам клиентов</h2>
                <div className={styles.statsGrid}>
                    {statistics.map(({ type, total }) => (
                        <Card key={type} className={styles.statCard}>
                            <CardBody>
                                <div className={styles.statType}>{type}</div>
                                <div className={styles.statValue}>{total}</div>
                                {totalClients > 0 && (
                                    <div className={styles.statProgress}>
                                        <div
                                            className={styles.statProgressBar}
                                            style={{ width: `${(total / totalClients) * 100}%` }}
                                        ></div>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Федеральные проекты</h2>
                <Row>
                    {projectsStatistics.map(({ project, count }) => (
                        <Col md={4} key={project}>
                            <Card className={styles.projectCard}>
                                <CardBody>
                                    <CardTitle className={styles.projectTitle}>{project}</CardTitle>
                                    <div className={styles.projectValue}>{count}</div>
                                    <div className={styles.projectSubtext}>участников</div>
                                </CardBody>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Субъекты МСП</h2>
                <Row>
                    <Col md={6}>
                        <Card className={styles.smspCard}>
                            <CardBody>
                                <CardTitle>Являются Субъектами МСП</CardTitle>
                                <div className={styles.smspValue}>{smspCount}</div>
                                <div className={styles.smspPercentage}>
                                    {totalClients > 0 ? Math.round((smspCount / totalClients) * 100) : 0}%
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className={styles.smspCard}>
                            <CardBody>
                                <CardTitle>Не являются Субъектами МСП</CardTitle>
                                <div className={styles.smspValue}>{nonSmspCount}</div>
                                <div className={styles.smspPercentage}>
                                    {totalClients > 0 ? Math.round((nonSmspCount / totalClients) * 100) : 0}%
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>

            <div className={styles.actionsSection}>
                <Link href="/department/clients" className={`btn btn-primary ${styles.viewAllButton}`}>
                    <i className="bi bi-people-fill me-2"><FaRegEye /></i> Просмотреть всех клиентов
                </Link>
            </div>
        </div>
    );
}
