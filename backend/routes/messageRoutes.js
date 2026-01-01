import express from "express";
import Message from "../models/Message.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

// SEND MESSAGE
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { chatId, text } = req.body;

    const message = await Message.create({
      chat: chatId,
      sender: req.user.id,
      text
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// FETCH MESSAGES FOR A CHAT
router.get("/:chatId", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
