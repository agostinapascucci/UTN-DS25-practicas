import { z } from "zod";

// Convierte "1" -> 1 y valida entero positivo
const positiveInt = z.preprocess((val) => {
  if (typeof val === "string" && val.trim() !== "") return Number(val);
  return val;
}, z.number().int("El ID debe ser un número entero").positive("El ID debe ser positivo"));

// Convierte "2500" -> 2500 y valida número positivo con tope
const positiveNumber = z.preprocess((val) => {
  if (typeof val === "string" && val.trim() !== "") return Number(val);
  return val;
}, z.number().positive("El precio debe ser positivo").max(9999, "El precio no puede exceder 9999"));

export const createBookSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(200, "El título no puede exceder 200 caracteres").trim(),
  price: positiveNumber,
  authorId: positiveInt,
  imageUrl: z.string().url("Debe ser una URL válida"),
  genre: z.enum(["Ciencia_Ficcion", "Fantasia", "Desarrollo_Personal", "Novela_Historica"], {
    message: "Género inválido"
  }),
  createdAt: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    return arg;
  }, z.date({ message: "Fecha de creación inválida" })).optional(),
});

export const updateBookSchema = createBookSchema.partial();

export const deleteBookSchema = z.object({
  id: positiveInt,
});

export const getBookByIdSchema = z.object({
  id: positiveInt,
});

