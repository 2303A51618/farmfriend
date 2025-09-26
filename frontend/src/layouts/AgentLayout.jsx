// apps/frontend/src/layouts/AgentLayout.js
import React from "react";
import AgentSidebar from "../components/AgentSidebar";
import "./../pages/Agent/Agent.css";

/**
 * AgentLayout - wraps Agent pages and leaves sidebar space on left
 */
export default function AgentLayout({ children }) {
  return (
    <div className="agent-layout">
      <AgentSidebar />
      <main className="agent-main">{children}</main>
    </div>
  );
}
