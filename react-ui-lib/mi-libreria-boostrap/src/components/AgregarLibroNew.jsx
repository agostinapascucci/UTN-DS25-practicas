
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function NuevoLibro({agregarLibro}) {
  const [formData, setFormData] = useState({
    titulo: "",
    genero: "",
    descripcion: "",
    imagen: ""
  });
  
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    agregarLibro(formData);
    console.log("enviado")
    navigate("/");
  };

  return (
    <form className="p-4 shadow bg-light rounded" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Título</label>
        <input
          type="text"
          name="titulo"
          className="form-control"
          value={formData.titulo}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Autor</label>
        <input
          type="text"
          name="autor"
          className="form-control"
          value={formData.autor}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Género</label>
        <input
          type="text"
          name="genero"
          className="form-control"
          value={formData.genero}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Imagen (URL)</label>
        <input
          type="text"
          name="imagen"
          className="form-control"
          value={formData.imagen}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn btn-success">
        Guardar Libro
      </button>
    </form>
  );
}
