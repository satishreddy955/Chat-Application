import express from "express";
import Chat from "../models/Chat.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

/**
 * CREATE OR GET CHAT
 * POST /api/chats
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    const myId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required"
      });
    }

    // check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [myId, userId] }
    }).populate("participants", "name email");

    // create new chat if not exists
    if (!chat) {
      chat = await Chat.create({
        participants: [myId, userId]
      });

      chat = await chat.populate("participants", "name email");
    }

    res.status(200).json(chat);

  } catch (error) {
    console.error("CHAT CREATE ERROR:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
});

/**
 * GET CHAT BY ID
 * GET /api/chats/:chatId
 */
router.get("/:chatId", authMiddleware, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate("participants", "name email");

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found"
      });
    }

    res.status(200).json(chat);

  } catch (error) {
    console.error("GET CHAT ERROR:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
});

export default router;
