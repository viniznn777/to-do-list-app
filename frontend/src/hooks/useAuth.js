import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

// Hook do AuthContext
export const useAuth = () => {
  // Usa o os valores de AuthContext e atribui a variável context que é retornada na função.
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usando dentro de um AuthProvider");
  }
  return context;
};
