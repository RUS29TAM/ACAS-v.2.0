'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CLIENT_TYPES, COMMUNICATION_TYPES, PROJECTS } from '@/lib/constants';

interface ClientFormProps {
    centerId: number;
    client?: {
        id: number;
        inn: string;
        organizationName: string;
        lastName: string;
        firstName: string;
        middleName: string;
        phone: string;
        email: string;
        clientType: string;
        smsp: boolean;
        communicationType: string;
        project: string;
        notes: string;
    };}

export default function ClientForm({ centerId }: ClientFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        inn: '',
        organizationName: '',
        lastName: '',
        firstName: '',
        middleName: '',
        phone: '',
        email: '',
        clientType: CLIENT_TYPES[0],
        smsp: false,
        communicationType: COMMUNICATION_TYPES[0],
        project: PROJECTS[0],
        notes: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // Валидация обязательных полей
            if (!formData.inn || !formData.lastName || !formData.firstName || !formData.phone) {
                throw new Error('Заполните обязательные поля');
            }

            const response = await fetch('/api/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    centerId, // Добавляем centerId к данным формы
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ошибка при сохранении клиента');
            }

            router.push(`/centers/${centerId}`);
        } catch (err: any) {
            setError(err.message || 'Произошла ошибка');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <h2 className="card-title mb-4">Добавить нового клиента</h2>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="inn" className="form-label">ИНН</label>
                            <input
                                type="text"
                                className="form-control"
                                id="inn"
                                name="inn"
                                value={formData.inn}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="organizationName" className="form-label">Название организации</label>
                            <input
                                type="text"
                                className="form-control"
                                id="organizationName"
                                name="organizationName"
                                value={formData.organizationName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label htmlFor="lastName" className="form-label">Фамилия</label>
                            <input
                                type="text"
                                className="form-control"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="firstName" className="form-label">Имя</label>
                            <input
                                type="text"
                                className="form-control"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="middleName" className="form-label">Отчество</label>
                            <input
                                type="text"
                                className="form-control"
                                id="middleName"
                                name="middleName"
                                value={formData.middleName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="phone" className="form-label">Телефон</label>
                            <input
                                type="tel"
                                className="form-control"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="email" className="form-label">Электронная почта</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label htmlFor="clientType" className="form-label">Тип клиента</label>
                            <select
                                className="form-select"
                                id="clientType"
                                name="clientType"
                                value={formData.clientType}
                                onChange={handleChange}
                            >
                                {CLIENT_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="communicationType" className="form-label">Вид коммуникации</label>
                            <select
                                className="form-select"
                                id="communicationType"
                                name="communicationType"
                                value={formData.communicationType}
                                onChange={handleChange}
                            >
                                {COMMUNICATION_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="project" className="form-label">Проект</label>
                            <select
                                className="form-select"
                                id="project"
                                name="project"
                                value={formData.project}
                                onChange={handleChange}
                            >
                                {PROJECTS.map(project => (
                                    <option key={project} value={project}>{project}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="smsp"
                            name="smsp"
                            checked={formData.smsp}
                            onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="smsp">Субъект МСП</label>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="notes" className="form-label">Примечания</label>
                        <textarea
                            className="form-control"
                            id="notes"
                            name="notes"
                            rows={3}
                            value={formData.notes}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-flex justify-content-end">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
