require("dotenv").config();
const express = require("express");
const app = express();
const todoRoutes = require("./routes/tododb.js"); // <-- Pastikan ini mengarah ke tododb.js
const cors = require("cors");
const port = process.env.PORT;
const db = require("./database/db");

// Middleware
const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);
app.use(cors());
app.use(express.json());
app.set("view engine", "ejs");

// Gunakan tododb.js untuk semua rute di bawah /api/todos
app.use("/api/todos", todoRoutes);

// Rute untuk server-side rendering (jika masih dipakai)
app.get("/", (req, res) => {
  res.render("index", { layout: "layouts/layout" });
});

app.get("/contact", (req, res) => {
  res.render("contact", { layout: "layouts/main-layout" });
});

app.get("/todo-view", (req, res) => {
  db.query("SELECT * FROM todos", (err, todos) => {
    if (err) return res.status(500).send("Internal Server Error");
    res.render("todo", { todos: todos, layout: "layouts/main-layout" });
  });
});

// Handler untuk 404 - Diletakkan di akhir
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});