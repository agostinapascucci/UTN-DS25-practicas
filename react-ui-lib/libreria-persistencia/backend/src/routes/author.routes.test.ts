import request from 'supertest';
import app from '../app'; // Importa instancia de la aplicación Express
import * as authorService from '../services/author.service'; // Importamos para poder mockearlo
import { NextFunction } from 'express';

// --- Mocks ---

// Mockeo el módulo completo del servicio de autores.
// Esto evita que se realicen llamadas reales a la base de datos durante los tests.
jest.mock('../services/author.service');

// Mockeo los middlewares de autenticación y autorización.
// Para estos tests, simulo que el usuario siempre está autenticado y autorizado.
jest.mock('../middlewares/auth.middleware', () => ({
  authenticate: jest.fn((req, res, next) => next()), // Llama a next() para pasar
  authorize: jest.fn(() => (req:Request, res: Response, next: NextFunction) => next()), // Devuelve un middleware que llama a next()
}));

// Hago un casteo de tipo a los mocks para tener autocompletado y tipado
const mockedAuthorService = authorService as jest.Mocked<typeof authorService>;

describe('Author Routes - /api/authors', () => {

  // Limpiamos todos los mocks después de cada test para evitar interferencias
  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- Tests para GET / (Obtener todos o buscar) ---
  describe('GET /', () => {
    test('debe devolver todos los autores si no hay query de búsqueda', async () => {
      const mockAuthors = [{ id: 1, name: 'Autor 1', nationality: 'N/A' }];
      mockedAuthorService.getAllAuthors.mockResolvedValue(mockAuthors);

      const res = await request(app).get('/api/authors');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockAuthors);
      expect(mockedAuthorService.getAllAuthors).toHaveBeenCalledTimes(1);
    });

    test('debe devolver autores filtrados si hay query de búsqueda', async () => {
      const mockResult = { authors: [{ id: 2, name: 'Autor Buscado', nationality: 'N/A' }], total: 1 };
      mockedAuthorService.searchByName.mockResolvedValue(mockResult);

      const res = await request(app).get('/api/authors?search=Buscado');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(mockResult.authors);
      expect(mockedAuthorService.searchByName).toHaveBeenCalledWith('Buscado', expect.any(Object));
    });
  });

  // --- Tests para GET /:id ---
  describe('GET /:id', () => {
    test('debe devolver un autor por su ID', async () => {
      const mockAuthor = { id: 1, name: 'Autor Encontrado', nationality: 'N/A' };
      mockedAuthorService.getAuthorById.mockResolvedValue(mockAuthor);

      const res = await request(app).get('/api/authors/1');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(mockAuthor);
      expect(mockedAuthorService.getAuthorById).toHaveBeenCalledWith(1);
    });

    test('debe devolver 404 si el autor no se encuentra', async () => {
      const error = new Error('Author not found');
      (error as any).statusCode = 404;
      mockedAuthorService.getAuthorById.mockRejectedValue(error);

      const res = await request(app).get('/api/authors/999');

      expect(res.status).toBe(404);
      expect(res.body.error).toContain('Internal server error');
    });
  });

  // --- Tests para POST / ---
  describe('POST /', () => {
    test('debe crear un nuevo autor con datos válidos', async () => {
      const newAuthorData = { name: 'Nuevo Autor', nationality: 'Nueva' };
      const createdAuthor = { id: 3, ...newAuthorData };
      mockedAuthorService.createAuthor.mockResolvedValue(createdAuthor);

      const res = await request(app)
        .post('/api/authors')
        .send(newAuthorData);

      expect(res.status).toBe(201);
      expect(res.body.data).toEqual(createdAuthor);
    });

    test('debe devolver 400 si los datos son inválidos', async () => {
      const invalidData = { name: '' }; // Nombre vacío, debería fallar la validación

      const res = await request(app)
        .post('/api/authors')
        .send(invalidData);
      
      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Validation error');
    });
  });

  // --- Tests para PUT /:id ---
  describe('PUT /:id', () => {
    test('debe actualizar un autor existente', async () => {
      const updateData = { name: 'Autor Actualizado' };
      const updatedAuthor = { id: 1, name: 'Autor Actualizado', nationality: 'N/A' };
      mockedAuthorService.updateAuthor.mockResolvedValue(updatedAuthor);

      const res = await request(app)
        .put('/api/authors/1')
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(updatedAuthor);
    });
  });

  // --- Tests para DELETE /:id ---
  describe('DELETE /:id', () => {
    test('debe eliminar un autor existente', async () => {
      const deletedAuthor = { id: 1, name: 'Autor Eliminado', nationality: 'N/A' };
      mockedAuthorService.deleteAuthor.mockResolvedValue(deletedAuthor);

      const res = await request(app).delete('/api/authors/1');

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('deleted successfully');
    });
  });
});