export interface Book {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
  genre: string;
  price: number;
  createdAt: Date;
 }
 export interface CreateBookRequest {
  title: string;
  author: string;
  price: number;
  imageUrl: string;
  genre: string;
 }

 export interface UpdateBookRequest {
  title?: string;
  author?: string;
  price?: number;
  imageUrl?: string;
  genre?: string;
 }
 export interface BookResponse {
  book: Book;
  message: string;
 }
 export interface BooksListResponse {
  books: Book[];
  total: number;
 }