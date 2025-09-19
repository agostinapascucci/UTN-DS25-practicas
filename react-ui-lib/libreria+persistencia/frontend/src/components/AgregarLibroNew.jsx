import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";

const API_BASE = "http://localhost:3000";

export function NuevoLibro({ cargarLibros }) {
  const navigate = useNavigate();
  const { doFetch } = useFetch(null, {}, { requireAuth: true });

  // --------- estado del libro ----------
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    imageUrl: "",
    price: "",
  });

  // --------- estado de autor (búsqueda/selección/creación) ----------
  const [authorSearch, setAuthorSearch] = useState("");
  const [authorResults, setAuthorResults] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState(null); // { id, name, nationality }
  const [showCreateAuthor, setShowCreateAuthor] = useState(false);
  const [newAuthor, setNewAuthor] = useState({ name: "", nationality: "" });

  // --------- estado general ----------
  const [loading, setLoading] = useState(false);
  const [authorLoading, setAuthorLoading] = useState(false);
  const [error, setError] = useState(null);

  // Para “última respuesta gana” en la búsqueda
  const queryIdRef = useRef(0);

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
      (showCreateAuthor &&
        newAuthor.name.trim() !== "" &&
        newAuthor.nationality.trim() !== "");
    return Boolean(hasBookCore && hasAuthor && !loading);
  }, [formData, selectedAuthor, showCreateAuthor, newAuthor, loading]);

  // --------- búsqueda de autores con debounce ----------
  useEffect(() => {
    const term = authorSearch.trim();

    if (term.length < 2 || showCreateAuthor || selectedAuthor) {
      setAuthorResults([]);
      return;
    }

    const myId = ++queryIdRef.current;
    setAuthorLoading(true);
    setError(null);

    const t = setTimeout(async () => {
      try {
        const json = await doFetch(
          `${API_BASE}/authors?search=${encodeURIComponent(term)}`,
          { method: "GET" }
        );

        const list = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
          ? json
          : [];

        if (queryIdRef.current === myId) {
          setAuthorResults(list);
        }
      } catch (err) {
        if (queryIdRef.current === myId) {
          console.error("Error buscando autores:", err);
          setError(err?.message || "Error buscando autores");
          setAuthorResults([]);
        }
      } finally {
        if (queryIdRef.current === myId) {
          setAuthorLoading(false);
        }
      }
    }, 300); // debounce 300ms

    return () => {
      clearTimeout(t);
    };
    // ⚠️ No incluimos doFetch en deps para evitar disparar el efecto en cada render.
  }, [authorSearch, showCreateAuthor, selectedAuthor]); 

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
    setLoading(true);

    let authorId = selectedAuthor?.id || null;

    try {
      // 1) crear autor si no hay seleccionado
      if (!authorId) {
        if (!showCreateAuthor) {
          throw new Error("Seleccioná un autor o creá uno nuevo.");
        }
        if (!newAuthor.name.trim() || !newAuthor.nationality.trim()) {
          throw new Error("Completá nombre y nacionalidad del nuevo autor.");
        }

        setAuthorLoading(true);

        const authorJson = await doFetch(`${API_BASE}/authors`, {
          method: "POST",
          body: JSON.stringify(newAuthor), // el hook setea Content-Type si falta
        });

        const createdAuthor =
          authorJson?.data ?? authorJson?.author ?? authorJson;

        if (!createdAuthor?.id) {
          throw new Error("La API no devolvió el id del autor creado.");
        }

        authorId = createdAuthor.id;
        setSelectedAuthor(createdAuthor);
        setAuthorResults([]);
        setAuthorLoading(false);
      }

      // 2) crear libro
      const payload = {
        title: formData.title.trim(),
        authorId,
        genre: formData.genre, // usar tus enums exactos
        imageUrl: formData.imageUrl?.trim() || null,
        price: Number(formData.price),
      };

      if (!payload.title) throw new Error("El título es obligatorio.");
      if (!authorId) throw new Error("Falta seleccionar o crear el autor.");
      if (Number.isNaN(payload.price)) throw new Error("Precio inválido.");

      const bookJson = await doFetch(`${API_BASE}/books`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const createdBook = Array.isArray(bookJson?.data)
        ? bookJson.data[0]
        : bookJson?.data ?? bookJson?.book ?? bookJson;

      if (!createdBook?.id) {
        console.warn("La API no devolvió el id del libro creado.");
      }

      if (typeof cargarLibros === "function") {
        await cargarLibros();
      }

      navigate("/");
    } catch (err) {
      console.error("Error guardando libro:", err);
      setError(err?.message || "Ocurrió un error al guardar el libro.");
    } finally {
      setLoading(false);
    }
  };

  // --------- UI ----------
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
            className={`btn btn-sm ${
              showCreateAuthor ? "btn-outline-secondary" : "btn-link"
            }`}
            onClick={toggleCreateAuthor}
          >
            {showCreateAuthor
              ? "Buscar autor existente"
              : "¿No está? Crear nuevo autor"}
          </button>
        </label>

        {!showCreateAuthor ? (
          <>
            {selectedAuthor ? (
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-success">
                  {selectedAuthor.name} ({selectedAuthor.nationality || "—"})
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={resetSelectedAuthor}
                >
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
                {authorLoading && (
                  <div className="form-text">Buscando autores…</div>
                )}
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
                          <span className="badge bg-primary rounded-pill">
                            Seleccionar
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="list-group-item text-muted">
                        Sin resultados
                      </li>
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
          <option value="" disabled>
            Seleccione un género
          </option>
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
