'use client';

import { useState } from 'react';
import { generateExcelForCenter } from '@/utils/excelGenerator';
import { saveAs } from 'file-saver';

interface ExcelExportButtonProps {
    allCenters?: boolean;
    centerId?: number; // Сделать опциональным
}

export default function ExcelExportButton({ centerId, allCenters = false }: ExcelExportButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleExport = async () => {
        setIsLoading(true);

        try {
            const response = await fetch(`/api/clients?centerId=${allCenters ? '' : centerId}`);
            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Ошибка при получении данных');

            const blob = await generateExcelForCenter(
                data.clients,
                allCenters ? 'Все центры' : `Центр ${centerId}`
            );

            saveAs(blob, allCenters ? 'all_clients.xlsx' : `center_${centerId}_clients.xlsx`);
        } catch (error) {
            console.error('Ошибка при экспорте:', error);
            alert('Произошла ошибка при экспорте данных');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            className="btn btn-success"
            disabled={isLoading}
        >
            {isLoading ? 'Экспорт...' : 'Экспорт в Excel'}
        </button>
    );
}
