import { PrismaClient } from '@/generated/prisma';
import { getDatabaseUrl } from './database-url';

// Keep DATABASE_URL in sync with DB_* vars (avoids stale credentials in dev).
process.env.DATABASE_URL = getDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
