import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

import { ClientToServerEvents, ServerToClientEvents } from "./api/types";

let socket: Socket<ServerToClientEvents, ClientToServerEvents>;

export default function Home() {
  const router = useRouter();
  const [room, setRoom] = useState("");
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);

  useEffect(() => {
    socket = io({
      path: "/api/socket",
    });

    socket.on("room-list", (rooms: string[]) => {
      setAvailableRooms(rooms);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const createRoom = () => {
    if (room) {
      socket.emit("create-room", room);
      setRoom("");
    }
  };

  const deleteRoom = (roomName: string) => {
    socket.emit("delete-room", roomName);
  };

  const joinRoom = (roomName: string) => {
    router.push(`/chat/${roomName}`);
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="max-w-md gap-4 flex-col w-full">
        <h1 className="text-4xl w-full font-bold mb-8">Group Chat</h1>
        <div className="flex flex-col w-full">
          <h2 className="text-2xl font-semibold mb-4">Available Rooms</h2>
          {availableRooms.length > 0 ? (
            <ul className="space-y-2">
              {availableRooms.map((roomName, index) => (
                <li key={index}>
                  <div className="w-full group justify-between font-medium flex text-black text-left p-4 bg-white rounded-md">
                    <div className="min-h-8 h-full flex w-full items-center">
                      {roomName}
                    </div>
                    <div className="flex gap-4">
                      <button
                        className="text-red-500 hidden group-hover:flex group-hover:ring-1 ring-0 ring-red-500 py-1 px-2 hover:bg-red-500 hover:text-white rounded"
                        onClick={() => deleteRoom(roomName)}
                      >
                        {"Delete"}
                      </button>
                      <button
                        className="text-blue-500 hidden group-hover:flex group-hover:ring-1 ring-0 whitespace-nowrap ring-blue-500 py-1 px-2 hover:bg-blue-500 hover:text-white rounded"
                        onClick={() => joinRoom(roomName)}
                      >
                        {"Join >"}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No rooms available</p>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            createRoom();
          }}
          className="flex mt-8 h-12"
        >
          <input
            className="w-full outline-none transition-all placeholder:text-gray-500 justify-between flex text-black text-left p-4 bg-gray-400  rounded-md"
            type="text"
            placeholder="Enter new room name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button
            className="bg-blue-500 transition-all disabled:max-w-0 disabled:p-0 disabled:ml-0 disabled:opacity-0 ml-4 text-white p-4 flex justify-center items-center w-fit h-full rounded"
            type="submit"
            disabled={room.length <= 0 || availableRooms.includes(room)}
          >
            +
          </button>
        </form>
      </div>
    </div>
  );
}
