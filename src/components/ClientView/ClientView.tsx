import { Client } from '@/models/client';

interface ClientViewProps {
    client: Client & { Center?: { name: string } };
}

export default function ClientView({ client }: ClientViewProps) {
    return (
        <div style={{userSelect: "none"}}  className="card">
            <div className="card-body">
                <div className="row mb-3">
                    <div className="col-md-6">
                        <h5>Основная информация</h5>
                        <p><strong>ИНН:</strong> {client.inn}</p>
                        <p><strong>ФИО:</strong> {client.lastName} {client.firstName} {client.middleName || ''}</p>
                        <p><strong>Организация:</strong> {client.organizationName || 'Не указано'}</p>
                    </div>
                    <div className="col-md-6">
                        <h5>Контактные данные</h5>
                        <p><strong>Телефон:</strong> {client.phone}</p>
                        <p><strong>Email:</strong> {client.email || 'Не указан'}</p>
                        <p><strong>Центр:</strong> {client.Center?.name || 'Не указан'}</p>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <h5>Дополнительная информация</h5>
                        <p><strong>Тип клиента:</strong> {client.clientType}</p>
                        <p><strong>Проект:</strong> {client.project}</p>
                        <p><strong>Субъект МСП:</strong> {client.smsp ? 'Да' : 'Нет'}</p>
                    </div>
                    <div className="col-md-6">
                        <h5>Примечания</h5>
                        <p>{client.notes || 'Нет примечаний'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
