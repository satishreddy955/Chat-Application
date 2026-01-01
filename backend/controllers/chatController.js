import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

export const createChat = async (req, res) => {
  const chat = await Chat.create({
    members: req.body.members
  });
  res.json(chat);
};

export const getUserChats = async (req, res) => {
  const chats = await Chat.find({
    members: req.user.id
  }).populate("members", "name");

  const chatsWithLastMessage = await Promise.all(
    chats.map(async (chat) => {
      const lastMessage = await Message.findOne({ chatId: chat._id })
        .sort({ createdAt: -1 });

      return {
        ...chat._doc,
        lastMessage: lastMessage?.text || ""
      };
    })
  );

  res.json(chatsWithLastMessage);
};
