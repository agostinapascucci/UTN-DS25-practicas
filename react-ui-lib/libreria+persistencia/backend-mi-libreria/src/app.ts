import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { bookRoutes } from './routes/book.routes';
import { authorRoutes } from './routes/author.routes';
import { logRequest } from './middlewares/logger.middleware';
import { handleError } from './middlewares/error.middleware';
import { json } from 'body-parser';

// Instanciar variables de entorno
dotenv.config();

// Puerto desde env ( con default 3000)
const PORT = process.env.PORT || 3000;
const app = express();

// Opciones de CORS
const corsOptions = {
  origin: "http://localhost:5174",
  credentials: true
} ;

// Middlewares globales
app.use(cors(corsOptions)); // Habilitar CORS
app.use(express.json()); // Middleware para parsear JSON
app.use(logRequest); // Middleware de logging

// Routes
app.use('/api/books', bookRoutes); // Rutas de libros
app.use('/api/authors', authorRoutes); // Rutas de autores

// Error handling middleware
app.use(handleError); 

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
export default app; // Exportar la aplicación para pruebas o uso en otros módulos