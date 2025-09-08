import {PrismaClient} from '../generated/prisma';
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: ["error", "warn", "query"], // agregamos "query" para debuggear
 });
 
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
export default prisma;
