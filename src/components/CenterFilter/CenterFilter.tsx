'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function CenterFilter({
                                         centers,
                                         selectedCenterId,
                                     }: {
    centers: { id: number; name: string }[];
    selectedCenterId?: number;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const centerId = e.target.value;
        const params = new URLSearchParams(searchParams.toString());

        if (centerId) {
            params.set('centerId', centerId);
        } else {
            params.delete('centerId');
        }

        router.push(`?${params.toString()}`);
    };

    return (
        <div className="card">
            <div className="card-body">
                <select
                    className="form-select"
                    value={selectedCenterId || ''}
                    onChange={handleChange}
                >
                    <option value="">Все центры</option>
                    {centers.map(center => (
                        <option key={center.id} value={center.id}>
                            {center.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
