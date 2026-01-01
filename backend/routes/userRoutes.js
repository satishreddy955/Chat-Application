import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

// GET all users except self
router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.user.id } },   // 👈 exclude self
      "name email"                     // 👈 select fields
    );

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
