import React from "react";
import { motion } from "framer-motion";
import { slideInLeft } from "../animations";
import "./AgentProfile.css";

const AgentProfile = () => {
  const profile = { name: "Agent Vasu", email: "agent@farmfriend.com", phone: "9876543210" };

  return (
    <motion.div className="profile-container" initial="hidden" animate="visible" variants={slideInLeft}>
      <h2>Profile</h2>
      <div className="profile-card">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Phone:</strong> {profile.phone}</p>
      </div>
    </motion.div>
  );
};

export default AgentProfile;
