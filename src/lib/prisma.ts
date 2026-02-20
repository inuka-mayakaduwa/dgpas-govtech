// 1. Import from your custom generated output path
import { PrismaClient } from '../../generated/prisma/client';
// 2. Import the Prisma Postgres adapter
import { PrismaPg } from '@prisma/adapter-pg';

declare global {
    var prisma: PrismaClient | undefined;
}

// 3. Initialize the adapter with your connection string
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

// 4. Pass the adapter to the PrismaClient constructor
export const prisma =
    global.prisma ??
    new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;