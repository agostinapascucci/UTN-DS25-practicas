import { BootstrapLayout } from "../components/BootstrapLayout";
import {SearchBar} from "../components/BoostrapBusqueda"
import { BootstrapDestacados } from "../components/BootsrapDestacados";
import { useState } from "react";


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

function InicioPage({libros}) {
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

export default InicioPage;