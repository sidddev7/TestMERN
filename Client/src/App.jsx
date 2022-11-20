import { useState } from "react";
import { Tabs } from "antd";
import "./App.css";
import "antd/dist/reset.css";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./containers/components/home";
import { Outlet } from "react-router-dom";
function App() {
  return (
    <Routes>
      <Route
        path="*"
        element={
          <>
            <Home />
            <Outlet />
          </>
        }
      ></Route>
    </Routes>
  );
}

export default App;
