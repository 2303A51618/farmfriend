// apps/frontend/src/pages/Agent/Payments/AgentPayments.jsx
import React, { useEffect, useState } from "react";
import API from "../../../api";
import { motion } from "framer-motion";
import { fadeInUp } from "../../Agent/animation";
import "../../../pages/Agent/Agent.css";

export default function AgentPayments() {
  const [commission, setCommission] = useState(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await API.get("/agents/dashboard");
        setCommission(data.commissionEarned || 0);
      } catch (err) {
        console.error("Error fetching commission:", err);
        setCommission(0);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handlePayout = async () => {
    if (!window.confirm(`Payout ₹${commission.toFixed(2)} to your linked account?`)) return;
    // Dummy: no backend endpoint right now - we simulate
    setStatus("Processing payout...");
    setTimeout(() => {
      setStatus("✅ Payout simulated (dummy). Please implement real payout gateway.");
    }, 1200);
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
      <div className="panel">
        <h2>Payments & Commissions</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>₹{Number(commission).toFixed(2)}</div>
              <div className="small">Total commission available</div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn" onClick={handlePayout}>Request Payout</button>
              <button className="btn secondary" onClick={() => setStatus("")}>Clear</button>
            </div>

            {status && <div style={{ marginTop: 12 }}>{status}</div>}
            <p style={{ marginTop: 12 }} className="small">Note: Payout currently simulated. Integrate payment gateway for real transfers.</p>
          </>
        )}
      </div>
    </motion.div>
  );
}
