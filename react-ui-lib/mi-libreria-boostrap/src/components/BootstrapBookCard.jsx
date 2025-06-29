export function BootstrapBookCard({ id, titulo, autor, imagen, genero }) {
  return (
    <div className="col">
      <div className="card h-100 shadow-sm border-0 book-card">
        <div className="card-img-top-container" style={{ height: "280px", overflow: "hidden" }}>
          <img
            src={imagen || "/placeholder.svg"}
            alt={`Portada ${titulo}`}
            className="card-img-top h-100 w-100"
            style={{ objectFit: "contain", transition: "transform 0.3s ease" }}
          />
        </div>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-primary fw-bold">
            <i className="bi bi-book me-2"></i>
            {titulo}
          </h5>
          <p className="card-text text-muted mb-3">
            <i className="bi bi-person me-2"></i>
            <strong>Autor:</strong> {autor}
          </p>
          <p className="card-text text-muted mb-3">
              <i className="bi bi-bookmark-star-fill"></i> Género: {genero}
          </p>
          <div className="mt-auto">
            <button className="btn btn-outline-primary btn-sm me-2">
              <i className="bi bi-eye me-1"></i>
              Ver detalles
            </button>
            <button className="btn btn-primary btn-sm">
              <i className="bi bi-cart-plus me-1"></i>
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
