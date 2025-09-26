// backend/src/controllers/agentController.js
import Agent from "../models/Agent.js";
import Farmer from "../models/Farmer.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // optional but good to hash passwords

// Helper: sign token
const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

/* -------------------------
   Agent Auth
   ------------------------- */
export const registerAgent = async (req, res) => {
  try {
    const { fullName, email, password, phone, region } = req.body;
    const exists = await Agent.findOne({ email });
    if (exists) return res.status(400).json({ message: "Agent already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const agent = new Agent({ fullName, email, password: hashed, phone, region });
    await agent.save();

    const token = signToken({ _id: agent._id, role: agent.role, email: agent.email });
    res.status(201).json({ message: "Agent registered", user: agent, token });
  } catch (err) {
    console.error("registerAgent:", err);
    res.status(500).json({ message: "Error registering agent" });
  }
};

export const loginAgent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const agent = await Agent.findOne({ email });
    if (!agent) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, agent.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken({ _id: agent._id, role: agent.role, email: agent.email });
    res.json({ message: "Login successful", user: agent, token });
  } catch (err) {
    console.error("loginAgent:", err);
    res.status(500).json({ message: "Error logging in" });
  }
};

/* -------------------------
   Agent profile
   ------------------------- */
export const getAgentProfile = async (req, res) => {
  try {
    const agent = await Agent.findById(req.user._id).select("-password");
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    res.json({ user: agent });
  } catch (err) {
    console.error("getAgentProfile:", err);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

export const updateAgentProfile = async (req, res) => {
  try {
    const { fullName, phone, region } = req.body;
    const agent = await Agent.findByIdAndUpdate(
      req.user._id,
      { fullName, phone, region },
      { new: true }
    ).select("-password");
    res.json({ message: "Profile updated", user: agent });
  } catch (err) {
    console.error("updateAgentProfile:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
};

/* -------------------------
   Farmer management
   ------------------------- */
export const getFarmersForAgent = async (req, res) => {
  try {
    // list farmers assigned to this agent
    const farmers = await Farmer.find({ agent: req.user._id });
    res.json(farmers);
  } catch (err) {
    console.error("getFarmersForAgent:", err);
    res.status(500).json({ message: "Error fetching farmers" });
  }
};

// create farmer on behalf (optional)
export const createFarmerForAgent = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;
    const exists = await Farmer.findOne({ email });
    if (exists) return res.status(400).json({ message: "Farmer already exists" });

    // you may want to hash farmer password as well
    const farmer = new Farmer({
      fullName,
      email,
      password,
      phone,
      agent: req.user._id,
      verified: true // or false depending on workflow
    });
    await farmer.save();
    res.status(201).json({ message: "Farmer created", farmer });
  } catch (err) {
    console.error("createFarmerForAgent:", err);
    res.status(500).json({ message: "Error creating farmer" });
  }
};

// verify/assign farmer
export const verifyFarmer = async (req, res) => {
  try {
    const { farmerId, verify = true } = req.body;
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });

    farmer.verified = verify;
    // assign agent if verify true and not assigned
    if (verify && !farmer.agent) farmer.agent = req.user._id;
    await farmer.save();
    res.json({ message: "Farmer updated", farmer });
  } catch (err) {
    console.error("verifyFarmer:", err);
    res.status(500).json({ message: "Error updating farmer" });
  }
};

/* -------------------------
   Product / Crop management (on behalf of assigned farmers)
   ------------------------- */
export const listProductsForAgent = async (req, res) => {
  try {
    // find products where farmer.agent === this agent
    const products = await Product.find()
      .populate("farmer", "fullName email agent")
      .sort({ createdAt: -1 });

    // filter server-side to only those where farmer.agent === req.user._id
    const mine = products.filter((p) => p.farmer?.agent?.toString() === req.user._id.toString());
    res.json(mine);
  } catch (err) {
    console.error("listProductsForAgent:", err);
    res.status(500).json({ message: "Error fetching products" });
  }
};

// Approve or reject product
export const approveProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { approve } = req.body; // true/false
    const product = await Product.findById(productId).populate("farmer");
    if (!product) return res.status(404).json({ message: "Product not found" });

    // check agent owns the farmer
    if (!product.farmer || product.farmer.agent?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to manage this product" });
    }

    product.approved = !!approve; // ensure product schema handles `approved` field OR create it
    await product.save();
    res.json({ message: approve ? "Product approved" : "Product rejected", product });
  } catch (err) {
    console.error("approveProduct:", err);
    res.status(500).json({ message: "Error approving product" });
  }
};

/* -------------------------
   Orders for agent
   ------------------------- */

// Get orders that belong to farmers this agent manages
export const getOrdersForAgent = async (req, res) => {
  try {
    // find farmers assigned to this agent
    const farmers = await Farmer.find({ agent: req.user._id }).select("_id");
    const farmerIds = farmers.map((f) => f._id);

    const orders = await Order.find({ farmer: { $in: farmerIds } })
      .populate("product")
      .populate("buyer")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("getOrdersForAgent:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

export const approveOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { approve } = req.body;
    const order = await Order.findById(id).populate("farmer");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.farmer.agent?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.approved = approve;
    await order.save();
    res.json({ message: approve ? "Order approved" : "Order rejected", order });
  } catch (err) {
    console.error("approveOrder:", err);
    res.status(500).json({ message: "Error approving order" });
  }
};


// Update order status (and compute commission on Delivered)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findById(id).populate("product").populate("farmer");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // ensure agent manages the farmer
    if (!order.farmer || order.farmer.agent?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this order" });
    }

    order.status = status;

    // On Delivered -> compute commission
    if (status === "Delivered") {
      // simple commission rate e.g., 2% of total
      const commissionRate = Number(process.env.AGENT_COMMISSION_RATE || 0.02);
      const commission = (order.total || order.price * order.quantity) * commissionRate;

      order.agent = req.user._id;
      order.agentCommission = commission;

      // add commission to agent's wallet
      await Agent.findByIdAndUpdate(req.user._id, { $inc: { commissionEarned: commission } });
    }

    await order.save();
    res.json({ message: "Order updated", order });
  } catch (err) {
    console.error("updateOrderStatus:", err);
    res.status(500).json({ message: "Error updating order" });
  }
};

/* -------------------------
   Dashboard stats
   ------------------------- */
export const getAgentDashboard = async (req, res) => {
  try {
    const agentId = req.user._id;
    const farmers = await Farmer.countDocuments({ agent: agentId });
    const products = await Product.countDocuments({ "farmer": { $exists: true } }).then(async total => {
      // better compute products for agent
      const p = await Product.find().populate("farmer", "agent");
      return p.filter(prod => prod.farmer?.agent?.toString() === agentId.toString()).length;
    });
    const orders = await (async () => {
      const f = await Farmer.find({ agent: agentId }).select("_id");
      const ids = f.map(x => x._id);
      return Order.countDocuments({ farmer: { $in: ids } });
    })();
    const agent = await Agent.findById(agentId);

    res.json({
      farmers,
      products,
      orders,
      commissionEarned: agent?.commissionEarned || 0,
    });
  } catch (err) {
    console.error("getAgentDashboard:", err);
    res.status(500).json({ message: "Error fetching dashboard" });
  }
};
