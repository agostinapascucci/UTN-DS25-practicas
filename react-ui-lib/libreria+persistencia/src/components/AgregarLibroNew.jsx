import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase.ts";

export function NuevoLibro({cargarLibros}) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    imageUrl: "",
    price: ""
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      const priceNumber =
        formData.price === "" || formData.price === null
          ? null : Number(formData.price);
       
      const { error } = await supabase 
        .from("Book")
        .insert([{
          title: formData.title,
          author: formData.author,
          genre: formData.genre,
          imageUrl: formData.imageUrl,
          price: priceNumber,
        }])

      if (error) {
      console.error("Error al guardar el libro:", error);
      alert(error.message || "Error al guardar el libro");
      return;
      }

      if (typeof cargarLibros === "function") {
        await cargarLibros();
      }

      console.log("Libro guardado exitosamente");
      navigate("/")

    } catch (err) {
      console.error("Error al guardar el libro:", err);
      alert("Error de red o de cliente");
    } finally {
      setLoading(false);
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
