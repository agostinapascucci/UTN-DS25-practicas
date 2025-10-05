import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { bookSchema } from "../validations/bookSchema";
import { useAuth } from "../contexts/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export function NuevoLibro({ cargarLibros }) {
  const navigate = useNavigate();
  const { doFetch } = useFetch(null, {}, { requireAuth: true });
  const doFetchRef = useRef(doFetch);
  useEffect(() => {
    doFetchRef.current = doFetch;
  }, [doFetch]);

  // --- CONTEXTO DE AUTENTICACIÓN ---
  const { user, logout } = useAuth();

  // Solo permite agregar libros si el usuario tiene rol 'ADMIN'
  const isAdmin = user?.role === "ADMIN";

  // ---------------- RHF + YUP ----------------
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(bookSchema),
    defaultValues: {
      title: "",
      genre: "",
      imageUrl: "",
      price: "",
      authorId: null,
    },
  });

  // ---------------- autor: búsqueda / selección / creación ----------------
  const [authorSearch, setAuthorSearch] = useState("");
  const [authorResults, setAuthorResults] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState(null); // { id, name, nationality }
  const [showCreateAuthor, setShowCreateAuthor] = useState(false);
  const [newAuthor, setNewAuthor] = useState({ name: "", nationality: "" });

  // ---------------- estado general ----------------
  const [authorLoading, setAuthorLoading] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState(null);
  const queryIdRef = useRef(0);

  // valores del formulario (para UI controlada si hace falta)
  const genreValue = watch("genre");

  // --------- helpers ----------
  const onChangeNewAuthor = (e) =>
    setNewAuthor((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const canSubmit = useMemo(() => {
    // dejamos que RHF/yup maneje la mayoría, acá sólo evitamos submit si estamos creando autor y faltan campos
    if (showCreateAuthor) {
      return newAuthor.name.trim() !== "" && newAuthor.nationality.trim() !== "" && !authorLoading && !isSubmitting;
    }
    return !authorLoading && !isSubmitting;
  }, [showCreateAuthor, newAuthor, authorLoading, isSubmitting]);

  // --------- búsqueda de autores con debounce ----------
  useEffect(() => {
    const term = authorSearch.trim();

    if (term.length < 2 || showCreateAuthor || selectedAuthor) {
      setAuthorResults([]);
      return;
    }

    const myId = ++queryIdRef.current;
    setAuthorLoading(true);
    setErrorGlobal(null);

    const t = setTimeout(async () => {
      try {
        const json = await doFetchRef.current(
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
          setErrorGlobal(err?.message || "Error buscando autores");
          setAuthorResults([]);
        }
      } finally {
        if (queryIdRef.current === myId) {
          setAuthorLoading(false);
        }
      }
    }, 300);

    return () => clearTimeout(t);
  }, [authorSearch, showCreateAuthor, selectedAuthor]);

  const selectAuthor = (author) => {
    setSelectedAuthor(author);
    setShowCreateAuthor(false);
    setNewAuthor({ name: "", nationality: "" });
    setAuthorResults([]);
    setAuthorSearch(author?.name || "");
    setValue("authorId", author?.id ?? null);
    clearErrors("authorId");
  };

  const resetSelectedAuthor = () => {
    setSelectedAuthor(null);
    setAuthorSearch("");
    setAuthorResults([]);
    setValue("authorId", null);
  };

  const toggleCreateAuthor = () => {
    setShowCreateAuthor((s) => !s);
    setSelectedAuthor(null);
    setAuthorSearch("");
    setAuthorResults([]);
    setValue("authorId", null);
    if (!showCreateAuthor) {
      // al abrir modo crear, limpiamos error de autor si lo hubiera
      clearErrors("authorId");
    }
  };

  // ---------------- submit ----------------
  const onSubmit = async (data) => {
    setErrorGlobal(null);

    try {
      let authorId = data.authorId ?? null;

      // 1) crear autor si no hay seleccionado
      if (!authorId) {
        if (!showCreateAuthor) {
          setError("authorId", { type: "manual", message: "Seleccioná un autor o creá uno nuevo." });
          throw new Error("Falta autor");
        }

        if (!newAuthor.name.trim() || !newAuthor.nationality.trim()) {
          setError("authorId", { type: "manual", message: "Completá nombre y nacionalidad del nuevo autor." });
          throw new Error("Datos de autor incompletos");
        }

        setAuthorLoading(true);
        const authorJson = await doFetchRef.current(`${API_BASE}/authors`, {
          method: "POST",
          body: JSON.stringify(newAuthor),
        });

        const createdAuthor = authorJson?.data ?? authorJson?.author ?? authorJson;
        if (!createdAuthor?.id) {
          throw new Error("La API no devolvió el id del autor creado.");
        }
        authorId = createdAuthor.id;
        setSelectedAuthor(createdAuthor);
        setValue("authorId", authorId);
        clearErrors("authorId");
        setAuthorResults([]);
        setAuthorLoading(false);
      }

      // 2) crear libro
      const payload = {
        title: data.title.trim(),
        authorId,
        genre: data.genre,
        imageUrl: data.imageUrl?.trim() || null,
        price: Number(data.price),
      };

      const bookJson = await doFetchRef.current(`${API_BASE}/books`, {
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

      reset();
      navigate("/inicio");
    } catch (err) {
      console.error("Error guardando libro:", err);
      if (!errors.authorId) {
        setErrorGlobal(err?.message || "Ocurrió un error al guardar el libro.");
      }
    } finally {
      setAuthorLoading(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div>
      {/* Mostrar usuario actual y botón de logout */}
      {user && (
        <div className="mb-3">
          <span className="badge bg-info text-dark">
            Sesión iniciada como: {user.name || user.email} ({user.role})
          </span>
          <button className="btn btn-sm btn-outline-danger ms-2" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      )}

      {/* Validar rol ADMIN */}
      {!isAdmin ? (
        <div className="alert alert-warning">
          Solo los usuarios con rol <strong>ADMIN</strong> pueden agregar libros.
        </div>
      ) : (
        <form className="p-4 shadow bg-light rounded" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="mb-3">➕ Nuevo Libro</h3>

          {/* Título */}
          <div className="mb-3">
            <label className="form-label">Título</label>
            <input
              type="text"
              className={`form-control ${errors.title ? "is-invalid" : ""}`}
              placeholder="El nombre del libro"
              {...register("title")}
            />
            {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
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

            {/* campo oculto para RHF/yup */}
            <input type="hidden" {...register("authorId")} />

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
                  />
                </div>
                <div className="form-text">Estos campos no pasan por yup; se validan antes de crear el autor.</div>
              </div>
            )}

            {errors.authorId && <div className="text-danger mt-2">{errors.authorId.message}</div>}
          </div>

          {/* Género */}
          <div className="mb-3">
            <label className="form-label">Género</label>
            <select
              className={`form-control ${errors.genre ? "is-invalid" : ""}`}
              {...register("genre")}
              defaultValue=""
            >
              <option value="" disabled>
                Seleccione un género
              </option>
              <option value="Fantasia">Fantasía</option>
              <option value="Ciencia_Ficcion">Ciencia Ficción</option>
              <option value="Novela_Historica">Novela Histórica</option>
              <option value="Desarrollo_Personal">Desarrollo Personal</option>
            </select>
            {errors.genre && <div className="invalid-feedback">{errors.genre.message}</div>}
          </div>

          {/* Imagen */}
          <div className="mb-3">
            <label className="form-label">Imagen (URL)</label>
            <input
              type="text"
              className={`form-control ${errors.imageUrl ? "is-invalid" : ""}`}
              placeholder="https://..."
              {...register("imageUrl")}
            />
            {errors.imageUrl && <div className="invalid-feedback">{errors.imageUrl.message}</div>}
          </div>

          {/* Precio */}
          <div className="mb-3">
            <label className="form-label">Precio</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className={`form-control ${errors.price ? "is-invalid" : ""}`}
              {...register("price")}
            />
            {errors.price && <div className="invalid-feedback">{errors.price.message}</div>}
          </div>

          {/* Errores globales */}
          {errorGlobal && <div className="alert alert-danger">{errorGlobal}</div>}

          {/* Botón submit */}
          <button type="submit" className="btn btn-success" disabled={!canSubmit}>
            {isSubmitting ? "Guardando..." : "Guardar Libro"}
          </button>
        </form>
      )}
    </div>
  );
}
