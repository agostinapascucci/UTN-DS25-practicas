import React from "react";
import { Link } from "react-router-dom";

export function BootstrapLayout ({
  logo,
  tituloSeccion,
  barraBusqueda,
  resultados,
  destacados
}) {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <header className="bg-dark text-white py-3 shadow">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-auto">
              <img
                src={logo || "/placeholder.svg"}
                alt="logo"
                className="rounded-circle"
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
              />
            </div>
            <div className="col text-center">
              <h1 className="display-4 mb-0 fw-bold">Cinderella Books</h1>
              <p>{tituloSeccion}</p>
            </div>
            <div className="col-auto">{/* Spacer for symmetry */}</div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
        <div className="container">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link fw-semibold px-3" to="/">
                  <i className="bi bi-house-door me-1"></i>Inicio
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/agregar">
                  <i className="bi bi-plus-circle me-1"></i> Añadir Libro
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>


      {/* Barra de búsqueda */}
      <div className="mb-4">{barraBusqueda}</div>

            {/* Main Content */}
      <main className="flex-grow-1 py-4">
        <div className="container">
        {/* Resultados */}
          <div className="mb-4">{resultados}</div>

          {/* Libros destacados */}
          <div className="mb-4">{destacados}</div>
        </div>
      </main>
    </div>
  );
};
