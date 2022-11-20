import { Button, Input } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import { login } from "../actions/users";
import "../componentStyle.css";
import Authenticated from "./authenticated";
export default function Home() {
  const [authState, setauthState] = useState(null);
  const [data, setdata] = useState({
    email: "",
    password: "",
  });
  const token = sessionStorage.getItem("token");
  useEffect(() => {
    if (token) {
      setauthState(true);
    }
  }, []);
  const handleLogin = async () => {
    const result = await login(data);
    if (result.status) {
      setauthState(true);
      sessionStorage.setItem("token", result.data.token);
    }
  };
  return authState ? (
    <Authenticated setauthState={setauthState} />
  ) : (
    <>
      <div className="container">
        <h3>Login</h3>
        <Input
          className="inputs"
          onChange={(e) => setdata({ ...data, email: e.target.value })}
        ></Input>
        <Input.Password
          className="inputs"
          onChange={(e) => setdata({ ...data, password: e.target.value })}
        ></Input.Password>
      </div>
      <Button onClick={handleLogin}>Login</Button>
    </>
  );
}
