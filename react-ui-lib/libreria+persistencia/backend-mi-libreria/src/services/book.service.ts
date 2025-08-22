import prisma from '../config/prisma'
import { Book } from '../generated/prisma'
import { CreateBookRequest, UpdateBookRequest } from '../types/book.types';

export async function getAllBooks(): Promise<Book[]> {
  const books = await prisma.book.findMany({
    orderBy: {id: 'asc'},
  });
  return books;
}

export async function getBookById(id: number): Promise<Book> {
  const book = await prisma.book.findUnique({ where: {id} });
  if (!book) {
    const error = new Error('Book not found');
    (error as any).statusCode = 404;
    throw error;
  }
  return book;
}

export async function createBook(bookData: CreateBookRequest): 
Promise<Book> {
 // Validación de reglas de negocio
 if (bookData.price <= 0) {
   const error = new Error('El precio debe ser mayor a 0');
   (error as any).statusCode = 400;
   throw error;
 }
 const newBook = await prisma.book.create(
  {
    data: {
      title: bookData.title,
      author: bookData.author,
      price: bookData.price,
      imageUrl: bookData.imageUrl,
      genre: bookData.genre,
    },
  }
 );
 return newBook;
}

export async function updateBook(id: number, updateData: 
UpdateBookRequest): Promise<Book> {
// Validar precio si viene en el update
 if (updateData.price !== undefined && updateData.price <= 0) {
   const error = new Error('El precio debe ser mayor a 0');
   (error as any).statusCode = 400;
   throw error;
 }
 try {
  const update = await prisma.book.update(
    {
      where: {id},
      data: {
        ...(updateData.title !== undefined ? { title: updateData.title } : {}),
        ...(updateData.author !== undefined ? { author: updateData.author } : {}),
        ...(updateData.genre !== undefined ? { genre: updateData.genre } : {}),
        ...(updateData.imageUrl !== undefined ? { imageUrl: updateData.imageUrl } : {}),
        ...(updateData.price !== undefined ? { price: updateData.price } : {}),
      },
    }
  );
  return update;
 } catch (e: any) {
  // Prisma error P2025 = Record Not Found
  if (e.code === 'P2025') {
    const error = new Error('Book not found');
    (error as any).statusCode = 404;
    throw error;
  }
  throw e;
 }
}