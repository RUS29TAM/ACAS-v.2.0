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

/*TODO
* убрять инлайн стили style={{userSelect: "none"}}
* */

export default function ClientTable({ clients }: ClientTableProps) {
    if (clients.length === 0) {
        return <div className="alert alert-info">Нет данных о клиентах</div>;
    }

    return (
        <div style={{userSelect: "none"}} className="table-responsive">
            <table className="table table-striped table-hover">
                <thead>
                <tr>
                    <th>ИНН</th>
                    <th>ФИО</th>
                    <th>Организация</th>
                    <th>Телефон</th>
                    <th>Тип клиента</th>
                    <th>Проект</th>
                    <th>Центр</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {clients.map((client) => (
                    <tr key={client.id}>
                        <td>{client.inn}</td>
                        <td>{`${client.lastName} ${client.firstName} ${client.middleName || ''}`}</td>
                        <td>{client.organizationName}</td>
                        <td>{client.phone}</td>
                        <td>{client.clientType}</td>
                        <td>{client.project}</td>
                        <td>
                            {client.centerId === 1 ? 'ЦПП' : ''}
                            {client.centerId === 2 ? 'ЦКР' : ''}
                            {client.centerId === 3 ? 'ЦРИД' : ''}
                            {client.centerId === 4 ? 'Инноватика' : ''}
                            {client.centerId === 5 ? 'ГЧП' : ''}
                            {client.centerId === 6 ? 'ЦПЭ' : ''}
                            {client.centerId === 7 ? 'РЦК' : ''}
                            {client.centerId === 8 ? 'Маркетинг' : ''}
                            {client.centerId === 9 ? 'Входная гр.' : ''}
                        </td>
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
