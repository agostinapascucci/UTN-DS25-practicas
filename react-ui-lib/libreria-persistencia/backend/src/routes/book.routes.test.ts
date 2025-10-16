import request from 'supertest';
import app from '../app'; // Importa tu instancia de la aplicación Express
import { Request, Response, NextFunction } from 'express';
import * as bookService from '../services/book.service'; // Importamos para poder mockearlo
import { Book, Genre } from '@prisma/client';

// Este test es de integracion, pero no va a tener en cuenta la autenticacion y autorizacion ya que prefiero
// chequearla en otro Test de Autenticación (Unitario).

// --- Mocks ---

// Mockeamos el módulo completo del servicio de libros para evitar llamadas a la BD.
jest.mock('../services/book.service');

// Mockeamos los middlewares de autenticación y autorización para saltarlos en los tests.
jest.mock('../middlewares/auth.middleware', () => ({
  authenticate: jest.fn((req, res, next) => next()),
  authorize: jest.fn(() => (req: Request, res:Response, next:NextFunction) => next()),
}));

// Hacemos un type casting a los mocks para tener autocompletado y tipado.
const mockedBookService = bookService as jest.Mocked<typeof bookService>;



describe('Book Routes - /api/books', () => {

  // Limpiamos todos los mocks después de cada test.
  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- Tests para GET / (Obtener todos los libros) ---
  describe('GET /', () => {
    test('debe devolver una lista de todos los libros', async () => {
      const mockBooks: Book[] = [{ id: 1, title: 'Libro 1', price: 30.5, authorId: 101, genre: 'Fantasia', imageUrl: 'imagen.jpg', createdAt: new Date('2023-02-10T10:00:00Z')}];
      mockedBookService.getAllBooks.mockResolvedValue(mockBooks);

      const res = await request(app).get('/api/books');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(mockedBookService.getAllBooks).toHaveBeenCalledTimes(1);
    });
  });

  // --- Tests para GET /:id ---
  describe('GET /:id', () => {
    test('debe devolver un libro por su ID', async () => {
      const mockBook = { id: 1, title: 'Libro Encontrado', authorId: 101 };
      mockedBookService.getBookById.mockResolvedValue(mockBook as any);

      const res = await request(app).get('/api/books/1');

      expect(res.status).toBe(200);
      expect(mockedBookService.getBookById).toHaveBeenCalledWith(1);
    });

    test('debe devolver 404 si el libro no se encuentra', async () => {
      const error = new Error('Book not found');
      (error as any).statusCode = 404;
      mockedBookService.getBookById.mockRejectedValue(error);

      const res = await request(app).get('/api/books/999');

      expect(res.status).toBe(404);
      expect(res.body.error).toContain('Internal server error');
    });

    test('debe devolver 400 si el ID no es un número', async () => {
        const res = await request(app).get('/api/books/abc');
  
        expect(res.status).toBe(400);
        expect(res.body.message).toContain('Validation error');
      });
  });

  // --- Tests para POST / ---
  describe('POST /', () => {
    test('debe crear un nuevo libro con datos válidos', async () => {
      const newBookData = { 
        title: 'Nuevo Libro', 
        authorId: 1, 
        price: 25.50, 
        imageUrl: 'http://example.com/url.jpg', 
        genre: 'Ciencia_Ficcion' };

      const createdBook = { 
        id: 30, 
        createdAt: new Date('2023-02-10T10:00:00Z'), 
        ...newBookData } as any;

      mockedBookService.createBook.mockResolvedValue(createdBook);  
  

      const res = await request(app).post('/api/books').send(newBookData);

      expect(res.status).toBe(201);
      expect(res.body.data).toMatchObject({
        id: 30,
        title: newBookData.title,
        authorId: newBookData.authorId,
        price: newBookData.price,
        imageUrl: newBookData.imageUrl,
        genre: newBookData.genre,
      });
      expect(typeof res.body.data.createdAt).toBe("string"); 
    });

    test('debe devolver 400 si faltan datos requeridos', async () => {
      const invalidData = { title: 'Libro sin autor' }; // Faltan campos

      const res = await request(app)
        .post('/api/books')
        .send(invalidData);
      
      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Validation error');
    });
  });

  // --- Tests para PUT /:id ---
  describe('PUT /:id', () => {
    test('debe actualizar un libro existente', async () => {
      const updateData = { title: 'Título Actualizado' };
      const updatedBook = { id: 1, title: 'Título Actualizado', authorId: 101 };
      mockedBookService.updateBook.mockResolvedValue(updatedBook as any);

      const res = await request(app)
        .put('/api/books/1')
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(updatedBook);
    });
  });

  // --- Tests para DELETE /:id ---
  describe('DELETE /:id', () => {
    test('debe eliminar un libro existente y retornar un mensaje de éxito', async () => {
        // La función deleteBook en el servicio no retorna el libro, sino void
        mockedBookService.deleteBook.mockResolvedValue(undefined as any);

        const res = await request(app).delete('/api/books/1');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toContain('Book with id 1 deleted successfully');
    });
  });
});