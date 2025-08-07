import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import InicioPage from "./pages/InicioPage";
import NuevoLibroPage from "./pages/NuevoLibroPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./bootstrap-custom.css";

function App() {
  const [libros, setLibros] = useState([]);

  const cargarLibros = () => {
    fetch("http://localhost:3000/api/books")
      .then((res) => res.json())
      .then((data) => setLibros(data))
      .catch((error) => console.error("Error al obtener libros:", error));
  };

  useEffect(() => {
    cargarLibros();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<InicioPage libros={libros} />} />
      <Route path="/agregar" element={<NuevoLibroPage cargarLibros={cargarLibros} />} />
    </Routes>
  );
}

export default App;