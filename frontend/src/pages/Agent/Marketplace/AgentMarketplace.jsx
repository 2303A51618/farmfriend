// apps/frontend/src/pages/Agent/Marketplace/AgentMarketplace.jsx
import React, { useEffect, useState } from "react";
import API from "../../../api";
import { motion } from "framer-motion";
import { slideInRight } from "../../Agent/animation";
import "../../../pages/Agent/Agent.css";

export default function AgentMarketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/agents/products");
      setProducts(data || []);
    } catch (err) {
      console.error("Error fetching agent products:", err);
      alert("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const approveProduct = async (productId, approve = true) => {
    if (!window.confirm(`${approve ? "Approve" : "Reject"} this product?`)) return;
    try {
      await API.put(`/agents/products/${productId}/approve`, { approve });
      fetchProducts();
      alert("Product status updated");
    } catch (err) {
      console.error("approve product err:", err);
      alert("Failed to update product");
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={slideInRight}>
      <div className="panel">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Marketplace (My Farmers)</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 14 }}>
          {loading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p>No products listed by your farmers.</p>
          ) : products.map(p => (
            <div key={p._id} className="panel" style={{ display: "flex", gap: 12, alignItems: "center", flexDirection: "column" }}>
              <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginTop: 0 }}>{p.name}</h3>
                  <p className="small">{p.description}</p>
                  <p><strong>Price:</strong> ₹{p.price} | <strong>Qty:</strong> {p.quantity}</p>
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button className="btn secondary" onClick={() => approveProduct(p._id, !p.approved)}>{p.approved ? "Unapprove" : "Approve"}</button>
                    <div className={p.approved ? "tag-approved" : "tag-pending"} style={{ alignSelf: "center" }}>
                      {p.approved ? "Approved" : "Pending"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
