// apps/frontend/src/pages/Agent/Orders/AgentOrders.jsx
import React, { useEffect, useState } from "react";
import API from "../../../api";
import { motion } from "framer-motion";
import { fadeInUp } from "../../Agent/animation";
import "../../../pages/Agent/Agent.css";

export default function AgentOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/agents/orders");
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching agent orders:", err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    if (!window.confirm(`Set order ${id} status to ${status}?`)) return;
    try {
      await API.put(`/agents/orders/${id}/status`, { status });
      fetchOrders();
      alert("Order status updated");
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update order status");
    }
  };

  const approveOrder = async (id, approve = true) => {
    if (!window.confirm(`${approve ? "Approve" : "Reject"} order ${id}?`)) return;
    try {
      await API.put(`/agents/orders/${id}/approve`, { approve });
      fetchOrders();
      alert("Order approval updated");
    } catch (err) {
      console.error("Error approving order:", err);
      alert("Failed to update order approval");
    }
  };

  if (loading) return <div className="panel">Loading orders...</div>;

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
      <div className="panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Orders</h2>
        </div>

        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Order Id</th>
                <th>Product</th>
                <th>Farmer</th>
                <th>Buyer</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Status</th>
                <th>Approved</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={9}>No orders</td></tr>
              ) : orders.map(o => (
                <tr key={o._id}>
                  <td>{o._id}</td>
                  <td>{o.product?.name || "—"}</td>
                  <td>{o.farmer?.fullName || o.farmer?.name || "—"}</td>
                  <td>{o.buyer?.fullName || o.buyer?.email || "—"}</td>
                  <td>{o.quantity}</td>
                  <td>₹{o.price}</td>
                  <td><span className="pill">{o.status}</span></td>
                  <td>{o.approved ? <span className="tag-approved">Yes</span> : <span className="tag-pending">No</span>}</td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <button className="btn secondary" onClick={() => approveOrder(o._id, !o.approved)}>{o.approved ? "Unapprove" : "Approve"}</button>
                    <select defaultValue={o.status} onChange={(e) => updateStatus(o._id, e.target.value)} className="input">
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
