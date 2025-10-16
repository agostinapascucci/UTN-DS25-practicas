import { Router } from 'express';
import * as authorController from '../controllers/author.controller';
import { createAuthorSchema, updateAuthorSchema, getAuthorByIdSchema, deleteAuthorSchema, searchAuthorQuerySchema } from '../validations/author.validation';
import { validate } from '../middlewares/validation.middleware';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

 // GET /api/authors
 router.get(
    '/', 
    authenticate,
    authorize('ADMIN', 'USER'),
    validate(searchAuthorQuerySchema, 'query'),
    authorController.findAuthors);

 // GET /api/authors/:id 
router.get(
    '/:id', 
    authenticate,
    authorize('ADMIN', 'USER'),
    validate(getAuthorByIdSchema, 'params'), 
    authorController.getAuthorById);

// // GET /api/authors?search=brad&page=1&limit=10
// router.get(
//     '/', 
//     authenticate,
//     authorize('ADMIN', 'USER'),
//     validate(searchAuthorQuerySchema, 'query'), 
//     authorController.searchAuthors);

 // POST /api/authors
 router.post(
    '/',
    authenticate,
    authorize('ADMIN'),
    validate(createAuthorSchema, 'body'), 
    authorController.createAuthor);

 // PUT /api/authors/:id
 router.put(
    '/:id', 
    authenticate,
    authorize('ADMIN'),
    validate(getAuthorByIdSchema, 'params'), 
    validate(updateAuthorSchema, 'body'), 
    authorController.updateAuthor);

 // DELETE /api/authors/:id
router.delete(
    '/:id', 
    authenticate,
    authorize('ADMIN', 'USER'),
    validate(deleteAuthorSchema, 'params'), 
    authorController.deleteAuthor);

export const authorRoutes = router;