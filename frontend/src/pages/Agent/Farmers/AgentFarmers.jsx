// apps/frontend/src/pages/Agent/Farmers/AgentFarmers.jsx
import React, { useEffect, useState } from "react";
import API from "../../../api";
import { motion } from "framer-motion";
import { slideInLeft } from "../../Agent/animation";
import "../../../pages/Agent/Agent.css";

export default function AgentFarmers() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [error, setError] = useState(null);

  const fetchFarmers = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/agents/farmers");
      setFarmers(data);
    } catch (err) {
      console.error("Error fetching farmers:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post("/agents/farmers", form);
      setForm({ fullName: "", email: "", phone: "", password: "" });
      setShowAdd(false);
      fetchFarmers();
      alert("Farmer created ✅");
    } catch (err) {
      console.error("Create farmer error:", err);
      alert(err.response?.data?.message || "Failed to create farmer");
    }
  };

  const handleVerify = async (farmerId, verify = true) => {
    if (!window.confirm(`${verify ? "Verify" : "Unverify"} this farmer?`)) return;
    try {
      await API.put("/agents/farmers/verify", { farmerId, verify });
      fetchFarmers();
    } catch (err) {
      console.error("Verify farmer error:", err);
      alert("Failed to update farmer");
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={slideInLeft}>
      <div className="panel">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <h2 style={{ margin: 0 }}>My Farmers</h2>
          <div>
            <button className="btn" onClick={() => setShowAdd((s) => !s)}>{showAdd ? "Close" : "Add Farmer"}</button>
          </div>
        </div>

        {showAdd && (
          <form className="panel" onSubmit={handleAdd} style={{ marginBottom: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <input className="input" value={form.fullName} placeholder="Full name" onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
              <input className="input" value={form.email} placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <input className="input" value={form.phone} placeholder="Phone" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input className="input" value={form.password} placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div style={{ marginTop: 10 }}>
              <button className="btn" type="submit">Create Farmer</button>
            </div>
          </form>
        )}

        <div className="table">
          {loading ? <p>Loading farmers...</p> : (
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Phone</th><th>Verified</th><th>Action</th></tr>
              </thead>
              <tbody>
                {farmers.length === 0 ? (
                  <tr><td colSpan={5}>No farmers assigned yet.</td></tr>
                ) : farmers.map(f => (
                  <tr key={f._id}>
                    <td>{f.fullName || f.name || "—"}</td>
                    <td>{f.email || "—"}</td>
                    <td>{f.phone || "—"}</td>
                    <td>{f.verified ? <span className="tag-approved">Verified</span> : <span className="tag-pending">Pending</span>}</td>
                    <td>
                      <button className="btn secondary" onClick={() => handleVerify(f._id, !f.verified)}>{f.verified ? "Unverify" : "Verify"}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </motion.div>
  );
}
