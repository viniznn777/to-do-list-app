const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const verifyToken = require("../../middlewares/verifyToken");
const verifyUserId = require("../../middlewares/verifyUserId");
const checkTokenValidity = require("../../middlewares/checkBlackList");
const bcrypt = require("bcrypt");
const Task = require("../../models/Task");
const sanitizeFields = require("../../utils/sanitizeFields");

// Rota para retornar o email do usuário ( Usado para exibir no perfil o email usado ). Para acessar a rota, terá de passar pelos middleware de verificação.
router.get(
  "/email",
  verifyToken,
  checkTokenValidity,
  verifyUserId,
  async (req, res) => {
    try {
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(400).json({ message: "User not found!" });
      }

      res
        .status(200)
        .json({ message: "User found successfully!", data: user.email });
    } catch (err) {
      console.error("Error when searching for user:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

//Rota para mudar atualizar o email cadastrado
router.post(
  "/change/email",
  verifyToken,
  checkTokenValidity,
  verifyUserId,
  async (req, res) => {
    try {
      const { email } = req.body;

      // Sanitizar os campos para remover caracteres especiais ( Proteção contra injeção de código ou XSS (Cross-Site-Scripting) )
      const sanitizedFields = sanitizeFields([email]);

      const existingEmail = await User.findOne({ email: sanitizedFields[0] });

      if (existingEmail) {
        return res.status(409).json({ message: "Email is already in use!" });
      }

      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(400).json({ message: "User not found!" });
      }

      await User.findByIdAndUpdate(
        { _id: req.userId },
        { email: email },
        { new: true }
      );

      res.status(200).json({ message: "Email updated successfully!" });
    } catch (err) {
      console.error("Error updating user email:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Rota para deletar a conta do banco de dados. Para tomar esta ação, o request deverá passar pelos middlewares e o usuário deverá confirmar sua senha para a exclusão da conta.
router.post(
  "/delete_acc",
  verifyToken,
  checkTokenValidity,
  verifyUserId,
  async (req, res) => {
    try {
      const { password } = req.body;

      // Sanitizar os campos para remover caracteres especiais ( Proteção contra injeção de código ou XSS (Cross-Site-Scripting) )
      const sanitizedFields = sanitizeFields([password]);

      const user = await User.findOne({ _id: req.userId });

      if (!user) {
        return res
          .status(404)
          .json({ message: "Unable to find your account in the database!" });
      }

      const validPassword = await bcrypt.compare(
        sanitizedFields[0],
        user.password
      );

      if (!validPassword) {
        return res.status(400).json({ message: "Incorrect password" });
      }

      const deleteUser = await User.deleteOne({ _id: req.userId });

      if (deleteUser) {
        await Task.deleteMany({ userId: req.userId });
      }

      return res.status(200).json({ message: "User deleted" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal error" });
    }
  }
);

// Rota de redefinição de senha dentro do app
router.post(
  "/redefine_password",
  verifyToken,
  checkTokenValidity,
  verifyUserId,
  async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;

      // Sanitizar os campos para remover caracteres especiais ( Proteção contra injeção de código ou XSS (Cross-Site-Scripting) )
      const sanitizedFields = sanitizeFields([oldPassword, newPassword]);

      const user = await User.findOne({ _id: req.userId });

      if (!user) {
        return res
          .status(404)
          .json({ message: "Unable to find your account in the database!" });
      }

      const isValidPassword = await bcrypt.compare(
        sanitizedFields[0],
        user.password
      );

      if (!isValidPassword) {
        return res.status(400).json({ message: "Incorrect Password!" });
      }

      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(sanitizedFields[1], salt);

      await User.findOneAndUpdate(
        { _id: req.userId },
        { password: hashedPassword },
        { new: true }
      );

      res
        .status(200)
        .json({ message: "Your password has been changed successfully!" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal error" });
    }
  }
);

module.exports = router;
