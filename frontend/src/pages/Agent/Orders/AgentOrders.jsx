import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "../animation.js";
import "./AgentOrders.css";

const AgentOrders = () => {
  const orders = [
    { id: 101, product: "Wheat", quantity: "50kg", status: "Pending" },
    { id: 102, product: "Rice", quantity: "30kg", status: "Delivered" },
  ];

  return (
    <motion.div className="orders-container" initial="hidden" animate="visible" variants={fadeInUp}>
      <h2>Orders</h2>
      <ul>
        {orders.map(o => (
          <li key={o.id}>
            <strong>{o.product}</strong> - {o.quantity} ({o.status})
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default AgentOrders;
