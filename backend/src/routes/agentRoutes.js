// backend/src/routes/agentRoutes.js
import express from "express";
import {
  registerAgent,
  loginAgent,
  getAgentProfile,
  updateAgentProfile,
  getFarmersForAgent,
  createFarmerForAgent,
  verifyFarmer,
  listProductsForAgent,
  approveProduct,
  getOrdersForAgent,
  approveOrder,          // ✅ Added back
  updateOrderStatus,
  getAgentDashboard,
} from "../controllers/agentController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Auth
router.post("/register", registerAgent);
router.post("/login", loginAgent);

// Profile
router.get("/profile", protect, authorizeRoles("agent"), getAgentProfile);
router.put("/profile", protect, authorizeRoles("agent"), updateAgentProfile);

// Farmers
router.get("/farmers", protect, authorizeRoles("agent"), getFarmersForAgent);
router.post("/farmers", protect, authorizeRoles("agent"), createFarmerForAgent);
router.put("/farmers/verify", protect, authorizeRoles("agent"), verifyFarmer);

// Products
router.get("/products", protect, authorizeRoles("agent"), listProductsForAgent);
router.put("/products/:productId/approve", protect, authorizeRoles("agent"), approveProduct);

// Orders
router.get("/orders", protect, authorizeRoles("agent"), getOrdersForAgent);
router.put("/orders/:id/approve", protect, authorizeRoles("agent"), approveOrder);   // ✅ Fix
router.put("/orders/:id/status", protect, authorizeRoles("agent"), updateOrderStatus);

// Dashboard
router.get("/dashboard", protect, authorizeRoles("agent"), getAgentDashboard);

export default router;
