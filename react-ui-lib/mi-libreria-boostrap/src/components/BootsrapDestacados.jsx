import imagen1 from "../assets/Imagenes/frenheit.jpg"
import imagen2 from "../assets/Imagenes/malinche.jpg"
import imagen3 from "../assets/Imagenes/el-nombre-del-viento-cronica-del-asesino-de-reyes-1.jpg"
import imagen4 from "../assets/Imagenes/siddharta.jpg"
import { BootstrapBookCard } from "./BootstrapBookCard"

export function BootstrapDestacados() {
  const destacados = [
    { id: 1, titulo: "Fahrenheit 451", autor: "Ray Bradbury", imagen: imagen1 },
    { id: 2, titulo: "Malinche", autor: "Laura Esquivel", imagen: imagen2 },
    { id: 3, titulo: "El nombre del viento", autor: "Patrick Rothfuss", imagen: imagen3 },
    { id: 4, titulo: "Siddhartha", autor: "Hermann Hesse", imagen: imagen4 },
  ]

  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
      {destacados.map((libro) => (
        <BootstrapBookCard key={libro.id} {...libro} />
      ))}
    </div>
  )
}
