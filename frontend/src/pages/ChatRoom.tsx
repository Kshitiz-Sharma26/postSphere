import { useContext, useEffect, useRef, useState } from "react";
import DefaultLayout from "../Components/DefaultLayout";
import { GlobalContext } from "../contexts/GlobalContext";
import { GlobalContextType } from "../constants";
import { socket } from "../utility/socket";
import clsx from "clsx";

const ChatRoom: React.FC = () => {
  const { state }: GlobalContextType = useContext(GlobalContext);
  const { userInfo, theme } = state;
  const [messages, setMessages] = useState<
    { message: string; sender: unknown }[]
  >([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("sendMessage", { message: input, sender: userInfo?.username });
    setInput("");
  };

  useEffect(() => {
    socket.connect();

    socket.on("receiveMessage", ({ message, sender }) => {
      setMessages((prev) => [
        ...prev,
        { message, sender: userInfo?.username === sender ? "me" : sender },
      ]);
    });

    return () => {
      socket.off("receiveMessage"); // Cleanup to avoid memory leaks
      socket.disconnect();
    };
  }, [userInfo?.username]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <DefaultLayout>
      <div className="flex flex-col h-full overflow-hidden">
        {" "}
        {/* adjust based on your header height */}
        <div className="text-lg font-semibold p-2 border-b border-gray-300 dark:border-gray-700">
          Chat Room
        </div>
        {/* Chat Messages Scrollable Section */}
        <div
          className={`flex-1 overflow-y-auto px-4 py-2 transition-colors ${
            theme === "dark"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-black"
          }`}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={clsx("mb-3 flex px-2 flex-col", {
                "items-end": msg.sender === "me",
                "items-start": msg.sender !== "me",
              })}
            >
              {msg.sender !== "me" && (
                <div className="text-sm text-gray-600 mb-1 px-2 py-0.5 bg-gray-200 rounded-md">
                  {msg.sender as string}
                </div>
              )}
              <div
                className={clsx(
                  "max-w-xs break-words px-3 py-2 rounded-lg text-white",
                  {
                    "bg-blue-500": msg.sender === "me",
                    "bg-gray-400": msg.sender !== "me",
                  }
                )}
              >
                {msg.message}
              </div>
            </div>
          ))}

          <div ref={chatEndRef} />
        </div>
        {/* Fixed Input Area */}
        <div
          className={`p-3 border-t flex gap-2 items-center transition-colors ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-300"
          }`}
        >
          <input
            type="text"
            className={`flex-1 rounded-lg px-4 py-2 border outline-none transition-colors ${
              theme === "dark"
                ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                : "bg-gray-100 text-black border-gray-300 placeholder-gray-500"
            }`}
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ChatRoom;
