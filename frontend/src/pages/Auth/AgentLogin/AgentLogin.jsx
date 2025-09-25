// apps/frontend/src/pages/Auth/AgentLogin/AgentLogin.jsx

import React, { useState } from "react";
import API from "../../../api"; // ✅ axios instance with baseURL
import { useNavigate } from "react-router-dom";
import "../Auth.css"; // ✅ common CSS

function AgentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ call backend /api/agents/login
      const res = await API.post("/agents/login", { email, password });

      // ✅ assuming backend returns { token, user }
      const { token, user } = res.data;
      console.log("Agent Login Response:", res.data);

      // ✅ store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", "agent");

      alert(`✅ Welcome back, ${user.fullName || "Agent"}!`);

      // ✅ redirect to Agent Dashboard
      navigate("/agent/dashboard");
    } catch (err) {
      console.error("Agent Login Error:", err.response?.data || err.message);
      alert("❌ Login failed: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="auth-container">
      <h2>Agent Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default AgentLogin;
