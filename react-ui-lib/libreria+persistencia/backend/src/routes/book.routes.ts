import { Router } from 'express';
import * as bookController from '../controllers/book.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { createBookSchema, updateBookSchema, deleteBookSchema, getBookByIdSchema } from '../validations/book.validation';
import { validate } from '../middlewares/validation.middleware';

 const router = Router();
 // GET /api/books
 router.get(
    '/', 
    authenticate,
    authorize('ADMIN', 'USER'),
    bookController.getAllBooks);

 // GET /api/books/:id 
router.get(
    '/:id', 
    authenticate,
    authorize('ADMIN', 'USER'),
    validate(getBookByIdSchema, 'params'),
    bookController.getBookById);

 // POST /api/books
 router.post(
    '/', 
    authenticate,
    authorize('ADMIN'),
    validate(createBookSchema, 'body'), 
    bookController.createBook);

 // PUT /api/books/:id
 router.put(
    '/:id', 
    authenticate,
    authorize('ADMIN'),
    validate(getBookByIdSchema, 'params'), 
    validate(updateBookSchema, 'body'), 
    bookController.updateBook);

 // DELETE /api/books/:id
router.delete(
    '/:id', 
    authenticate,
    authorize('ADMIN'),
    validate(deleteBookSchema, 'params'), 
    bookController.deleteBook);
 export const bookRoutes = router;