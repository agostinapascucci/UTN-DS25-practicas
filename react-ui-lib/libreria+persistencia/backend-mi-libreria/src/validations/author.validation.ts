import { z } from 'zod';

const positiveInt = z.preprocess((val) => {
  if (typeof val === "string" && val.trim() !== "") return Number(val);
  return val;
}, z.number().int("El ID debe ser un número entero").positive("El ID debe ser positivo"));


export const createAuthorSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    nationality: z.string().min(1, 'Nationality is required'),
});

export const updateAuthorSchema = createAuthorSchema.partial();

export const deleteAuthorSchema = z.object({
    id: positiveInt,
});

export const getAuthorByIdSchema = z.object({
    id: positiveInt,
});