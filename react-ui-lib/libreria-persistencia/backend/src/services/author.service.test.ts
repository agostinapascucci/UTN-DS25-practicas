import {
    getAllAuthors,
    getAuthorById, 
    createAuthor, 
    updateAuthor,
    deleteAuthor,
    searchByName
} from './author.service';

import prisma from '../config/prisma';

import { Author } from '../types/book.types';
import { mock } from 'node:test';



// Mock para todas las funciones
jest.mock('../config/prisma', () => ({
  __esModule: true,
  default: {
    author: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn()
    },
    },
}));

describe('AuthorService', () => {
    // Mock de Autores
    const mockAuthors: Author[] = [
        {
            id: 101,
            name: 'Autor 101',
            nationality: 'Nacionalidad 1',
        },
        {
            id: 201,
            name: 'Autor 201',
            nationality: 'Nacionalidad 2',
        },
        {
            id: 301,
            name: 'Autor 301',
            nationality: 'Nacionalidad 3',
        },
    ]


// Limpia todos los mocks antes de cada test para evitar interferencias
  beforeEach(() => {
    jest.clearAllMocks();
  });

// -- Test para getAllAuthors --
 describe('getAllAuthors', () => {
    test('debe retornar un array de autores, cada uno con sus datos id-name-nationality', async () => {
      // ARRANGE
      (prisma.author.findMany as jest.Mock).mockResolvedValue(mockAuthors);

      // ACT
      const result = await getAllAuthors();

      // ASSERT
      expect(result).toEqual(mockAuthors);
      expect(result[0]).toHaveProperty('id'); // Verificación explícita
      expect(result[0]).toHaveProperty('name'); // Verificación explícita
      expect(result[0]).toHaveProperty('nationality'); // Verificación explícita
      expect(prisma.author.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.author.findMany).toHaveBeenCalledWith({
        orderBy: { id: 'asc' },
      });
    });
  });

  // -- Test para getAuthorById --
  describe( 'getAuthorById', () => {
    test('debe retornar un autor si se encuentra por ID', async () => {
        // ARRANGE
        (prisma.author.findUnique as jest.Mock).mockResolvedValue(mockAuthors[1]);

        // ACT
        const autor = await getAuthorById(201);

        // ASSERT
        expect(prisma.author.findUnique).toHaveBeenCalledTimes(1);
        expect(prisma.author.findUnique).toHaveBeenCalledWith({where: { id: 201 }});
        expect(autor).toEqual(mockAuthors[1]);
        expect(autor.id).toBe(201);
    });

    test('debe retornar error 404 si no se encuentra el autor por ID', async () => {
        // ARRANGE
        (prisma.author.findUnique as jest.Mock).mockResolvedValue(null);

      // ACT && ASSERT
      await expect(getAuthorById(999)).rejects.toThrow('Author not found'); // ID que no existe
      await expect(getAuthorById(999)).rejects.toHaveProperty('statusCode', 404)
    })
  });

  // -- Test para createAuthor --
  describe('createAuthor', () => {

    test('debe crear y retornar un nuevo autor', async () => {
         // ARRANGE
        const newAuthorData = {
            name: 'Autor 401',
            nationality: 'Nacionalidad4'
        };
        const createdAuthor = {
            ...newAuthorData,
            id: 401
        };
        (prisma.author.create as jest.Mock).mockResolvedValue(createdAuthor);

        // ACT
        const result = await createAuthor(newAuthorData);

        // ASSERT
        expect(result).toEqual(createdAuthor);
        expect(prisma.author.create).toHaveBeenCalledTimes(1);
        expect(prisma.author.create).toHaveBeenCalledWith({
            data: newAuthorData,
        }); 
    });
   
  });

   // -- Tests para updateAuthor --
   describe('updateAuthor', () => {
        test('debe actualizar y retornar un autor existente', async () => {
        // ARRANGE
        const updates = { nationality: 'ActualizarNacionalidad' };
        const updatedAuthor = { ...mockAuthors[0] , ...updates };
        (prisma.author.update as jest.Mock).mockResolvedValue(updatedAuthor);

        // ACT
        const result = await updateAuthor(101, updates);

        // ASSERT
        expect(prisma.author.update).toHaveBeenCalledTimes(1);
        expect(prisma.author.update).toHaveBeenCalledWith({
            where: { id: 101 },
            data: updates,
        });
        expect(result.nationality).toBe('ActualizarNacionalidad');
        expect(result.name).toBe('Autor 101');
        expect(result.id).toBe(101);
        
        });
    });

    // -- Tests para deleteAuthor --
    describe('deleteAuthor', () => {
        test('debe llamar a prisma.author.delete con el ID correcto', async () => {
        // ARRANGE
        (prisma.author.delete as jest.Mock).mockResolvedValue(mockAuthors as any);

        // ACT
        const result = await deleteAuthor(101);

        // ASSERT
        expect(prisma.author.delete).toHaveBeenCalledTimes(1);
        expect(prisma.author.delete).toHaveBeenCalledWith({
            where: { id: 101 },
        });
        });
    });

    // -- Test para searchByName --
    describe('searchByName', () => {
       test('debe retornar autores y el total cuando el término de búsqueda es válido', async () => {
            // ARRANGE
            const term = 'Autor1';
            const page = 1;
            const limit = 10;
            const total = 2;

            // Mockeamos la respuesta de Prisma.findMany y Prisma.count
            (prisma.author.findMany as jest.Mock).mockResolvedValue(mockAuthors);
            (prisma.author.count as jest.Mock).mockResolvedValue(total);

            // ACT
            const result = await searchByName(term, { page, limit });

            // ASSERT
            // 1. Verifica que el resultado sea el esperado
            expect(result.authors).toEqual(mockAuthors);
            expect(result.total).toBe(total);

            // 2. Verifica que findMany fue llamado con los parámetros correctos
            expect(prisma.author.findMany).toHaveBeenCalledTimes(1);
            expect(prisma.author.findMany).toHaveBeenCalledWith({
            where: { name: { contains: term, mode: 'insensitive' } },
            skip: (page - 1) * limit,
            take: limit,
            select: { id: true, name: true, nationality: true },
        });

            // 3. Verifica que count fue llamado con el filtro correcto
            expect(prisma.author.count).toHaveBeenCalledTimes(1);
            expect(prisma.author.count).toHaveBeenCalledWith({
            where: { name: { contains: term, mode: 'insensitive' } },
            });
        });

      test('debe retornar un resultado vacío si el término es muy corto (menos de 2 caracteres)', async () => {
            // ARRANGE
            const term = 'a'; // Término inválido por su longitud
            const page = 1;
            const limit = 10;

            // ACT
            const result = await searchByName(term, { page, limit });

            // ASSERT
            // 1. Verifica que el resultado sea un objeto vacío
            expect(result).toEqual({ authors: [], total: 0 });

            // 2. MUY IMPORTANTE: Verifica que no se hizo ninguna llamada a la base de datos
            expect(prisma.author.findMany).not.toHaveBeenCalled();
            expect(prisma.author.count).not.toHaveBeenCalled();
        });

      test('debe retornar un resultado vacío si el término solo contiene espacios', async () => {
            // ARRANGE
            const term = '  '; // Término que será vacío después del trim()

            // ACT
            const result = await searchByName(term, { page: 1, limit: 10 });

            // ASSERT
            expect(result).toEqual({ authors: [], total: 0 });
            expect(prisma.author.findMany).not.toHaveBeenCalled();
            expect(prisma.author.count).not.toHaveBeenCalled();
        });

      test('debe retornar un resultado vacío si no se encuentran autores', async () => {
            // ARRANGE
            const term = 'Inexistente';
            const page = 1;
            const limit = 10;

            // Mockeamos una respuesta vacía de la base de datos
            (prisma.author.findMany as jest.Mock).mockResolvedValue([]);
            (prisma.author.count as jest.Mock).mockResolvedValue(0);

            // ACT
            const result = await searchByName(term, { page, limit });

            // ASSERT
            expect(result).toEqual({ authors: [], total: 0 });
            expect(prisma.author.findMany).toHaveBeenCalledTimes(1);
            expect(prisma.author.count).toHaveBeenCalledTimes(1);
        });
    });






});