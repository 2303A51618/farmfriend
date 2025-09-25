import React from "react";
import { motion } from "framer-motion";
import { slideInLeft } from "../animation.js";
import "./AgentFarmers.css";

const AgentFarmers = () => {
  const farmers = [
    { id: 1, name: "Raju", location: "Warangal" },
    { id: 2, name: "Sita", location: "Mulugu" },
  ];

  return (
    <motion.div
      className="farmers-container"
      initial="hidden"
      animate="visible"
      variants={slideInLeft}
    >
      <h2>Farmers</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {farmers.map(f => (
            <tr key={f.id}>
              <td>{f.name}</td>
              <td>{f.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default AgentFarmers;
