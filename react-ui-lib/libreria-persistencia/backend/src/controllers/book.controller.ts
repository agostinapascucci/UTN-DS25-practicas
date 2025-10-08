 import { Request, Response, NextFunction } from 'express';
 import * as bookService from '../services/book.service';


 export async function getAllBooks(req: Request, res: 
    Response, next: NextFunction) {
        try {
            const books = await bookService.getAllBooks();
            res.json({
            success: true,
            books,
            total: books.length
            });
        } catch (error) {
            next(error);
        }
    }

 export async function getBookById(req: Request, res: 
    Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const book = await bookService.getBookById(parseInt(id));
            res.json({
            success: true,
            book,
            message: 'Book retrieved successfully'
            });
        } catch (error) {
            next(error);
        }
    }
 export async function createBook(
   req: Request,
   res: Response,
   next: NextFunction
 ) {
    try {
        const newBook = await bookService.createBook(req.body);
        res.status(201).json({
        success: true,
        data: newBook,
        message: 'Book created successfully'
        });
    } catch (error) {
        next(error);
    }
 }
 export async function updateBook(
  req: Request,
  res: Response,
  next: NextFunction
 ) {
    try {
        const id = parseInt(req.params.id);
        const updatedBook = await bookService.updateBook(id, req.body);
        res.json({
        success: true,
        data: updatedBook,
        message: 'Book updated successfully'
        });
    } catch (error) {
        next(error);
    }
 }

export async function deleteBook(   
req: Request,
res: Response,
next: NextFunction
) {
try {
    const id = parseInt(req.params.id);
    const bookDeleted = await bookService.deleteBook(id);
    res.json({ 
        success: true,
        message: `Book with id ${id} deleted successfully`
    });
} catch (error) {
    next(error);
}}