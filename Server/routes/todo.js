import express from "express";
import {
  addTodo,
  deleteTodo,
  getAllTodos,
  getUsersTodoList,
  updateTodo,
} from "../controllers/todo.js";
import { AuthVerifyAdminUser } from "../middleware/auth.js";
const todo = express.Router();

todo.get("/", getUsersTodoList);
todo.post("/", addTodo);
todo.delete("/:id", deleteTodo);
todo.put("/:id", updateTodo);
todo.get(
  "/all",
  (req, res, next) => AuthVerifyAdminUser(req, res, next, true),
  getAllTodos
);

export default todo;
