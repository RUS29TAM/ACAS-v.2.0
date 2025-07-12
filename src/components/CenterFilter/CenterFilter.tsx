'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Form } from 'react-bootstrap';

export default function CenterFilter({
                                         centers,
                                         selectedCenterId,
                                     }: {
    centers: { id: number; name: string }[];
    selectedCenterId?: number;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                <div className="d-flex justify-content-sm-between">
                    <Form.Check
                        type="radio"
                        id="center-all"
                        name="centerFilter"
                        label="Все центры"
                        value=""
                        checked={!selectedCenterId}
                        onChange={handleChange}
                    />

                    {centers.map(center => (
                        <Form.Check
                            key={center.id}
                            type="radio"
                            id={`center-${center.id}`}
                            name="centerFilter"
                            label={center.name}
                            value={center.id.toString()}
                            checked={selectedCenterId === center.id}
                            onChange={handleChange}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
