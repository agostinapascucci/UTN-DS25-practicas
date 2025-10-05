import { BootstrapLayout } from "../components/BootstrapLayout";
import { SearchBar } from "../components/BoostrapBusqueda";
import { BootstrapDestacados } from "../components/BootsrapDestacados";
import { useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";


function Resultados({ libros, genero }) {
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
                    <strong>Autor:</strong> {libro.author?.name ?? "—"}
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

function InicioPage() {
  const url = "http://localhost:3000/api/books";
  const { data, loading, error } = useFetch(url, {}, { requireAuth: true });

  const [generoBuscado, setGeneroBuscado] = useState("");
  const [resultados, setResultados] = useState([]);
  const [librosArray, setLibrosArray] = useState([]);

  // Actualiza librosArray cuando cambia data
  useEffect(() => {
    setLibrosArray(Array.isArray(data?.books) ? data.books : []);
  }, [data]);

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

  // Esta función elimina el libro del estado local
  const handleDeleteBook = (deletedId) => {
    setLibrosArray(prev => prev.filter(libro => libro.id !== deletedId));
    // Si hay resultados de búsqueda, también actualízalos
    setResultados(prev => prev.filter(libro => libro.id !== deletedId));
  };

  if (loading) {
    return <BootstrapLayout tituloSeccion="Libros" destacados={<p>Cargando…</p>}/>;
  }
  if (error) {
    return (
      <BootstrapLayout
        tituloSeccion="Libros"
        destacados={<div className="alert alert-danger">{error}</div>}
      />
    );
  }

  return (
    <BootstrapLayout
      logo="https://img.freepik.com/vector-gratis/zapato-cristal-brillante-cenicienta_23-2148470395.jpg"
      tituloSeccion="Libros Destacados"
      barraBusqueda={<SearchBar onBuscar={buscarPorGenero} />}
      resultados={
        generoBuscado && <Resultados libros={resultados} genero={generoBuscado} />
      }
      destacados={
        <BootstrapDestacados destacados={librosArray} onDelete={handleDeleteBook} />
      }
    />
  );
}

export default InicioPage;