import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "../animation.js";
import "./AgentPayments.css";

const AgentPayments = () => {
  const [status, setStatus] = useState("");

  const handlePayment = () => {
    setStatus("✅ Payment Successful! (Dummy)");
  };

  return (
    <motion.div className="payments-container" initial="hidden" animate="visible" variants={fadeInUp}>
      <h2>Payments</h2>
      <div className="payment-card">
        <p>Amount: ₹500</p>
        <button onClick={handlePayment}>Pay Now</button>
        {status && <p className="success-msg">{status}</p>}
      </div>
    </motion.div>
  );
};

export default AgentPayments;
