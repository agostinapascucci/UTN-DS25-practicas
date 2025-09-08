 import { Request, Response, NextFunction } from 'express';
 import * as authorService from '../services/author.service';

    export async function getAllAuthors(req: Request, res: Response, next: NextFunction) {
        try {
            const authors = await authorService.getAllAuthors();
            res.json({
            success: true,
            data: authors,
            total: authors.length
            });
        }
        catch (error) {
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

    


