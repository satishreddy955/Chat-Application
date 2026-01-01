export const sendMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;

  if (!text || !text.trim())
    return res.status(400).json({ success: false, message: "Message cannot be empty" });

  const message = await Message.create({ chatId, senderId, text });

  res.json({
    success: true,
    message: "Message sent",
    data: message
  });
};
