import { Client as PrismaClient } from '@prisma/client';

export interface Client extends PrismaClient {
    // Дополнительные поля, если нужны
    centerName?: string;
    Center?: {
        name: string;
    };
}

// Тип для создания/обновления клиента (без id и timestamps)
export type ClientInput = Omit<PrismaClient, 'id' | 'createdAt' | 'updatedAt'>;
