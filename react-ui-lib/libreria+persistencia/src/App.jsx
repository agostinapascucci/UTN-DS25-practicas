import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom"
import { useState, useEffect, useCallback } from "react"
import InicioPage from "./pages/InicioPage"
import NuevoLibroPage from "./pages/NuevoLibroPage"
import LoginPage from "./pages/LoginPage"
import "bootstrap/dist/css/bootstrap.min.css"
import "./bootstrap-custom.css"
import { getToken } from "./helpers/auth"

function RequireAuth() {
  const location = useLocation();
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage/>}
      ></Route>
      <Route element={<RequireAuth/>}>
        <Route
          path="/"
          element={<InicioPage/>}
        />
        <Route
          path="/agregar"
          element={<NuevoLibroPage/>}
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  )
}

export default App
