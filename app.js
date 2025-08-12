require("dotenv").config();
const express = require("express");
const app = express();
const todoRoutes = require("./routes/tododb.js");
const cors = require("cors");
const port = process.env.PORT;
const { todos } = require("./routes/todo.js");
const db = require("./database/db");

app.use(cors());
app.use(express.json());
app.set("view engine", "ejs");

app.use("/todos", todoRoutes);

app.get("/todos-data", (req, res) => {
  res.json(todos);
});

app.get("/todos-list", (req, res) => {
  res.render("todos-page", { todos: todos });
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/todo-view", (req, res) => {
  db.query("SELECT * FROM todos", (err, todos) => {
    if (err) return res.status(500).send("Internal Server Error");
    res.render("todo", {
      todos: todos,
    });
  });
});

app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});