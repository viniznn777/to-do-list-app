import React, { useEffect } from "react";
import { createContext, useState } from "react";
import { AUTH_URL } from "../api/basesURL";
import { useNavigate } from "react-router-dom";
import {
  alertMessage,
  errorMessage,
  infoMessage,
  successMessage,
} from "../utils/toastifyMessages";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [fname, setFname] = useState("");

  // Effect que irá fazer a busca do nome de usuário no local storage e setará o valor para um State
  useEffect(() => {
    if (!fname) {
      const username = JSON.parse(localStorage.getItem("fname"));
      setFname(username);
    }
  }, [fname]);

  // Effect que irá fazer uma consulta para verificar o status de autenticação do usuário, e setará para um estado. Este estado será usado para verificar se o usuário está autenticado e proibir que ele acesse a pagina de login ou register após autenticado.
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await AUTH_URL.get("/checkAuthStatus", {
          withCredentials: true,
        });

        if (response.status === 200) {
          setIsAuthenticated(true);
        } else if (response.status === 401) {
          throw new Error("Você ainda não está Autenticado!");
        }
      } catch (err) {
        setIsAuthenticated(false);
        console.error("Erro ao verificar autenticação", err);
      }
    };

    checkAuthStatus();
  }, [isAuthenticated]);

  // Função para realizar o registro do usuário no front-end, enviando os dados inseridos para o servidor.
  const register = async (
    event,
    setFname,
    setEmail,
    setPassword,
    setPassword2,
    fname,
    email,
    password,
    password2
  ) => {
    event.preventDefault();

    try {
      // Os dados serão sanitizados no servidor, para evitar injeções de código ou XSS
      if (!email || !password || !password2 || !fname) {
        alertMessage("Todos os campos devem ser preenchidos!");
        return;
      } else if (password !== password2) {
        alertMessage("As senhas não correspondem!");
        return;
      }

      const body = {
        fname,
        email,
        password,
      };

      const response = await AUTH_URL.post("/register", body, {
        withCredentials: true,
        credentials: "include",
      });

      // Ao realizar o registro com sucesso, será redirecionado para página de login.
      if (response.status === 201) {
        setFname("");
        setEmail("");
        setPassword("");
        setPassword2("");
        successMessage("Usuário criado com sucesso!");
        navigate("/login");
      } else if (response.status === 400) {
        errorMessage("Email indisponível!");
        return;
      }
    } catch (err) {
      errorMessage("Não foi possível criar usuário. Tente Novamente!");
      infoMessage(
        "Se o problema persistir, aguarde alguns instantes para criar novamente!",
        10000
      );
      console.log("Não foi possível criar usuário: ", err);
    }
  };

  // Função para realizar o login do usuário no front-end, enviando os dados inseridos para o servidor.
  const login = async (event, email, password) => {
    event.preventDefault();
    try {
      // Os dados serão sanitizados no servidor, para evitar injeções de código ou XSS
      if (!email || !password) {
        alertMessage("Todos os campos devem ser preenchidos!");
        return;
      }

      const body = { email, password };

      const response = await AUTH_URL.post("/login", body, {
        withCredentials: true,
      });

      // Após o login bem sucedido o usuário será redirecionado para a pagina home do app, que é protegida para que somente usuários autenticados consiga acessar.
      if (response.status === 200) {
        setIsAuthenticated(true);
        setFname(response.data.fname);
        localStorage.setItem("fname", JSON.stringify(response.data.fname));
        navigate("/");
        successMessage("Sucesso ao entrar!");
        console.clear();
        // Informando o usuário que caso haja alguma alteração não autorizada no console, será feito o logout do usuário.
        console.log(
          "%c Atenção! Caso haja alguma alteração não autorizada neste painel (DevTools), por segurança será feito o logout do usuário!",
          "background: rgba(248, 236, 26, 0.51); color: #fff; padding: 15px; font-weight: bold;"
        );
      } else if (response.status === 400) {
        errorMessage("Email ou senha incorretos!");
        return;
      }
    } catch (err) {
      errorMessage("Não foi possível fazer o login. Tente Novamente!");
      infoMessage(
        "Se o problema persistir, aguarde alguns instantes para fazer o login novamente!",
        10000
      );
      console.log("Não foi possível realizar o login: ", err);
    }
  };

  // Função que realiza o logout do usuário
  const logout = async () => {
    const cookiePath = "/";

    try {
      // Envia as credenciais como cookies para o servidor, que após realizar o logout, o token de autenticação é invalidado para que não seja colocado um token JWT válido mas já vencido.
      const response = await AUTH_URL.post("/logout", null, {
        withCredentials: true,
        credentials: "include",
      });
      if (response.status === 200) {
        // Limpa os cookies do navegador
        document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath};`;
        document.cookie = `id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath};`;
        localStorage.removeItem("fname");
        // Seta isAutheticated como false para que desautentique o usuário e leve-o para a página de login
        setIsAuthenticated(false);
        navigate("/login");
      } else {
        console.error(
          "Houve um erro ao realizar o logout",
          response.statusText
        );
      }
    } catch (err) {
      console.error("Erro durante o logout", err);
    }
  };

  // Evento que verifica as chaves e valores do storage do navegador. Caso haja alguma alteração não autorizada, será feito o logout do usuário para segurança da conta.
  window.addEventListener("storage", (e) => {
    if (e.key === "fname" && e.newValue !== fname) {
      // Verifica se o novo valor é diferente do valor atual de fname
      logout();
      // Informando o usuário sobre o motivo do logout
      console.info(
        "%c Parece que houve uma alteração não autorizada no (Armazenamento Local). Para a sua segurança fizemos o logout da sua conta. Faça login novamente para acessá-la.",
        "background: rgba(253, 20, 20, 0.8); color: #fff; padding: 15px; font-weight: bold;"
      );
    }
  });

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, register, logout, fname }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
