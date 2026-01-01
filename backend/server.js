import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authroutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";
import socketHandler from "./socket/socket.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

/* ================= SOCKET.IO CONFIG ================= */
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*", // frontend URL in production
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["polling", "websocket"] // IMPORTANT for Render
});

socketHandler(io);

/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true
  })
);

app.use(express.json());

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

/* ================= HEALTH CHECK (OPTIONAL BUT RECOMMENDED) ================= */
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend is running"
  });
});

/* ================= ERROR HANDLER ================= */
app.use(errorHandler);

/* ================= SERVER START ================= */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
