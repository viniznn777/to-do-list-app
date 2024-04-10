import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Proteção das rotas privadas
function PrivateRoute({ item }) {
  const { isAuthenticated } = useAuth();

  // Verifica se o usuário está autenticado, caso esteja será redirecionado para a página de destino. Caso não esteja, será redirecionado para a página de login.
  return isAuthenticated ? item : <Navigate to="/login" />;
}

export { PrivateRoute };
