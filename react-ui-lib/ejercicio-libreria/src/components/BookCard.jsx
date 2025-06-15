export function BookCard({ id, titulo, autor, imagen}) {
    return(
        <div className="book-card" id={id}>
            <div className="book-image-container">
                <img src={imagen} alt={`Portada ${titulo}`} className="book-image" />
            </div>
            <div className="book-details">
                <h3 className="book-title">Titulo: {titulo}</h3>
                <p className="book-author">Autor: {autor}</p>
            </div>
        </div>
    );
}