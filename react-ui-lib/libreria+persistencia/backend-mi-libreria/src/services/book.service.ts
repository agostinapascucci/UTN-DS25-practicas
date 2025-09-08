import { DateTime } from 'luxon';
import prisma from '../config/prisma'
import { Book, Genre } from '../generated/prisma'
import { CreateBookRequest, UpdateBookRequest } from '../types/book.types';

export async function getAllBooks(): Promise<Book[]> {
  const books = await prisma.book.findMany({
    include: { author: true},
    orderBy: {id: 'asc'}
  });
  return books;
}

export async function getBookById(id: number): Promise<Book> {
  const book = await prisma.book.findUnique({ 
    where: {id},
    include: { author: true }
  });
  if (!book) {
    const error = new Error('Book not found');
    (error as any).statusCode = 404;
    throw error;
  }
  return book;
}

export async function createBook(data: {title: string; authorId: number; price: number; imageUrl: string;
  genre: Genre; createdAt?: Date;}): Promise<Book> {

  // Verificar que el authorId exista
  const author = await prisma.author.findUnique({
    where: {id: data.authorId}
  });
  if (!author) {
    const error = new Error('Author not found');
    (error as any).statusCode = 400;
    throw error;
  }
 const newBook = await prisma.book.create(
  { data,
    include: { author: true } });
 return newBook;
}

export async function updateBook(id: number, data: Partial<Book>): Promise<Book> {
 if (data.authorId){
  const authorExists = await prisma.author.findUnique({where: {
    id: data.authorId
  }});
  if (!authorExists){
    const error = new Error('El autor no existe') as any;
    error.statusCode = 404;
    throw error;
  }
 }
 try {
  const update = await prisma.book.update(
    {
      where: {id},
      data, 
      include: { author: true}
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

export async function deleteBook(id: number): Promise<void> {
 try {
  await prisma.book.delete({  
    where: {id}
  });
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