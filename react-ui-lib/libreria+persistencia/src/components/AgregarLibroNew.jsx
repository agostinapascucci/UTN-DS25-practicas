import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:3000/api";

export function NuevoLibro() {
  // --------- estado del libro ----------
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    imageUrl: "",
    price: ""
  });

  // --------- estado de autor (búsqueda/selección/creación) ----------
  const [authorSearch, setAuthorSearch] = useState("");
  const [authorResults, setAuthorResults] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState(null); // {id, name, nationality}
  const [showCreateAuthor, setShowCreateAuthor] = useState(false);
  const [newAuthor, setNewAuthor] = useState({ name: "", nationality: "" });

  // --------- estado general ----------
  const [loading, setLoading] = useState(false);
  const [authorLoading, setAuthorLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const abortCtrlRef = useRef(null);

  // --------- helpers ----------
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onChangeNewAuthor = (e) =>
    setNewAuthor((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const canSubmit = useMemo(() => {
    const hasBookCore =
      formData.title.trim() &&
      formData.genre.trim() &&
      String(formData.price).trim();
    const hasAuthor =
      selectedAuthor?.id ||
      (showCreateAuthor && newAuthor.name.trim() !== "" && newAuthor.nationality.trim() !== "");
    return Boolean(hasBookCore && hasAuthor && !loading);
  }, [formData, selectedAuthor, showCreateAuthor, newAuthor, loading]);

  // --------- búsqueda de autores con debounce ----------
  useEffect(() => {
    const term = authorSearch.trim();
    if (term.length < 2 || showCreateAuthor || selectedAuthor) {
      setAuthorResults([]);
      return;
    }
    // cancelar consultas anteriores
    if (abortCtrlRef.current) abortCtrlRef.current.abort();
    const ctrl = new AbortController();
    abortCtrlRef.current = ctrl;

    const t = setTimeout(async () => {
      try {
        setAuthorLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE}/authors?search=${encodeURIComponent(term)}`, {
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        // se espera { success, data: [...] }
        const list = Array.isArray(json?.data) ? json.data : [];
        setAuthorResults(list);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error buscando autores:", err);
          setError(err.message || "Error buscando autores");
          setAuthorResults([]);
        }
      } finally {
        setAuthorLoading(false);
      }
    }, 300); // debounce 300ms

    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [authorSearch]);

  const selectAuthor = (author) => {
    setSelectedAuthor(author);
    setShowCreateAuthor(false);
    setNewAuthor({ name: "", nationality: "" });
    setAuthorResults([]);
    setAuthorSearch(author?.name || "");
  };

  const resetSelectedAuthor = () => {
    setSelectedAuthor(null);
    setAuthorSearch("");
    setAuthorResults([]);
  };

  const toggleCreateAuthor = () => {
    setShowCreateAuthor((s) => !s);
    setSelectedAuthor(null);
  };

  // --------- submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      // 1) obtener o crear authorId
      let authorId = selectedAuthor?.id || null;

      if (!authorId) {
        if (!showCreateAuthor) {
          setError("Seleccioná un autor o creá uno nuevo.");
          return;
        }
        if (!newAuthor.name.trim() || !newAuthor.nationality.trim()) {
          setError("Completá nombre y nacionalidad del nuevo autor.");
          return;
        }
        // crear autor
        const resAuthor = await fetch(`${API_BASE}/authors`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newAuthor),
        });
        if (!resAuthor.ok) {
          const t = await resAuthor.text();
          throw new Error(`No se pudo crear el autor. ${t || ""}`);
        }
        const authorJson = await resAuthor.json();
        // esperar { success, data: { id, name, nationality } } o similar
        const created = authorJson?.data || authorJson?.author || authorJson;
        if (!created?.id) throw new Error("La API no devolvió el id del autor creado.");
        authorId = created.id;
      }

      // 2) crear libro con authorId
      const payload = {
        title: formData.title.trim(),
        authorId,
        genre: formData.genre, // usar tus enums exactos
        imageUrl: formData.imageUrl?.trim() || null,
        price: Number(formData.price),
      };

      const resBook = await fetch(`${API_BASE}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!resBook.ok) {
        const t = await resBook.text();
        throw new Error(`No se pudo crear el libro. ${t || ""}`);
      }

      if (typeof cargarLibros === "function") {
        await cargarLibros();
      }
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message || "Ocurrió un error al guardar el libro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="p-4 shadow bg-light rounded" onSubmit={handleSubmit}>
      {/* Título */}
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

      {/* Autor: buscador + selección o creación */}
      <div className="mb-3">
        <label className="form-label d-flex align-items-center justify-content-between">
          <span>Autor</span>
          <button
            type="button"
            className={`btn btn-sm ${showCreateAuthor ? "btn-outline-secondary" : "btn-link"}`}
            onClick={toggleCreateAuthor}
          >
            {showCreateAuthor ? "Buscar autor existente" : "¿No está? Crear nuevo autor"}
          </button>
        </label>

        {!showCreateAuthor ? (
          <>
            {selectedAuthor ? (
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-success">
                  {selectedAuthor.name} ({selectedAuthor.nationality || "—"})
                </span>
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={resetSelectedAuthor}>
                  Cambiar
                </button>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar autor por nombre…"
                  value={authorSearch}
                  onChange={(e) => setAuthorSearch(e.target.value)}
                />
                {authorLoading && <div className="form-text">Buscando autores…</div>}
                {!authorLoading && authorSearch.trim() && (
                  <ul className="list-group mt-2">
                    {authorResults.length > 0 ? (
                      authorResults.map((a) => (
                        <li
                          key={a.id}
                          className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                          role="button"
                          onClick={() => selectAuthor(a)}
                        >
                          <span>
                            {a.name}{" "}
                            <small className="text-muted">
                              {a.nationality ? `· ${a.nationality}` : ""}
                            </small>
                          </span>
                          <span className="badge bg-primary rounded-pill">Seleccionar</span>
                        </li>
                      ))
                    ) : (
                      <li className="list-group-item text-muted">Sin resultados</li>
                    )}
                  </ul>
                )}
              </>
            )}
          </>
        ) : (
          <div className="row g-2">
            <div className="col-md-6">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Nombre del autor"
                value={newAuthor.name}
                onChange={onChangeNewAuthor}
                required={showCreateAuthor}
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                name="nationality"
                className="form-control"
                placeholder="Nacionalidad"
                value={newAuthor.nationality}
                onChange={onChangeNewAuthor}
                required={showCreateAuthor}
              />
            </div>
          </div>
        )}
      </div>

      {/* Género */}
      <div className="mb-3">
        <label className="form-label">Género</label>
        <select
          name="genre"
          id="genre"
          className="form-control"
          value={formData.genre}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Seleccione un género</option>
          <option value="Fantasia">Fantasía</option>
          <option value="Ciencia_Ficcion">Ciencia Ficción</option>
          <option value="Novela_Historica">Novela Histórica</option>
          <option value="Desarrollo_Personal">Desarrollo Personal</option>
        </select>
      </div>

      {/* Imagen */}
      <div className="mb-3">
        <label className="form-label">Imagen (URL)</label>
        <input
          type="text"
          name="imageUrl"
          className="form-control"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://..."
        />
      </div>

      {/* Precio */}
      <div className="mb-3">
        <label className="form-label">Precio</label>
        <input
          type="number"
          name="price"
          className="form-control"
          value={formData.price}
          onChange={handleChange}
          step="0.01"
          min="0"
          required
        />
      </div>

      {/* Errores */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Botón submit */}
      <button type="submit" className="btn btn-success" disabled={!canSubmit}>
        {loading ? "Guardando..." : "Guardar Libro"}
      </button>
    </form>
  );
}
