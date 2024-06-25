import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    // alert("Usuario no encontrado, redireccionando a la pagina de inicio.");
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(user.role)) {
    // alert("Usuario no permitido, redireccionando a la pagina de inicio.");
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
