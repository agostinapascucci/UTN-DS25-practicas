import { PrismaClient } from '@prisma/client';

// Para evitar múltiples instancias de PrismaClient en desarrollo (Hot Reload)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

// Crear instancia de Prisma
const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ["error", "warn", "query"], // Debug: errores, warnings y queries
  errorFormat: "minimal",          // Mensajes más claros en producción
});

// Guardar en global solo en desarrollo para evitar múltiples instancias
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Desconectar Prisma al cerrar el proceso
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

export default prisma;
