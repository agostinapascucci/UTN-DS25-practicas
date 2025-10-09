import { createContext, useState, useContext, useEffect } from "react";

// Importar helpers existentes
import {
    getToken,
    setToken,
    clearToken,
    getUserData,
    isTokenExpired,
    parseJwt
} from "../helpers/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const API_URL = import.meta.env.VITE_API_URL;

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Cargar usuario si ya hay token ( al recargar la página  )
    useEffect(() => {
        const token = getToken(); // Usamos el helper existente
        if (token && !isTokenExpired()) { // Verificamos si el token no ha expirado
            const userData = getUserData(); // Usamos el helper existente
            setUser(userData);
        } else if (token) {
            clearToken(); // Limpiar token si ha expirado
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
       try {
              const response = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Login failed");
        }
        const { data } = await response.json();
        setToken(data.token);

        const userData = parseJwt(data.token); // Usamos el helper existente
        setUser(userData);

        return { success: true };
       } catch (error) {
            return { success: false, message: error.message };
    }
    };

    const logout = () => {
        clearToken(); // Usamos el helper existente
        setUser(null);
    };

    // Verificar si el token ha expirado en cada renderizado
    useEffect(() => {
        const interval = setInterval(() => {
            if (isTokenExpired()) {
                logout();
            }
        }, 60000); // Verificar cada minuto
        return () => clearInterval(interval);
    }, []);

    const value = {
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "ADMIN",
        isUser: user?.role === "USER",
        hasRole: (role) => user?.role === role,
        canAccess: (resource) => {
            if (!user) return false;
            if (user.role === "ADMIN") return true;
            if (user.role === "USER" && resource === "user") return true;
            return false;
        },
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook personalizado para usar el contexto de autenticación
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context; 
}

