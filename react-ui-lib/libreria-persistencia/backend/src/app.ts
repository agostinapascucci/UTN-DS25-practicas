import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth.routes';
import { userRoutes } from './routes/user.routes';
import { bookRoutes } from './routes/book.routes';
import { authorRoutes } from './routes/author.routes';
import { logRequest } from './middlewares/logger.middleware';
import { handleError } from './middlewares/error.middleware';
import { PrismaClient } from '@prisma/client';
import { json } from 'body-parser';
import { error } from 'console';

// Instanciar variables de entorno
dotenv.config();

const prisma = new PrismaClient();

// Puerto desde env ( con default 3000)
const PORT = process.env.PORT || 3000;
const app = express();

// Opciones de CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
} ;

// Middlewares globales
app.use(cors(corsOptions)); // Habilitar CORS
app.use(express.json()); // Middleware para parsear JSON
app.use(logRequest); // Middleware de logging

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes); // Rutas de libros
app.use('/api/authors', authorRoutes); // Rutas de autores

// Error handling middleware
app.use(handleError); 

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running...`);
});

app.get("/health/db", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).send("Database OK ✅");
  } catch (err) {
    res.status(500).send(`Database error: ${(err as Error).message}`);
  }
});

export default app; // Exportar la aplicación para pruebas o uso en otros módulos