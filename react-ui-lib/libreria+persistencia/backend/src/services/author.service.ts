import prisma from '../config/prisma'
import { Author } from '@prisma/client';
import { CreateAuthorRequest, UpdateAuthorRequest, DeleteAuthorRequest, AuthorResponse, AuthorsListResponse } from '../types/book.types';

export async function getAllAuthors(): Promise<Author[]> {
  const authors = await prisma.author.findMany({
    orderBy: {id: 'asc'}
  });
  return authors;
}

export async function getAuthorById(id: number): Promise<Author> {
  const author = await prisma.author.findUnique({ 
    where: {id}
  });   
    if (!author) {
        const error = new Error('Author not found');
        (error as any).statusCode = 404;
        throw error;
    }
  return author;
}

export async function createAuthor(data: {
  name: string;
  nationality: string;
}): 
Promise<Author> {
 const newAuthor = await prisma.author.create(
  {
    data,
  }
 );
 return newAuthor;
}

export async function updateAuthor(id: number, data: Partial<Author>): Promise<Author> {
 try {  
    const update = await prisma.author.update(
        {
            where: {id},
            data
        }
    );
    return update;
 } catch (error) {
    if ((error as any).code === 'P2025') {
        const notFoundError = new Error('Author not found');
        (notFoundError as any).statusCode = 404;
        throw notFoundError;
    }   
    throw error;
    }
}

export async function deleteAuthor(id: number): Promise<Author> {
 try {  
    const deleted = await prisma.author.delete(
        {
            where: {id}
        }
    );
    return deleted;
 } catch (error) {
    if ((error as any).code === 'P2025') {
        const notFoundError = new Error('Author not found');
        (notFoundError as any).statusCode = 404;
        throw notFoundError;
    }   
    throw error;
    }
}

export async function searchByName(term: string, { page, limit }: { page: number; limit: number }) {
  const q = term.trim();
  if (q.length < 2) return { authors: [], total: 0 };


  const [authors, total] = await Promise.all([
    prisma.author.findMany({
      where: { name: { contains: q, mode: "insensitive" as const } },
      skip: (page - 1) * limit,
      take: limit,
      select: { id: true, name: true, nationality: true },
    }),
    prisma.author.count({ where: { name: { contains: q, mode: "insensitive" as const } } }),
  ]);

  return { authors, total };
}