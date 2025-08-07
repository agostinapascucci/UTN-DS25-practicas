import { BootstrapBookCard } from "./BootstrapBookCard"


export function BootstrapDestacados({ destacados }) {
  const libros = destacados.books || [];

  return (
    <>
      <div className="bg-white rounded shadow-sm p-4">
        <h2 className="h3 mb-4 pb-2 border-bottom border-primary text-dark">
          <i className="bi bi-star-fill text-warning me-2"></i>
          Libros Destacados
        </h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {libros.map((libro) => (
            <BootstrapBookCard key={libro.id} {...libro} />
          ))}
        </div>
      </div>
    </>

  )
}