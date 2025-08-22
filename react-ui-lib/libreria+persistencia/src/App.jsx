import { Routes, Route } from "react-router-dom"
import { useState, useEffect, useCallback } from "react"
import InicioPage from "./pages/InicioPage"
import NuevoLibroPage from "./pages/NuevoLibroPage"
import "bootstrap/dist/css/bootstrap.min.css"
import "./bootstrap-custom.css"
import { supabase } from "./utils/supabase"

function App() {
  const [libros, setLibros] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const cargarLibros = useCallback(async () => {
    try {
      setCargando(true)
      setError(null)

      const { data, error } = await supabase
        .from("Book")             
        .select("id, title, author, genre, imageUrl, price, createdAt")

      if (error) throw error
      
      setLibros(data || [])
    } catch (err) {
      console.error("Error al obtener libros:", err)
      setError(err.message ?? "Error al obtener libros")
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargarLibros()
  }, [cargarLibros])

  useEffect(() => {
    const channel = supabase
      .channel("book-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Book" },
        () => cargarLibros()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [cargarLibros])

  return (
    <Routes>
      <Route
        path="/"
        element={
          <InicioPage
            libros={libros}
            cargando={cargando}
            error={error}
          />
        }
      />
      <Route
        path="/agregar"
        element={
          <NuevoLibroPage
            cargarLibros={cargarLibros}
          />
        }
      />
    </Routes>
  )
}

export default App
