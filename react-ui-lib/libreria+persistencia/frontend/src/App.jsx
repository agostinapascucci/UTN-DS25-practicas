import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { PrivateRoute } from "./components/PrivateRoute"
import { useState, useEffect, useCallback } from "react"
import InicioPage from "./pages/InicioPage"
import NuevoLibroPage from "./pages/NuevoLibroPage"
import LoginPage from "./pages/LoginPage"
import "bootstrap/dist/css/bootstrap.min.css"
import "./bootstrap-custom.css"
import "./form.css"
import { getToken } from "./helpers/auth"


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
         <Routes>
            <Route path="/" element={<LoginPage />}/> {/* Página de login pública*/}

            {/* Rutas protegidas */}
            <Route path="/inicio" element={
                <PrivateRoute>
                  <InicioPage />
                </PrivateRoute>
              }/>

            {/* Ruta protegida solo para administradores */}
              <Route path="/agregar" element={
                <PrivateRoute requiredRole="ADMIN">
                  <NuevoLibroPage />
                </PrivateRoute>
              }/>

            <Route path="/unauthorized" element={<div><h2>No Autorizado</h2><p>No tienes permisos para ver esta página.</p></div>} />
            {/*<Route path="*" element={<Navigate to="/" replace/>}/>*/}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    
  )
}

export default App
