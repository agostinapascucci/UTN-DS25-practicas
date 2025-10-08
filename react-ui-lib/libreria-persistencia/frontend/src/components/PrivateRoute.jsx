import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function PrivateRoute({ children, requiredRole}) {
    const { isAuthenticated, user, loading } = useAuth();
    
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/" replace/>;
    }
    
    // Si se requiere un rol específico y el usuario no lo tiene, redirigir a "No autorizado"
    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to="/unauthorized" replace/>;
    }
    
    return children;
}

export { PrivateRoute };