// GPLogin.jsx
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

export default function Gplogin2() {
  const [data, setData] = useState({ gp_email: "", gp_password: "" });
  const nav = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const login = async (e) => {
    e.preventDefault();

    const res = await axios.post(
      "API_URL/api/gp/login",
      data
    );

    localStorage.setItem("token", res.data.token);
    nav("API_URL/dashboard");
  };

  return (
    <form onSubmit={login}>
      <input name="gp_email" onChange={handleChange} placeholder="Email" />
      <input name="gp_password" type="password" onChange={handleChange} />
      <button>Login</button>
    </form>
  );
}