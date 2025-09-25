// apps/frontend/src/components/AgentSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import "./AgentSidebar.css";

function AgentSidebar() {
  return (
    <div className="agent-sidebar">
      <h2 className="sidebar-title">Agent Panel</h2>
      <ul>
        <li>
          <NavLink
            to="/agent/dashboard"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            📊 Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/agent/farmers"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            👨‍🌾 Farmers
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/agent/orders"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            📦 Orders
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default AgentSidebar;
