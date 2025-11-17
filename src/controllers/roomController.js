import * as presence from '../services/presenceService.js';

export const joinRoom = (socket, data) => {
    const userId = socket.userId;
    const roomId = data.roomId;
    const metadata = data.metadata;

   const userMetadata = presence.userJoinRoom(socket, metadata, roomId);

    socket.join(roomId);

    const userPayload = {
        ...userMetadata
    };
    socket.io.to(roomId).except(socket.id).emit("viewerOnline", userPayload);

    console.log(`User  joined room ${roomId}`);
    const initialViewers = presence.getRoomViewers(roomId, userId);
    socket.emit("room:initialViewers", initialViewers);
    console.log("check initviewer: ", initialViewers);
    console.log(`User ${userId} joined room ${roomId}. Initial: ${initialViewers.length}`);
};

export const leaveRoom = (socket, data) => {
    const roomId = data;
    // Xóa user khỏi phòng Socket.IO
    socket.leave(roomId);
presence.userLeaveRoom(socket.userId, roomId);
const payload = { userId: socket.userId };
socket.io.to(roomId).emit("viewerLeftRoom", payload);
    console.log(`User ${socket.userId} left room ${roomId}`);

};

export const disconnect = (socket,io) => {
    console.log(" Client disconnected:");
presence.handleDisconnect(socket, io);
}
