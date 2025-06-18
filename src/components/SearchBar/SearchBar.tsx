'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function SearchBar({
                                      centers,
                                      initialSearch = '',
                                  }: {
    centers: { id: number; name: string }[];
    initialSearch?: string;
}) {
    const [search, setSearch] = useState(initialSearch);
    const [centerId, setCenterId] = useState('');
    const router = useRouter();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (centerId) params.set('center', centerId);
        router.push(`?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-5">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Поиск по ИНН, ФИО или организации"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="col-md-5">
                <select
                    className="form-select"
                    value={centerId}
                    onChange={(e) => setCenterId(e.target.value)}
                >
                    <option value="">Все центры</option>
                    {centers.map(center => (
                        <option key={center.id} value={center.id}>
                            {center.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="col-md-2">
                <button type="submit" className="btn btn-primary w-100">
                    Поиск
                </button>
            </div>
        </form>
    );
}
