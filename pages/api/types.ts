import { Server as HTTPServer, IncomingMessage } from "http";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

export interface ChatMessage {
  room: string;
  content: string;
  sender: string;
}

export interface ServerToClientEvents {
  "room-list": (rooms: string[]) => void;
  "receive-message": (message: ChatMessage) => void;
}

export interface ClientToServerEvents {
  "create-room": (roomName: string) => void;
  "delete-room": (roomName: string) => void;
  "join-room": (roomName: string) => void;
  "leave-room": (roomName: string) => void;
  "send-message": (message: ChatMessage) => void;
}

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: IncomingMessage & {
    server: HTTPServer & {
      io?: SocketIOServer<ClientToServerEvents, ServerToClientEvents>;
    };
  };
};
