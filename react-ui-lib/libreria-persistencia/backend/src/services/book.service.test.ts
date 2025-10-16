// Funciones a probas 
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from './book.service';
import prisma from '../config/prisma';
import { Book, Author, Genre} from '../types/book.types';

// Defino el tipo de la respuesta Book + Author
type BookWithAuthor = {
    id: number;
    title: string;
    authorId: number;
    imageUrl: string;
    genre: Genre;
    price: number;
    createdAt: Date;
    author: Author,
}

// Mock de Prisma para todas las operaciones del modelo 'book'
jest.mock('../config/prisma', () => ({
  __esModule: true,
  default: {
    book: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    author: {
        findUnique: jest.fn(),
    }
  },
}));


describe('BookService', () => {
  // Datos de prueba reutilizables

  // 1. Mock de autores
  const mockAuthor1: Author = { id: 201, name: 'Cixin Liu', nationality: 'Nacionalida1' };
  const mockAuthor2: Author = { id: 202, name: 'Patrick Rothfuss', nationality: 'Nacionalidad2' };
  const mockBookWithAuthor: BookWithAuthor = {
    id: 1,
    title: 'El Problema de los Tres Cuerpos',
    authorId: 201,
    imageUrl: 'https://via.placeholder.com/150/1ABC9C/FFFFFF?Text=Book1',
    genre: 'Ciencia_Ficcion',
    price: 24.99,
    createdAt: new Date('2023-02-10T10:00:00Z'),
    author: mockAuthor1,
  };

  const mockBooksArrayWithAutor: BookWithAuthor[] = [
    mockBookWithAuthor,
    {
        id: 2,
        title: 'El Nombre del Viento',
        authorId: 202,
        imageUrl: 'https://via.placeholder.com/150/3498DB/FFFFFF?Text=Book2',
        genre: 'Fantasia',
        price: 22.0,
        createdAt: new Date('2023-04-18T11:30:00Z'),
        author: mockAuthor2
    },
    {
        id: 3,
        title: "Los Pilares de la Tierra",
        authorId: 203,
        imageUrl: "https://via.placeholder.com/150/9B59B6/FFFFFF?Text=Book3",
        genre: 'Novela_Historica',
        price: 27.50,
        createdAt: new Date("2023-06-05T15:20:00Z"),
        author: mockAuthor1,
    },
  ];

  // Limpia todos los mocks antes de cada test para evitar interferencias
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Tests para getAllBooks ---
  describe('getAllBooks', () => {
    test('debe retornar un array de libros, cada uno con su autor', async () => {
      // ARRANGE
      (prisma.book.findMany as jest.Mock).mockResolvedValue(mockBooksArrayWithAutor);

      // ACT
      const result = await getAllBooks();

      // ASSERT
      expect(result).toEqual(mockBooksArrayWithAutor);
      expect(result[0]).toHaveProperty('author'); // Verificación explícita
      expect(prisma.book.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.book.findMany).toHaveBeenCalledWith({
        include: { author: true },
        orderBy: { id: 'asc' },
      });
    });
  });

  // --- Tests para getBookById ---
  describe('getBookById', () => {
    test('debe retornar un libro si se encuentra por ID', async () => {
      // ARRANGE
      (prisma.book.findUnique as jest.Mock).mockResolvedValue(mockBookWithAuthor);

      // ACT
      const result = await getBookById(1);

      // ASSERT
      expect(prisma.book.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.book.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { author: true },
      });
      expect(result).toEqual(mockBookWithAuthor);
      expect(result.authorId).toBe(201);
    });

    test('debe retornar error 404 si el libro no se encuentra', async () => {
      // ARRANGE
      (prisma.book.findUnique as jest.Mock).mockResolvedValue(null);

      // ACT && ASSERT
      await expect(getBookById(999)).rejects.toThrow('Book not found'); // ID que no existe
      await expect(getBookById(999)).rejects.toHaveProperty('statusCode', 404)
    });
  });

  // --- Tests para createBook ---
  describe('createBook', () => {
    test('debe crear y retornar un nuevo libro, incluyendo los datos del autor', async () => {
      // ARRANGE
      const newBookData = {
        title: 'Nuevo Libro de Fantasía',
        authorId: 301,
        imageUrl: 'url/imagen.jpg',
        genre: 'Fantasia' as const, // 'as const' para asegurar el tipo
        price: 29.99,
      };
      const createdBook = { ...newBookData, id: 4, createdAt: new Date(), author: mockAuthor1 };
      (prisma.author.findUnique as jest.Mock).mockResolvedValue(mockAuthor1);
      (prisma.book.create as jest.Mock).mockResolvedValue(createdBook);

      // ACT
      const result = await createBook(newBookData);

      // ASSERT
      expect(result).toEqual(createdBook);
      expect(result).toHaveProperty('author');
      expect(prisma.book.create).toHaveBeenCalledTimes(1);
      expect(prisma.book.create).toHaveBeenCalledWith({
        data: newBookData,
        include: {author: true},
      });
    });
  });

  // --- Tests para updateBook ---
  describe('updateBook', () => {
    test('debe actualizar y retornar un libro existente con su autor', async () => {
      // ARRANGE
      const updates = { price: 25.5 };
      const updatedBook = { ...mockBookWithAuthor, ...updates };
      (prisma.book.update as jest.Mock).mockResolvedValue(updatedBook);

      // ACT
      const result = await updateBook(1, updates);

      // ASSERT
      expect(result).toEqual(updatedBook);
      expect(result.price).toBe(25.5);
      expect(prisma.book.update).toHaveBeenCalledTimes(1);
      expect(prisma.book.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updates,
        include: { author: true },
      });
    });
  });

  // --- Tests para deleteBook ---
  describe('deleteBook', () => {
    test('debe llamar a prisma.book.delete con el ID correcto', async () => {
      // ARRANGE
      (prisma.book.delete as jest.Mock).mockResolvedValue(mockBookWithAuthor as any);

      // ACT
      const result = await deleteBook(1);

      // ASSERT
      expect(prisma.book.delete).toHaveBeenCalledTimes(1);
      expect(prisma.book.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
