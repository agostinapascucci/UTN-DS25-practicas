import { Router } from 'express';
import * as authorController from '../controllers/author.controller';
import { createAuthorSchema, updateAuthorSchema, getAuthorByIdSchema, deleteAuthorSchema } from '../validations/author.validation';
import { validate } from '../middlewares/validation.middleware';

const router = Router();
 // GET /api/authors
 router.get('/', authorController.getAllAuthors);
 // GET /api/authors/:id 
router.get('/:id', validate(getAuthorByIdSchema, 'params'), authorController.getAuthorById);
 // POST /api/authors
 router.post('/',validate(createAuthorSchema, 'body'), authorController.createAuthor);
 // PUT /api/authors/:id
 router.put('/:id', validate(getAuthorByIdSchema, 'params'), validate(updateAuthorSchema, 'body'), authorController.updateAuthor);

 // DELETE /api/authors/:id
router.delete('/:id', validate(deleteAuthorSchema, 'params'), authorController.deleteAuthor);

export const authorRoutes = router;