import { Router } from 'express';
import * as bookController from '../controllers/book.controller';
import { createBookSchema, updateBookSchema, deleteBookSchema, getBookByIdSchema } from '../validations/book.validation';
import { validate } from '../middlewares/validation.middleware';

 const router = Router();
 // GET /api/books
 router.get('/', bookController.getAllBooks);
 // GET /api/books/:id 
router.get('/:id', validate(getBookByIdSchema, 'params'),bookController.getBookById);
 // POST /api/books
 router.post('/', validate(createBookSchema, 'body'), bookController.createBook);
 // PUT /api/books/:id
 router.put('/:id', validate(getBookByIdSchema, 'params'), validate(updateBookSchema, 'body'), bookController.updateBook);

 // DELETE /api/books/:id
router.delete('/:id', validate(deleteBookSchema, 'params'), bookController.deleteBook);
 export const bookRoutes = router;