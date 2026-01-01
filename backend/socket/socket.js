const onlineUsers = new Map(); // userId -> socketId

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // user online
    socket.on("user_online", (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit("online_users", Array.from(onlineUsers.keys()));
    });

    // join chat room
    socket.on("join_chat", (chatId) => {
      socket.join(chatId);
    });

    // typing indicator
    socket.on("typing", ({ chatId, userId }) => {
      socket.to(chatId).emit("user_typing", userId);
    });

    socket.on("stop_typing", ({ chatId }) => {
      socket.to(chatId).emit("stop_typing");
    });

    socket.on("disconnect", () => {
      for (let [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      io.emit("online_users", Array.from(onlineUsers.keys()));
      console.log("Socket disconnected");
    });
  });
};
 export default socketHandler