import axios from "axios";

// https://to-do-list-app-zl5u.onrender.com

export const AUTH_URL = axios.create({
  baseURL: "https://to-do-list-app-zl5u.onrender.com/api/auth",
  // Como default o axios só vem configurado para tratar status de maior que 200 e até 300
  // Então foi definido para tratamentos de status NESTA ROTA de até 404
  validateStatus: function (status) {
    return status >= 200 && status <= 404;
  },
});
export const MANAGE_TASK = axios.create({
  baseURL: "https://to-do-list-app-zl5u.onrender.com/manage",
  // Como default o axios só vem configurado para tratar status de maior que 200 e até 300
  // Então foi definido para tratamentos de status NESTA ROTA de até 404
  validateStatus: function (status) {
    return status >= 200 && status <= 404;
  },
});
export const MANAGE_USER = axios.create({
  baseURL: "https://to-do-list-app-zl5u.onrender.com/user/private_info",
  // Como default o axios só vem configurado para tratar status de maior que 200 e até 300
  // Então foi definido para tratamentos de status NESTA ROTA de até 404
  validateStatus: function (status) {
    return status >= 200 && status <= 409;
  },
});
