
import imagen1 from "./assets/Imagenes/frenheit.jpg"
import imagen2 from "./assets/Imagenes/malinche.jpg"
import imagen3 from "./assets/Imagenes/el-nombre-del-viento-cronica-del-asesino-de-reyes-1.jpg"
import imagen4 from "./assets/Imagenes/siddharta.jpg"
import { useState } from "react";
import { BootstrapLayout } from "../src/components/BootstrapLayout";
import { BootstrapDestacados } from "../src/components/BootsrapDestacados";
import { SearchBar } from "./components/BoostrapBusqueda";
import "bootstrap/dist/css/bootstrap.min.css";
import "./bootstrap-custom.css";

 const libros = [
    { id: 1, titulo: "Fahrenheit 451", autor: "Ray Bradbury", imagen: imagen1, genero: "Ciencia Ficcion" },
    { id: 2, titulo: "Malinche", autor: "Laura Esquivel", imagen: imagen2, genero: "Novela Historica"},
    { id: 3, titulo: "El nombre del viento", autor: "Patrick Rothfuss", imagen: imagen3, genero: "Fantasia" },
    { id: 4, titulo: "Siddhartha", autor: "Hermann Hesse", imagen: imagen4, genero: "Desarrollo Personal" },
  ]

function Resultados({ libros, genero }) {
  return (
    <div>
      <h2 className="text-start">Resultados para: "{genero}"</h2>
      <div className="row">
        {libros.length > 0 ? (
          libros.map((libro) => (
            <div className="col-md-6 col-lg-4 mb-4" key={libro.id}>
              <div className="card h-100 shadow book-card">
                <div className="card-body">
                  <h5 className="card-title">{libro.titulo}</h5>
                  <h6 className="card-subtitle mb-2 text-muted text-capitalize">
                    {libro.genero}
                  </h6>
                  <p className="card-text">{libro.descripcion}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">No se encontraron libros.</p>
        )}
      </div>
    </div>
  );
}

function App() {
  const libros = [
    { id: 1, titulo: "Fahrenheit 451", autor: "Ray Bradbury", imagen: imagen1, genero: "Ciencia Ficcion" },
    { id: 2, titulo: "Malinche", autor: "Laura Esquivel", imagen: imagen2, genero: "Novela Historica"},
    { id: 3, titulo: "El nombre del viento", autor: "Patrick Rothfuss", imagen: imagen3, genero: "Fantasia" },
    { id: 4, titulo: "Siddhartha", autor: "Hermann Hesse", imagen: imagen4, genero: "Desarrollo Personal" },
  ]
  const [generoBuscado, setGeneroBuscado] = useState("");
  const [resultados, setResultados] = useState([]);

  const buscarPorGenero = (genero) => {
    setGeneroBuscado(genero);
    const encontrados = libros.filter((libro) =>
      libro.genero.toLowerCase().includes(genero)
    );
    setResultados(encontrados);
  };

  return (
    <BootstrapLayout
      logo="https://img.freepik.com/vector-gratis/zapato-cristal-brillante-cenicienta_23-2148470395.jpg"
      tituloSeccion="Libros Destacados"
      barraBusqueda={<SearchBar onBuscar={buscarPorGenero} />}
      resultados={
        generoBuscado && <Resultados libros={resultados} genero={generoBuscado} />
      }
      destacados={<BootstrapDestacados destacados={libros}/>}
    />
  );
}

export default App;



