import { io } from "socket.io-client";

const socket = io("https://chat-application-yy3j.onrender.com", {
  transports: ["websocket", "polling"]
});

export default socket;
