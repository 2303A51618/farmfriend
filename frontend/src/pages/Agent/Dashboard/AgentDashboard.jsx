// frontend/src/pages/Agent/Dashboard/AgentDashboard.jsx
import React, { useEffect, useState } from "react";
import API from "../../../api";
import AgentSidebar from "../../../components/AgentSidebar";
import { motion } from "framer-motion";
import { fadeInUp } from "../animation.js";

const AgentDashboard = () => {
  const [stats, setStats] = useState({
    farmers: 0,
    crops: 0,
    orders: 0,
    earnings: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get("/agents/stats");
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch agent stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex">
      <AgentSidebar />
      <motion.div
        className="ml-[200px] p-6 w-full"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <h1 className="text-2xl font-bold mb-6">Agent Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-md">👨‍🌾 Farmers: {stats.farmers}</div>
          <div className="bg-white p-6 rounded-xl shadow-md">🌾 Crops: {stats.crops}</div>
          <div className="bg-white p-6 rounded-xl shadow-md">📦 Orders: {stats.orders}</div>
          <div className="bg-white p-6 rounded-xl shadow-md">💰 Earnings: ₹{stats.earnings}</div>
        </div>
      </motion.div>
    </div>
  );
};

export default AgentDashboard;
