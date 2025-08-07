import { Book, CreateBookRequest, UpdateBookRequest } from '../types/book.types';
 // Mock data (próxima clase: PostgreSQL real)
 let books: Book[] = [
    { 
        id: 1, 
        title: "Fahrenheit 451", 
        author: "Ray Bradbury", 
        imageUrl:"https://cdn.kobo.com/book-images/d3fa7c43-17e1-455a-b7fb-7ba8c38cdfad/1200/1200/False/fahrenheit-451-the-gripping-and-inspiring-classic-of-dystopian-science-fiction.jpg",
        genre: "Ciencia Ficcion", 
        price: 15.99 },
      { 
        id: 2, 
        title: "Malinche", 
        author: "Laura Esquivel", 
        imageUrl:"https://www.penguinlibros.com/ar/2129758/malinche.jpg", 
        genre: "Novela Historica",
        price: 12.99 },
      { 
        id: 3, 
        title: "El nombre del viento", 
        author: "Patrick Rothfuss", 
        imageUrl:"https://www.edicontinente.com.ar/image/titulos/9788499082479.jpg", 
        genre: "Fantasia", 
        price: 20.00 },
      { 
        id: 4, 
        title: "Siddhartha", 
        author: "Hermann Hesse", 
        imageUrl:"https://images.cdn2.buscalibre.com/fit-in/360x360/97/82/97822208af909f07ea67963d470b5171.jpg" , 
        genre: "Desarrollo Personal", 
        price: 10.50 },
      { 
        id: 5, 
        title: "1984", 
        author: "George Orwell", 
        imageUrl: "https://images.cdn3.buscalibre.com/fit-in/360x360/89/47/8947c0a2d054ac3f4d7b6dfb4f5936cb.jpg", 
        genre: "Ciencia Ficcion", 
        price: 14.50 }
      ];
 export async function getAllBooks(): Promise<Book[]> {
  return books;
 }

 export async function getBookById(id: number): Promise<Book> {
  const book = books.find(b => b.id === id);
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
 const newBook: Book = {
   id: Math.max(...books.map(b => b.id)) + 1,
   ...bookData,
   createdAt: new Date(),
 };
 books.push(newBook);
 return newBook;
 }

 export async function updateBook(id: number, updateData: 
UpdateBookRequest): Promise<Book> {
 const bookIndex = books.findIndex(b => b.id === id);
 if (bookIndex === -1) {
   const error = new Error('Libro no encontrado');
   (error as any).statusCode = 404;
   throw error;
 }
 // Validar precio si viene en el update
 if (updateData.price !== undefined && updateData.price <= 0) {
   const error = new Error('El precio debe ser mayor a 0');
   (error as any).statusCode = 400;
   throw error;
 }
 books[bookIndex] = { ...books[bookIndex], ...updateData };
 return books[bookIndex];
 }