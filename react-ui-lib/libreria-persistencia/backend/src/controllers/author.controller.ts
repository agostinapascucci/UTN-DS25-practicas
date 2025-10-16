import { Request, Response, NextFunction } from 'express';
import * as authorService from '../services/author.service';
import { success } from 'zod';
import { ca } from 'zod/v4/locales/index.cjs';

// author.controller.ts

// ELIMINA las funciones getAllAuthors y searchAuthors y AÑADE esta:

export async function findAuthors(req: Request, res: Response, next: NextFunction) {
  try {
    const { search: searchTerm, page, limit } = res.locals.validatedData;

    // Si hay un término de búsqueda, usamos la lógica de búsqueda
    if (searchTerm && searchTerm.length >= 2) {

      const { authors, total } = await authorService.searchByName(searchTerm.trim(), { page, limit });
      
      return res.json({
        success: true,
        data: authors,
        total,
        page,
        limit
      });
    }

    // Si NO hay término de búsqueda, obtenemos todos los autores
    const authors = await authorService.getAllAuthors();
    return res.json({
      success: true,
      data: authors,
      total: authors.length
    });

  } catch (error) {
    next(error);
  }
}

    export async function getAuthorById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const author = await authorService.getAuthorById(parseInt(id));
            res.json({
            success: true,
            data:author,
            message: 'Author retrieved successfully'
            });
        }
        catch (error) {
            next(error);
        }
    }

 export async function createAuthor(
   req: Request,
   res: Response,
   next: NextFunction
 ) {
    try {
        const newAuthor = await authorService.createAuthor(req.body);
        res.status(201).json({  
            success: true,
            data: newAuthor,
            message: 'Author created successfully'
        });
    } catch (error) {
        next(error);
    }   
}

    export async function updateAuthor(
    req: Request,
    res: Response,
    next: NextFunction
    ) {
        try {
            const id = parseInt(req.params.id);
            const updatedAuthor = await authorService.updateAuthor(id, req.body);
            res.json({
                success: true,
                data: updatedAuthor,
                message: 'Author updated successfully'
            });
        }   
        catch (error) {
            next(error);
        }
    }

    export async function deleteAuthor(
    req: Request,
    res: Response,  
    next: NextFunction
    ) {
        try {
            const id = parseInt(req.params.id);
            const deletedAuthor = await authorService.deleteAuthor(id);
            res.json({
                success: true,
                message: `Author with id ${deletedAuthor.id} deleted successfully`,
            });
        }   
        catch (error) {
            next(error);
        }
    }

 


