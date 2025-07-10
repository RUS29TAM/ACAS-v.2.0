import ExcelJS from 'exceljs';
import { Client } from '@/models/client';
export async function generateExcelForCenter(clients: Client[], centerName: string) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Клиенты');

    // Заголовки
    worksheet.columns = [
        { header: 'id', key: 'id', width: 15 },
        { header: 'ИНН', key: 'inn', width: 15 },
        { header: 'Фамилия', key: 'lastName', width: 15 },
        { header: 'Имя', key: 'firstName', width: 15 },
        { header: 'Отчество', key: 'middleName', width: 15 },
        { header: 'Организация', key: 'organizationName', width: 30 },
        { header: 'Телефон', key: 'phone', width: 15 },
        { header: 'Email', key: 'email', width: 25 },
        { header: 'Тип клиента', key: 'clientType', width: 15 },
        { header: 'Субъект МСП', key: 'smsp', width: 15 },
        { header: 'Вид коммуникации', key: 'communicationType', width: 20 },
        { header: 'Проект', key: 'project', width: 15 },
        { header: 'Комментарий', key: 'notes', width: 15 },
        { header: 'Центр', key: 'centerId', width: 15 },
        { header: 'Дата создания', key: 'createdAt', width: 20 },
        { header: 'Дата обновления', key: 'updatedAt', width: 20 },
    ];

    // Данные
    clients.forEach(client => {
        worksheet.addRow({
            id: client.id,
            inn: client.inn,
            lastName: client.lastName,
            firstName: client.firstName,
            middleName: client.middleName || '',
            organizationName: client.organizationName || '',
            phone: client.phone,
            email: client.email || '',
            clientType: client.clientType,
            smsp: client.smsp ? 'Да' : 'Нет',
            communicationType: client.communicationType,
            project: client.project,
            notes: client.notes,
            // centerId: client.centerId,
            centerId: client.centerId === 1 && 'ЦПП'
                || client.centerId === 2 && 'ЦКР'
                || client.centerId === 3 && 'ЦРИД'
                || client.centerId === 4 && 'Инноватика'
                || client.centerId === 5 && 'ГЧП'
                || client.centerId === 6 && 'ЦПЭ'
                || client.centerId === 7 && 'РЦК'
                || client.centerId === 8 && 'Маркетинг'
                || client.centerId === 9 && 'Входная гр.' ,

            createdAt: new Date(client.createdAt).toLocaleString(),
            updatedAt: new Date(client.updatedAt).toLocaleString(),
        });
    });

    // Стили для заголовков
    worksheet.getRow(1).eachCell(cell => {
        cell.font = { bold: true };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD9D9D9' },
        };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
    });

    // Генерация файла
    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
}
