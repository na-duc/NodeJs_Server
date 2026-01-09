import dotenv from "dotenv";
dotenv.config();

export const handleRealtimeUpdate = (req, res) => {
  const io = req.io;
  const { event, data, room, senderId } = req.body;

  if (!event) {
    return res.status(400).json({ error: "Missing event name" });
  }

  try {
    if (room) {
      io.to(room).except(senderId).emit(event, data);
      console.log(`📢 Emitted event "${event}" to room "${room}"`);
      console.log("data: ", data);
    } else {
      io.emit(event, data);
      console.log(`📢 Emitted global event "${event}"`);
      console.log("data: ", data);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Emit error:", error);
    res.status(500).json({ error: "Emit failed" });
  }
};
