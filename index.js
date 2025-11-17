import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { initSocketIO } from "./src/services/socketService.js";
import webHookRoutes from "./src/routes/webhookRoutes.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = initSocketIO(httpServer);
app.get("/", (req, res) => {
  res.send(" Socket.IO server is running!");
});
app.use((req, res, next) => {
    req.io = io;
    next();
});


app.use('/emit', webHookRoutes);

httpServer.on("error", (error) => {
  console.error("Server error:", error);
});



const PORT = process.env.PORT || 8888;
httpServer.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});
