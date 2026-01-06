const usersOnline = new Map();

export const userJoinRoom = (socket, userdata, roomId) => {
  const userId = socket.userId;
  const socketId = socket.id;

  // Khởi tạo hoặc cập nhật kết nối
  if (!usersOnline.has(userId)) {
    usersOnline.set(userId, {
      userdata: userdata,
      rooms: new Set(),
      socketIds: new Set(),
    });
  }

  // Thêm socketId và roomId
  const userEntry = usersOnline.get(userId);
  userEntry.socketIds.add(socketId);
  userEntry.rooms.add(roomId);

  return userEntry.userdata; // Trả về userdata đã được chuẩn hóa
};

export const getRoomViewers = (roomId, excludeUserId) => {
  const viewers = [];
  for (const [userId, entry] of usersOnline.entries()) {
    if (userId !== excludeUserId && entry.rooms.has(roomId)) {
      viewers.push({ userId: userId, ...entry.userdata });
    }
  }
  return viewers;
};

export const userLeaveRoom = (userId, roomId) => {
  if (usersOnline.has(userId)) {
    usersOnline.get(userId).rooms.delete(roomId);
  }
};

export const handleDisconnect = (socket, io) => {
  const userId = socket.userId;
  if (!usersOnline.has(userId)) return;

  const userEntry = usersOnline.get(userId);
  userEntry.socketIds.delete(socket.id); // Xóa socketId vừa bị ngắt

  // 🎯 KIỂM TRA ĐA THIẾT BỊ
  if (userEntry.socketIds.size === 0) {
    // User đã offline hoàn toàn
    userEntry.rooms.forEach((roomId) => {
      io.to(roomId).emit("viewerLeftRoom", { userId: userId });
    });
    usersOnline.delete(userId);
    console.log(`[Presence] User ${userId} fully disconnected.`);
  }
};
