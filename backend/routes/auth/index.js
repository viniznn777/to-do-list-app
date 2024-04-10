const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const generateToken = require("../../utils/generateToken");
const verifyToken = require("../../middlewares/verifyToken");
const sanitizeFields = require("../../utils/sanitizeFields");
const blackList = require("../../Security/blackList");
const checkTokenValidity = require("../../middlewares/checkBlackList");

// Rota para registro de uma conta no Banco de Dados.
router.post("/register", async (req, res) => {
  const { email, password, fname } = req.body;

  // Sanitizar os campos para remover caracteres especiais ( Proteção contra injeção de código ou XSS (Cross-Site-Scripting) )
  const sanitizedFields = sanitizeFields([email, password, fname]);

  try {
    const existingUser = await User.findOne({ email: sanitizedFields[0] });

    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use!" });
    }

    // Senha criptografada para salvar no Banco de Dados
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(sanitizedFields[1], salt);

    const newUser = new User({
      fname: sanitizedFields[2],
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    return res.status(201).json({
      message: "User created successfully!",
      userCreatedAt: user.date,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error in registration" });
  }
});

// Rota de login no app
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Sanitizar os campos para remover caracteres especiais ( Proteção contra injeção de código ou XSS (Cross-Site-Scripting) )
  const sanitizedFields = sanitizeFields([email, password]);

  try {
    User.findOne({ email: sanitizedFields[0] }).then((user) => {
      if (!user) {
        return res.status(400).json({ message: "Email not registered" });
      }

      bcrypt.compare(sanitizedFields[1], user.password, (err, isMatch) => {
        if (err) {
          return done(err);
        }

        // Se as senhas coincidem com a que está no banco de dados, será setado um cookie com a chave token, com o valor do token JWT gerado pela func generateToken. Também será setado outro cookie com o id do usuário para identificações no Front-end.
        if (isMatch) {
          const token = generateToken(user);
          res.cookie("token", token, {
            domain: "localhost",
            path: "/",
            httpOnly: true,
            secure: false,
          });

          res.cookie("id", user._id.toString(), {
            domain: "localhost",
            path: "/",
            httpOnly: true,
            secure: false,
          });

          console.log("Token cookie:", token);
          console.log("ID cookie:", user._id.toString());

          return res.status(200).json({ fname: user.fname });
        } else {
          return res.status(400).json({ message: "Invalid credentials!" });
        }
      });
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong when logging in!" });
  }
});

// Rota para verificar o status de autenticação
router.get("/checkAuthStatus", verifyToken, checkTokenValidity, (req, res) => {
  // Se chegou aqui, o token é válido
  res.status(200).json({ message: "Authenticated" });
});

// Rota de logou do usuário
router.post("/logout", (req, res) => {
  // Ao realizar o request de logout o servidor recebe o token JWT armazenado no cookie, ao receber, este token é adicionado a uma blackList que é um conjunto que armazena todos os token que foram expirados ou que já estão inválidos como o que recebemos no logout. Após adicionado a blackList, os cookies são limpos.
  const token = req.cookies.token;

  if (token) {
    blackList.add(token);
  }

  res.clearCookie("token");
  res.clearCookie("id");
  res.status(200).json({ message: "Logout successful" });
  console.log(blackList);
});

module.exports = router;
