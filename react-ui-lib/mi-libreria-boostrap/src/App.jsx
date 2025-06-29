import { Routes, Route, useNavigate } from "react-router-dom"
import { useState } from "react";
import InicioPage from "./pages/InicioPage";
import NuevoLibroPage from "./pages/NuevoLibroPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./bootstrap-custom.css";
import imagen1 from "./assets/Imagenes/frenheit.jpg"
import imagen2 from "./assets/Imagenes/malinche.jpg"
import imagen3 from "./assets/Imagenes/el-nombre-del-viento-cronica-del-asesino-de-reyes-1.jpg"
import imagen4 from "./assets/Imagenes/siddharta.jpg"

function App() {
  const [libros, setLibros ] = useState([
      { id: 1, titulo: "Fahrenheit 451", autor: "Ray Bradbury", imagen: imagen1, genero: "Ciencia Ficcion" },
      { id: 2, titulo: "Malinche", autor: "Laura Esquivel", imagen: imagen2, genero: "Novela Historica"},
      { id: 3, titulo: "El nombre del viento", autor: "Patrick Rothfuss", imagen: imagen3, genero: "Fantasia" },
      { id: 4, titulo: "Siddhartha", autor: "Hermann Hesse", imagen: imagen4, genero: "Desarrollo Personal" },
    ]);

  const agregarLibro = (nuevoLibro) => {
    setLibros([...libros, { ...nuevoLibro, id: Date.now() }]);
  };
  return(
    <Routes>
      <Route path="/" element={<InicioPage libros={libros} />} />
      <Route path="/agregar" element={<NuevoLibroPage agregarLibro={agregarLibro} />} />
    </Routes>
  )
}

export default App;