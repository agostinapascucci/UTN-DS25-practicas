import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function NuevoLibro({cargarLibros}) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    imageUrl: "",
    price: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
     if (response.ok) {
        if (cargarLibros) cargarLibros(); // Refresca los libros
        console.log("Libro guardado exitosamente");
        navigate("/");
      } else {
        console.error("Error al guardar el libro");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  return (
    <form className="p-4 shadow bg-light rounded" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Título</label>
        <input
          type="text"
          name="title"
          className="form-control"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Autor</label>
        <input
          type="text"
          name="author"
          className="form-control"
          value={formData.author}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Género</label>
        <input
          type="text"
          name="genre"
          className="form-control"
          value={formData.genre}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Imagen (URL)</label>
        <input
          type="text"
          name="imageUrl"
          className="form-control"
          value={formData.imageUrl}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Precio</label>
        <input
          type="number"
          name="price"
          className="form-control"
          value={formData.price}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn btn-success">
        Guardar Libro
      </button>
    </form>
  );
}
