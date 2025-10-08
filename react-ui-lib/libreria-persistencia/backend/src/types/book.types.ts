import { DateTime } from 'luxon';
import { Role } from '../generated/prisma';

export interface Author {
  id: number;
  name: string;
  nationality: string;
  books?: Book[];
 }

export type Genre = 'Ciencia_Ficcion' | 'Fantasia' | 'Novela_Historica' | 'Desarrollo_Personal';

export interface Book {
  id: number;
  title: string;
  authorId: number;
  imageUrl: string;
  genre: Genre;
  price: number;
  createdAt: Date;
 }


 export interface CreateBookRequest {
  title: string;
  authorId: number;
  price: number;
  imageUrl: string;
  genre: Genre;
  createdAt?: Date;
 }

 export interface UpdateBookRequest {
  title?: string;
  authorId?: number;
  price?: number;
  imageUrl?: string;
  genre?: Genre;

 }

 export interface DeleteBookRequest {
  id: number;
 }

 export interface BookResponse {
  success?: boolean;
  book: Book;
  message: string;
 }
 export interface BooksListResponse {
  success: boolean;
  books: Book[];
  total: number;
 }

export interface AuthorResponse {
  success?: boolean;
  author: Author;
  message: string;
}

export interface AuthorsListResponse {
  success: boolean;
  authors: Author[];
  total: number;
}

export interface CreateAuthorRequest {
  name: string;
  nationality: string;
}

export interface UpdateAuthorRequest {
  name?: string;
  nationality?: string;
}

export interface DeleteAuthorRequest {
  id: number;
}

export interface DeleteAuthorResponse {
  success: boolean;
  message: string;
}
