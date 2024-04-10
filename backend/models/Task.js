const mongoose = require("mongoose");

// Modelo de armazenamento de uma task no banco de dados.

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Referência ao modelo User // Ao Criar uma task, será adicionado o id do usuário que criou.
    required: true,
  },
});

module.exports = mongoose.model("Task", taskSchema);
