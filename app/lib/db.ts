import { PrismaClient } from '../../prisma/client/index.js';

// Prevent multiple instances of Prisma Client in development (hot reload)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient(): PrismaClient {
  const client = new PrismaClient({
    log: [
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'warn' },
    ],
  });

  // Filter out benign idle-socket closures emitted by Neon's PgBouncer
  // Neon serverless automatically terminates idle TCP sockets, and Prisma automatically reconnects
  // Suppressing the raw engine log prevents harmless console spam
  (client as any).$on?.('error', (e: any) => {
    if (e?.message?.includes('kind: Closed') || e?.message?.includes('cause: None')) {
      return;
    }
    console.error('Prisma Error:', e);
  });

  (client as any).$on?.('warn', (e: any) => {
    console.warn('Prisma Warning:', e);
  });

  return client;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
