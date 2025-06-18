import Link from 'next/link';
import { Client } from '@/models/client';

interface ClientTableProps {
    clients: Client[];
    id?: number;
    inn?: string;
    // ... другие поля клиента
    centerName?: string; // Добавить опциональное поле
    Center?: { name: string }; // Добавляем опциональное поле Center
    sortable?: boolean;
}


export default function ClientTable({ clients }: ClientTableProps) {
    if (clients.length === 0) {
        return <div className="alert alert-info">Нет данных о клиентах</div>;
    }

    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover">
                <thead>
                <tr>
                    <th>ИНН</th>
                    <th>ФИО</th>
                    <th>Организация</th>
                    <th>Тип клиента</th>
                    <th>Проект</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {clients.map((client) => (
                    <tr key={client.id}>
                        <td>{client.inn}</td>
                        <td>{`${client.lastName} ${client.firstName} ${client.middleName || ''}`}</td>
                        <td>{client.organizationName}</td>
                        <td>{client.clientType}</td>
                        <td>{client.project}</td>
                        <td>
                            <Link
                                href={`/clients/${client.id}`}
                                className="btn btn-sm btn-outline-primary"
                            >
                                Подробнее
                            </Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
