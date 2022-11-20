import Mongoose from "mongoose";
import Todo from "../schema/todo.js";

export const addTodo = async (req, res) => {
  try {
    const { name, status } = req.body;
    const newTodo = new Todo({
      name,
      status,
      user: res.locals.id,
    });
    const saveResult = await newTodo.save();
    if (saveResult) {
      res.status(200).json({ message: "Todo saved Successfully" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUsersTodoList = async (req, res) => {
  try {
    const { limit, page, status } = req.query;
    const count = await Todo.countDocuments({ user: res.locals.id });
    const todos = await Todo.find({ user: res.locals.id, status: status })
      .limit(parseInt(limit))
      .skip(parseInt(limit) * (parseInt(page) - 1))
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
    if (todos) {
      res.status(200).json({ todos, count });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const result = await Todo.findByIdAndDelete(id);
    if (result) {
      return res.status(200).json({ message: "Todo Deleted successfully" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;
    const result = await Todo.findByIdAndUpdate(
      id,
      { name, status, id: res.locals.id },
      { new: true }
    );
    if (result) {
      res.status(200).json({ message: "Todo updated successfully" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllTodos = async (req, res) => {
  try {
    const { status } = req.query;
    console.log(status);
    const count = await Todo.countDocuments();
    const todos = await Todo.find({ status: status }).populate({
      path: "user",
      select: { password: 0 },
    });
    if (todos) {
      res.status(200).json({ todos, count });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
