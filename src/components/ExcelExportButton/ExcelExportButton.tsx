'use client';

import { useState } from 'react';
import { generateExcelForCenter } from '@/utils/excelGenerator';
import { saveAs } from 'file-saver';

interface ExcelExportButtonProps {
    allCenters?: boolean;
    centerId?: number;
}

export default function ExcelExportButton({ allCenters = false, centerId }: ExcelExportButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleExport = async () => {
        setIsLoading(true);

        try {
            // Формируем URL в зависимости от режима
            const url = allCenters
                ? '/api/clients/export-all'
                : `/api/clients?centerId=${centerId}`;

            const response = await fetch(url);
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
