const jwt = require("jsonwebtoken");
const blackList = require("../Security/blackList");

const isTokenExpired = (token) => {
  const decodedToken = jwt.decode(token);
  return Date.now() >= decodedToken.exp * 1000;
};

// Este é um middleware para verificar a VALIDADE do Token JWT, como: Verificar se ele está na BLACKLIST (Onde todos os tokens expirados ou que não são mais válidos estão) ou se o token já foi revogado.

const checkTokenValidity = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (blackList.has(token)) {
    return res.status(401).json({ message: "Token revoked" });
  }

  if (isTokenExpired(token)) {
    blackList.add(token);
    return res.status(401).json({ message: "Token expired" });
  }

  next();
};

module.exports = checkTokenValidity;
