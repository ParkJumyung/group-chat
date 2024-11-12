import {
  ClientToServerEvents,
  NextApiResponseWithSocket,
  ServerToClientEvents,
} from "./types";
import { NextApiRequest } from "next";
import { Server as SocketIOServer } from "socket.io";

const rooms: Set<string> = new Set();

export default function SocketHandler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (!res.socket?.server) {
    res.status(500).json({ error: "Socket server unavailable" });
    return;
  }

  const isSocketInitialized = res.socket.server.io;

  if (!isSocketInitialized) {
    console.log("Initializing Socket.IO server...");

    const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>(
      res.socket.server,
      {
        path: "/api/socket",
      }
    );

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      const userId = socket.id;

      console.log("User connected:", userId);

      socket.emit("room-list", Array.from(rooms));

      socket.on("create-room", (roomName) => {
        if (rooms.has(roomName)) return;
        rooms.add(roomName);
        io.emit("room-list", Array.from(rooms));
        console.log(`Room ${roomName} created`);
      });

      socket.on("delete-room", (roomName) => {
        if (!rooms.has(roomName)) return;
        rooms.delete(roomName);
        io.emit("room-list", Array.from(rooms));
        console.log(`Room ${roomName} deleted`);
      });

      socket.on("join-room", (roomName) => {
        if (!rooms.has(roomName)) return;
        socket.join(roomName);
        console.log(`User ${userId} joined room ${roomName}`);
      });

      socket.on("leave-room", (roomName) => {
        if (!rooms.has(roomName)) return;
        socket.leave(roomName);
        console.log(`User ${userId} left room ${roomName}`);
      });

      socket.on("send-message", (message) => {
        if (!rooms.has(message.room)) return;
        io.to(message.room).emit("receive-message", message);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected", userId);
      });
    });

    console.log("Socket.IO server initialized.");
  } else {
    console.log("Socket.IO server already initialized.");
  }

  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};
