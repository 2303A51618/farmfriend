// apps/frontend/src/pages/Agent/Dashboard/AgentDashboard.jsx
import React, { useEffect, useState } from "react";
import API from "../../../api";
import { motion } from "framer-motion";
import { fadeInUp } from "../../Agent/animation";
import "../../../pages/Agent/Agent.css";

function SimpleBarChart({ dataObj, title }) {
  // dataObj: { label: number }
  const entries = Object.entries(dataObj || {});
  if (!entries.length) return <p className="small">No data</p>;
  const max = Math.max(...entries.map(([, v]) => v), 1);
  return (
    <div>
      <h4 style={{ marginBottom: 12 }}>{title}</h4>
      <div style={{ display: "flex", gap: 12, alignItems: "end" }}>
        {entries.map(([label, value]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{
              height: `${Math.round((value / max) * 120)}px`,
              width: 36,
              background: "#2563eb",
              borderRadius: 6,
              transition: "height .3s"
            }} />
            <div style={{ marginTop: 8, fontSize: 12 }}>{label}</div>
            <div style={{ fontSize: 12, color: "#374151" }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AgentDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    farmers: 0,
    products: 0,
    orders: 0,
    commissionEarned: 0,
    regionStats: {},
    monthlyStats: {}
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await API.get("/agents/dashboard");
        setStats({
          farmers: data.farmers || 0,
          products: data.products || 0,
          orders: data.orders || 0,
          commissionEarned: data.commissionEarned || 0,
          regionStats: data.regionStats || {},
          monthlyStats: data.monthlyStats || {}
        });
      } catch (err) {
        console.error("Agent dashboard error:", err);
        setError(err.response?.data?.message || err.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="panel">Loading dashboard...</div>;
  if (error) return <div className="panel">Error: {error}</div>;

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
      <div className="panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ margin: 0 }}>Agent Dashboard</h2>
          <div className="pill">Commission: ₹{Number(stats.commissionEarned).toFixed(2)}</div>
        </div>
        <div className="kpi-grid">
          <div className="panel kpi">
            <div className="value">{stats.orders}</div>
            <div className="label">Orders</div>
          </div>
          <div className="panel kpi">
            <div className="value">{stats.farmers}</div>
            <div className="label">Farmers</div>
          </div>
          <div className="panel kpi">
            <div className="value">{stats.products}</div>
            <div className="label">Products</div>
          </div>
          <div className="panel kpi">
            <div className="value">₹{Number(stats.commissionEarned).toFixed(2)}</div>
            <div className="label">Commission Earned</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="panel">
            <SimpleBarChart dataObj={stats.regionStats} title="Region-wise Qty (approx)" />
          </div>
          <div className="panel">
            <SimpleBarChart dataObj={stats.monthlyStats} title="Monthly Commissions" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
