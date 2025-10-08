import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export function SearchBar({ onBuscar }) {
  const [inputGenero, setInputGenero] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onBuscar(inputGenero.trim().toLowerCase());
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="inputGenero" className="form-label fw-bold">
          Buscar por Género
        </label>
        <div className="input-group">
          <span className="input-group-text bg-white">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            id="inputGenero"
            placeholder="Ej: Ciencia Ficción"
            value={inputGenero}
            onChange={(e) => setInputGenero(e.target.value)}
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary">
        Buscar
      </button>
    </form>
  );
}
