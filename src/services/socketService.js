// /services/socketService.js
import { Server } from "socket.io";
import { jwtAuthMiddleware } from "../middlewares/authMiddleware.js";
import * as roomController from "../controllers/roomController.js";
import dotenv from "dotenv";
dotenv.config();
const users = new Map();
const initSocketIO = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
    },
    transports: ["websocket"],
    allowEIO3: true,
  });
  io.use(jwtAuthMiddleware);
  io.on("connection", (socket) => {
    console.log(" Client connected:", socket.id);
    socket.io = io;
    socket.on("joinRoom", (data) => roomController.joinRoom(socket, data));
    socket.on("leaveRoom", (data) => roomController.leaveRoom(socket, data));
    socket.on("disconnect", () => roomController.disconnect(socket, io));

    // Handle errors
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });

  return io;
};

export { initSocketIO };
