'use client';

import { Client } from '@/models/client';
import { useState } from 'react';
import { Button, Collapse, ListGroup } from 'react-bootstrap';

interface ClientViewProps {
    client: Client & { Center?: { name: string } };
}

export default function ClientView({ client }: ClientViewProps) {
    const [showHistory, setShowHistory] = useState(false);
    const [clientHistory, setClientHistory] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchClientHistory = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/clients/history?inn=${client.inn}`);
            if (response.ok) {
                const history = await response.json();
                setClientHistory(history);
            }
        } catch (error) {
            console.error('Error fetching client history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleHistory = () => {
        if (!showHistory && clientHistory.length === 0) {
            fetchClientHistory();
        }
        setShowHistory(!showHistory);
    };

    return (
        <div style={{ userSelect: "none" }} className="card">
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

                <div className="row mb-3">
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

                <div className="mt-4">
                    <Button
                        variant="outline-primary"
                        onClick={toggleHistory}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Загрузка...' :
                            showHistory ? 'Скрыть историю' : 'Показать историю клиента'}
                    </Button>

                    <Collapse in={showHistory}>
                        <div className="mt-3">
                            <h5>История клиента</h5>
                            {clientHistory.length > 0 ? (
                                <ListGroup>
                                    {clientHistory.map((entry, index) => (
                                        <ListGroup.Item key={index}>
                                            <div>
                                                <strong>Центр:</strong> {entry.Center?.name || 'Не указан'}
                                            </div>
                                            <div>
                                                <strong>Проект:</strong> {entry.project}
                                            </div>
                                            <div>
                                                <strong>Примечания:</strong> {entry.notes || 'Нет примечаний'}
                                            </div>
                                            <div className="text-muted small">
                                                Дата: {new Date(entry.createdAt).toLocaleDateString()}
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <p>История не найдена</p>
                            )}
                        </div>
                    </Collapse>
                </div>
            </div>
        </div>
    );
}
