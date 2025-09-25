import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./../pages/Agent/Agent.css";

const AgentLayout = () => {
  return (
    <div className="agent-layout">
      {/* Sidebar */}
      <aside className="agent-sidebar">
        <h2 className="sidebar-title">Agent Panel</h2>
        <nav>
          <ul>
            <li><Link to="/agent/dashboard">Dashboard</Link></li>
            <li><Link to="/agent/farmers">Farmers</Link></li>
            <li><Link to="/agent/orders">Orders</Link></li>
            <li><Link to="/agent/products">Products</Link></li>
            <li><Link to="/agent/payments">Payments</Link></li>
            <li><Link to="/agent/profile">Profile</Link></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="agent-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AgentLayout;
