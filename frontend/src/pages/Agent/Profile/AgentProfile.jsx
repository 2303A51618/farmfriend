// apps/frontend/src/pages/Agent/Profile/AgentProfile.jsx
import React, { useEffect, useState } from "react";
import API from "../../../api";
import { motion } from "framer-motion";
import { slideInLeft } from "../../Agent/animation";
import "../../../pages/Agent/Agent.css";

export default function AgentProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ fullName: "", phone: "", region: "" });
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/agents/profile");
      setProfile(data.user);
      setForm({ fullName: data.user.fullName || "", phone: data.user.phone || "", region: data.user.region || "" });
    } catch (err) {
      console.error("Error loading profile:", err);
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put("/agents/profile", form);
      alert("Profile updated");
      setProfile(data.user);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    }
  };

  if (loading) return <div className="panel">Loading profile...</div>;
  if (!profile) return <div className="panel">Profile not found</div>;

  return (
    <motion.div initial="hidden" animate="visible" variants={slideInLeft}>
      <div className="panel">
        <h2>My Profile</h2>
        <form onSubmit={handleSave} style={{ display: "grid", gap: 8 }}>
          <input className="input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Full name" required />
          <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" />
          <input className="input" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} placeholder="Region" />
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" type="submit">Save</button>
            <button type="button" className="btn secondary" onClick={() => fetchProfile()}>Reload</button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
