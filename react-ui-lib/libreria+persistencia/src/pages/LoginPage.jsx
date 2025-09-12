import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { setToken, getToken } from "../helpers/auth";
import '../styles/login.css'

export default function LoginPage() {
   const navigate = useNavigate();


   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [submitting, setSubmitting] = useState(null);
   const [error, setError] = useState(null);
   
   useEffect(() => {
    // Si hay token, no mostrar el Login
    if (getToken()) navigate("/");
   }, []);

   async function handleSubmit(e) {
       e.preventDefault();
       setSubmitting(true);
       setError(null);
       try {
           const res = await fetch("http://localhost:3000/api/auth/login" , {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ email, password })
           });

           if (!res.ok) throw new Error("Error en login");

           const { data } = await res.json();
           setToken(data.token);
           navigate(from, { replace: true });
       } catch (err) {
           setError(err?.message || "Login Fallido");
       } finally {
        setSubmitting(false);
       }
   }
  return (
    <div className="container py-5 login-page">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-6 col-lg-4">
          <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
            <h2 className="mb-3">Login</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tuemail@gmail.com"
                autoComplete="username"
                required
                type="email"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                className="form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            <button className="btn btn-primary w-100" type="submit" disabled={submitting}>
              {submitting ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}