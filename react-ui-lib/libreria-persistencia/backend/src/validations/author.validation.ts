import { z } from 'zod';

const positiveInt = (min: number, max: number) =>
  z.preprocess((val) => {
    if (typeof val === "string" && val.trim() !== "") return Number(val);
    return val;
  }, z.number().int().min(min).max(max));

// Para validar el nombre de un autor 
const cleanString = (min = 1, max = 120) => z.string()
  .min(min, `El campo debe tener al menos ${min} caracteres`)
  .max(max, `El campo debe tener como máximo ${max} caracteres`)
  .transform((val) => val.trim().replace(/\s+/g, ' '));

export const createAuthorSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    nationality: z.string().min(1, 'Nationality is required'),
});

export const updateAuthorSchema = createAuthorSchema.partial();

export const deleteAuthorSchema = z.object({
    id: positiveInt(1, Number.MAX_SAFE_INTEGER),
});

export const getAuthorByIdSchema = z.object({
    id: positiveInt(1, Number.MAX_SAFE_INTEGER),
});

// Buscar autores por nombre
export const searchAuthorQuerySchema = z.object({ 
    search: cleanString(1, 100).optional().default(''),
    page: positiveInt(1, 1_000).optional().default(1),
    limit: positiveInt(1, 50).optional().default(10),
});
