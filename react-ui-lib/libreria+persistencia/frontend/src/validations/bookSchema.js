import * as yup from "yup";

export const bookSchema = yup.object().shape({
  title: yup.string().required("El título es obligatorio"),
  genre: yup.string().oneOf(['Ciencia_Ficcion', 'Fantasia', 'Desarrollo_Personal', 'Novela_Historica']).required("El género es obligatorio"),
  price: yup
    .number()
    .typeError("El precio debe ser un número")
    .positive("El precio debe ser un número positivo")
    .required("El precio es obligatorio"),
  imageUrl: yup.string().url("La URL de la imagen no es válida").nullable(),
});

