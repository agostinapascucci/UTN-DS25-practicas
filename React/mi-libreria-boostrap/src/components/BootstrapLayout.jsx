export function BootstrapLayout({ logo, tituloSeccion, children }) {
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
                <a className="nav-link fw-semibold px-3" href="#" target="_self">
                  <i className="bi bi-house-door me-1"></i>Inicio
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-semibold px-3" href="#" target="_self">
                  <i className="bi bi-rocket me-1"></i>Ciencia Ficción
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-semibold px-3" href="#" target="_self">
                  <i className="bi bi-clock-history me-1"></i>Novela Histórica
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-semibold px-3" href="#" target="_self">
                  <i className="bi bi-person-check me-1"></i>Desarrollo Personal
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-semibold px-3" href="#" target="_self">
                  <i className="bi bi-magic me-1"></i>Fantasía
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-semibold px-3" href="#" target="_self">
                  <i className="bi bi-person-plus me-1"></i>Registración
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-semibold px-3" href="#" target="_self">
                  <i className="bi bi-envelope me-1"></i>Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow-1 py-4">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="bg-white rounded shadow-sm p-4">
                <h2 className="h3 mb-4 pb-2 border-bottom border-primary text-dark">
                  <i className="bi bi-star-fill text-warning me-2"></i>
                  {tituloSeccion}
                </h2>
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-light py-4 mt-auto">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4 mb-2">
              <p className="mb-0">
                <i className="bi bi-c-circle me-1"></i>
                Todos los derechos reservados.
              </p>
            </div>
            <div className="col-md-4 mb-2">
              <p className="mb-0">
                <i className="bi bi-instagram me-1"></i>
                Instagram: @cinderellabooks_
              </p>
            </div>
            <div className="col-md-4 mb-2">
              <p className="mb-0">
                <i className="bi bi-file-text me-1"></i>
                <a href="#" className="text-light text-decoration-none">
                  Términos y condiciones
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
