import React from "react";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import AllTodos from "./allTodos";
import Todo from "./todo";
import Users from "./users";
export default function CustomRoutes(props) {
  return (
    <Routes>
      <Route path="/users" element={<Users {...props} />} />
      <Route path="/todo" element={<Todo {...props} />} />
      <Route path="/all-todos" element={<AllTodos {...props} />} />
    </Routes>
  );
}
