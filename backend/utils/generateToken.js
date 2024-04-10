const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  // Definindo a expiração do token (1 hora)
  const expiresIn = "1h";

  // Criado o token com o payload, a chave secreta e o tempo de expiração
  return jwt.sign(
    { _id: user._id },
    // Secret Key
    "e9f6ffeceb68d556ecba3ec3b828d560db40ca10c2eb74e74d7f6c64d12a54c5",
    { expiresIn }
  );
};

module.exports = generateToken;
