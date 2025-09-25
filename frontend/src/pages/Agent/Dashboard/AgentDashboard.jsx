import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "../animation.js";
import "./AgentDashboard.css";

const AgentDashboard = () => {
  return (
    <motion.div
      className="dashboard-container"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      <h1>Agent Dashboard</h1>
      <div className="dashboard-cards">
        <div className="card">📊 Orders: 120</div>
        <div className="card">👨‍🌾 Farmers: 40</div>
        <div className="card">🛒 Products: 85</div>
        <div className="card">💰 Payments: ₹1,20,000</div>
      </div>
    </motion.div>
  );
};

export default AgentDashboard;
