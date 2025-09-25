import React from "react";
import { motion } from "framer-motion";
import { slideInRight } from "../animations";
import "./AgentProducts.css";

const AgentProducts = () => {
  const products = [
    { id: 1, name: "Tomatoes", price: "₹50/kg" },
    { id: 2, name: "Onions", price: "₹40/kg" },
  ];

  return (
    <motion.div className="products-container" initial="hidden" animate="visible" variants={slideInRight}>
      <h2>Products</h2>
      <div className="product-list">
        {products.map(p => (
          <div className="product-card" key={p.id}>
            <h3>{p.name}</h3>
            <p>{p.price}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AgentProducts;
