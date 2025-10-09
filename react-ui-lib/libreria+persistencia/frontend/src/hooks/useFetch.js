import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, clearToken } from "../helpers/auth";

/**
 * Hook de datos:
 * - Auto-fetch si pasás initialUrl (GET).
 * - doFetch(url, options) para llamados imperativos (POST/PUT/PATCH/DELETE).
 * - Si requireAuth = true, agrega Authorization y redirige a /login ante 401.
 */
export function useFetch(initialUrl = null, initialOptions = {}, { requireAuth = false } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!initialUrl);
  const [error, setError] = useState(null);

  const [executing, setExecuting] = useState(false);
  const [execError, setExecError] = useState(null);

  const navigate = useNavigate();
  const abortRef = useRef(null);

  function buildHeaders(opts = {}) {
    const headers = new Headers(opts.headers || {});
    headers.set("Accept", "application/json");
    // Si hay body y no hay Content-Type, asumimos JSON
    if (opts.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    if (requireAuth) {
      const token = getToken();
      if (!token) {
        // si no hay token y se requiere auth, mandamos a login
        navigate("/login", { replace: true });
        throw new Error("No autorizado");
      }
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  }

  async function handleResponse(res) {
    if (res.status === 401 && requireAuth) {
      clearToken();
      navigate("/login", { replace: true });
      throw new Error("Sesión expirada o no autorizada");
    }
    if (!res.ok) {
      // Intentamos leer { message } del backend
      let message = `${res.status} ${res.statusText}`;
      try {
        const payload = await res.json();
        if (payload?.message) message = payload.message;
      } catch {
        // si no hay JSON, probamos texto plano
        try {
          message = await res.text();
        } catch {}
      }
      throw new Error(message);
    }
    // Puede no tener cuerpo (204), devolvemos null en ese caso
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  // Auto-fetch para GET cuando se provee initialUrl
  useEffect(() => {
    if (!initialUrl) return;
    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = buildHeaders(initialOptions);
        const res = await fetch(initialUrl, {
          ...initialOptions,
          headers,
          signal: controller.signal,
        });
        const json = await handleResponse(res);
        setData(json);
      } catch (err) {
        if (err.name !== "AbortError") setError(err);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUrl]);

  // Llamados imperativos (DELETE/POST/etc.)
  async function doFetch(url, options = {}) {
    if (!url) throw new Error("URL requerida");
    const controller = new AbortController();
    abortRef.current = controller;

    setExecuting(true);
    setExecError(null);
    try {
      const headers = buildHeaders(options);
      const res = await fetch(url, { ...options, headers, signal: controller.signal });
      const json = await handleResponse(res);
      return json; // data del backend (si hubo)
    } catch (err) {
      if (err.name !== "AbortError") {
        setExecError(err);
        throw err; // re-lanzamos para manejar arriba si se necesita
      }
    } finally {
      setExecuting(false);
    }
  }

  return { data, loading, error, doFetch, executing, execError };
}

