import { BootstrapLayout } from "../components/BootstrapLayout";
import { SearchBar } from "../components/BoostrapBusqueda";
import { BootstrapDestacados } from "../components/BootsrapDestacados";
import { useState } from "react";

function Resultados({ libros, genero }) {
  // Accede directamente al array de libros
  const librosArray = Array.isArray(libros) ? libros : [];

  return (
    <div>
      <h2 className="text-start">Resultados para: "{genero}"</h2>
      <div className="row">
        {librosArray.length > 0 ? (
          librosArray.map((libro, idx) => (
            <div className="col-md-6 col-lg-4 mb-4" key={libro.id || idx}>
              <div className="card h-100 shadow book-card">
                <div className="card-body">
                  <h5 className="card-title">{libro.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted text-capitalize">
                    {libro.genre}
                  </h6>
                  <p className="card-text">
                    <strong>Autor:</strong> {libro.author}
                  </p>
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

function InicioPage({ libros, cargando, error }) {
  const [generoBuscado, setGeneroBuscado] = useState("");
  const [resultados, setResultados] = useState([]);

  // Accede al array de libros desde la propiedad books
  const librosArray = Array.isArray(libros) ? libros : [];

  const buscarPorGenero = (generoInput) => {
    const genero = (generoInput ?? "").trim().toLowerCase();
    setGeneroBuscado(genero);

    if (!genero) {
      setResultados([]);
      return;
    }

    const encontrados = librosArray.filter((libro) =>
      (libro.genre ?? "").toLowerCase().includes(genero)
    );

    setResultados(encontrados);
  };

  if (cargando) {
    return <BootstrapLayout tituloSeccion="Libros" destacados={<p>Cargando…</p>} />;
  }
  if (error) {
    return (
      <BootstrapLayout
        tituloSeccion="Libros"
        destacados={<div className="alert alert-danger">{error}</div>}
      />
    );
  }

  console.log("Libros destacados:", librosArray);

  return (
    <BootstrapLayout
      logo="https://img.freepik.com/vector-gratis/zapato-cristal-brillante-cenicienta_23-2148470395.jpg"
      tituloSeccion="Libros Destacados"
      barraBusqueda={<SearchBar onBuscar={buscarPorGenero} />}
      resultados={
        generoBuscado && <Resultados libros={resultados} genero={generoBuscado} />
      }
      destacados={<BootstrapDestacados destacados={librosArray}/>}
    />
  );
}

export default InicioPage;