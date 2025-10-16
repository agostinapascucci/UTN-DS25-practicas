import { ZodError, ZodType } from 'zod';
import { Request, Response, NextFunction } from 'express';

type Source = 'body' | 'query' | 'params';
export const validate = (schema: ZodType<any>, source: Source = 'body') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validar y transformar los datos de la solicitud
            const dataToValidate = (req as any)[source];
            const validatedData = await schema.parseAsync(dataToValidate);
            res.locals.validatedData = validatedData;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Si la validación falla, enviar un error 400 con los detalles 
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.issues.map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    })
                    )
                });
            }
            return next(error); // Pasar otros errores al siguiente middleware
        }
    }
}
