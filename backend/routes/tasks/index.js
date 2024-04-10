const express = require("express");
const router = express.Router();
const Task = require("../../models/Task");
const User = require("../../models/User");

// Middlewares
const verifyToken = require("../../middlewares/verifyToken");
const verifyUserId = require("../../middlewares/verifyUserId");
const sanitizeFields = require("../../utils/sanitizeFields");
const checkTokenValidity = require("../../middlewares/checkBlackList");

// Rota que retorna todas as tasks do usuário para a página Home do app
router.get(
  "/my_tasks",
  verifyToken,
  checkTokenValidity,
  verifyUserId,
  async (req, res) => {
    try {
      const tasks = await Task.find({ userId: req.userId });

      if (tasks.length === 0) {
        return res.status(204).send();
      }

      res.status(200).json({ message: "User tasks", data: tasks });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error when fetching user tasks" });
    }
  }
);

// Rota para criar uma nova task
router.post(
  "/new_task",
  verifyToken,
  checkTokenValidity,
  verifyUserId,
  async (req, res) => {
    const { title, task } = req.body;
    const userId = req.userId;

    // Sanitizar os campos para remover caracteres especiais ( Proteção contra injeção de código ou XSS (Cross-Site-Scripting) )
    const sanitizedFields = sanitizeFields([title, task]);

    try {
      const newTask = new Task({
        title: sanitizedFields[0],
        task: sanitizedFields[1],
        userId: userId,
      });

      const addedTask = await newTask.save();

      res.status(200).json({ addedTask });
    } catch (err) {
      console.error("Error adding task:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Rota para acessar os detalhes de uma task
router.get(
  "/task/:id",
  verifyToken,
  checkTokenValidity,
  verifyUserId,
  async (req, res) => {
    const { id } = req.params;

    try {
      const task = await Task.findById({ _id: id });

      if (!task) {
        return res
          .status(400)
          .json({ message: "No task was found with this id." });
      }

      res.status(200).json(task);
    } catch (err) {
      console.error("Error searching for task!:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Rota para edição de uma determinada task
router.post(
  "/edit_task/:id",
  verifyToken,
  checkTokenValidity,
  verifyUserId,
  async (req, res) => {
    const { title, task } = req.body;
    const { id } = req.params;

    // Sanitizar os campos para remover caracteres especiais ( Proteção contra injeção de código ou XSS (Cross-Site-Scripting) )
    const sanitizedFields = sanitizeFields([title, task]);

    try {
      const newTask = { title: sanitizedFields[0], task: sanitizedFields[1] };

      const findTask = await Task.findById({ _id: id });

      if (!findTask) {
        return res
          .status(400)
          .json({ message: "No task was found with this id." });
      }

      await Task.findByIdAndUpdate({ _id: id }, newTask, { new: true });

      return res
        .status(200)
        .json({ message: "Task edited successfully!", task: newTask });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Rota para pesquisar uma task pelo nome. Rota é acessada na barra de pesquisa ao digitar.
router.get(
  "/tasks/search",
  verifyToken,
  checkTokenValidity,
  verifyUserId,
  async (req, res) => {
    const searchText = req.query.searchText;

    try {
      // Buscar tarefas que contenham o texto de pesquisa no título
      const tasks = await Task.find({
        title: { $regex: searchText, $options: "i" },
        userId: req.userId,
      });

      res.json(tasks);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Rota para deletar uma task. Utilizamos o ID para identificação da task
router.delete(
  "/del/:id",
  verifyToken,
  checkTokenValidity,
  verifyUserId,
  async (req, res) => {
    const { id } = req.params;

    try {
      const task = await Task.findByIdAndDelete({ _id: id });

      if (!task) {
        return res.status(400).json({ message: "Unable to find this task!" });
      }

      res
        .status(200)
        .json({ message: "Task removed successfully!", taskDeleted: task });
    } catch (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;
