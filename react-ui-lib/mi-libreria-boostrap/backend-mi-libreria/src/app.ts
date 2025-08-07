import express from 'express';
import cors from 'cors';
import { bookRoutes } from './routes/book.routes';
import { logRequest } from './middlewares/logger.middleware';
import { handleError } from './middlewares/error.middleware';
import { json } from 'body-parser';

const app = express();
app.use(json()); // Middleware para parsear JSON
app.use(logRequest); // Middleware de logging
app.use(cors({
    origin: '*'
})); // Habilitar CORS para todas las rutas
app.use('/api/books', bookRoutes); // Rutas de libros
app.use(handleError); // Middleware de manejo de errores
app.get('/', (req, res) => {
  res.send('Welcome to the Book API');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
export default app; // Exportar la aplicación para pruebas o uso en otros módulos