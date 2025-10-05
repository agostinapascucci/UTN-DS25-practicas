import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../helpers/auth";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from "../validations/loginSchema";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
   const navigate = useNavigate();
   const { login } = useAuth(); // Usar el contexto de autenticación
   const [ serverError, setServerError ] = useState(null);

   const { 
    register, 
    handleSubmit: handleFormSubmit, 
    formState: { errors, isSubmitting },
    setError } = useForm({
    resolver: yupResolver(loginSchema)
   });

   const onSubmit = async (data) => {
    setServerError(""); // Limpiar errores previos

    // Context login
    const result = await login(data.email, data.password);
    if (result.success) {
      navigate("/inicio");
    }
    else {
      setServerError(result.message);
    }
  };


  return (
  
      <div className="container py-5 login-page">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-6 col-lg-4">
            <form onSubmit={handleFormSubmit(onSubmit)} className="card p-4 shadow-sm">
              <h2 className="mb-3">Login</h2>
              {serverError && <div className="alert alert-danger" role="alert">{serverError}</div>}
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input 
                  className="form-control"
                  {...register('email')}
                  placeholder="tuemail@gmail.com"
                  
                />
                {errors.email && <span className="text-danger">{errors.email.message}</span>}
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                  <input
                    className="form-control"
                    {...register('password')}
                    type="password"
                    placeholder="••••••••"
                  />
                  {errors.password && <span className="text-danger">{errors.password.message}</span>}  
              </div>

              <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Ingresando..." : "Ingresar"}
              </button>
            </form>
            {errors.root && <div className="alert alert-danger mt-3" role="alert">{errors.root.message}</div>}
          </div>
        </div>
      </div>
  );
}