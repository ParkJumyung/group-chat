import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

import { ChatMessage } from "@/pages/api/types";

let socket: Socket;

const ChatRoom = () => {
  const router = useRouter();
  const { room } = router.query;
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!room || typeof room === "object") return;

    socket = io({
      path: "/api/socket",
    });

    socket.on("room-list", (rooms: string[]) => {
      if (!rooms.includes(room)) {
        router.push(`/`);
      }
    });

    socket.emit("join-room", room);

    socket.on("receive-message", (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.emit("leave-room", room);
      socket.off("receive-message");
      socket.disconnect();
    };
  }, [room]);

  const sendMessage = () => {
    socket.emit("send-message", { room, content: message, sender: socket.id });
    setMessage("");
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="max-w-md relative gap-4 w-full h-[40rem] m-4 rounded-md overflow-hidden">
        <div className="flex w-full absolute top-0 z-10 p-4 backdrop-blur-sm backdrop-brightness-50 border-b-gray-300 border-b-[1px] items-center">
          <h1 className="text-2xl flex w-full font-bold">Room: {room}</h1>
          <Link
            href={"/"}
            className="flex py-2 px-4 ring-1 ring-red-600 rounded-md w-fit h-fit text-red-600 hover:bg-red-600 transition hover:text-white"
          >
            Leave
          </Link>
        </div>
        <div className="relative backdrop-brightness-150 pt-20 flex-col-reverse overflow-y-auto flex h-full max-h-full overflow-x-hidden">
          <ol className="flex p-4 gap-4 flex-col w-full">
            {messages.map((msg, idx) => (
              <li
                key={idx}
                className={`flex w-full h-fit ${
                  msg.sender === socket.id ? "justify-start" : "justify-end"
                }`}
              >
                <p
                  className={`p-2  text-wrap ${
                    msg.sender === socket.id
                      ? "mr-20 bg-gray-100 rounded text-blue-600"
                      : "ml-20 bg-blue-600 rounded text-gray-100"
                  }`}
                >
                  {msg.content}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <form
        className="flex max-w-md w-full items-center h-fit mt-4"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <input
          className="w-full outline-none transition-all placeholder:text-gray-500 justify-between flex text-black text-left p-4 bg-gray-400  rounded-md"
          type="text"
          placeholder="Write a message to send"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="bg-blue-500 transition-all disabled:max-w-0 disabled:p-0 disabled:ml-0 disabled:text-transparent disabled:opacity-0 ml-4 overflow-hidden text-white p-4 flex justify-center items-center w-fit h-full rounded"
          type="submit"
          disabled={message.length <= 0}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
