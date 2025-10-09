 import { Request, Response, NextFunction } from 'express';
 import * as authorService from '../services/author.service';
import { success } from 'zod';
import { ca } from 'zod/v4/locales/index.cjs';

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

    export async function searchAuthors(req: Request, res: Response, next: NextFunction) {
        try {
            const searchRaw = String(req.query.search ?? "");
            const term = searchRaw.trim();
            if (term.length < 2){
                return res.json({
                    success: true,
                    data: [],
                    total: 0,
                    page: 1,
                    limit: 10
                });
            }

            const page = Math.max(1, Number(req.query.page) ?? 1);
            const limit = Math.min(50, Math.max(1, Number(req.query.limit) ?? 10));

            const { authors, total } = await authorService.searchByName(term, { page, limit });
            res.json({
                success: true,
                data: authors,
                total,
                page,
                limit
            });
        } catch (error) {
            next(error);
        }
            

    }    


