import { useState } from "react";
import axios from "axios";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: `User: ${input}`, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await axios.post("https://ai-chat-bot-backend-peach.vercel.app/chat", { message: input });

      setMessages([...newMessages, { text: `AI: ${response.data.reply}`, sender: "bot" }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([...newMessages, { text: "AI: Error: Unable to get a response.", sender: "bot" }]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col">
        <h1 className="text-2xl font-bold text-center mb-4">AI ChatBot</h1>
        <div className="h-72 overflow-y-auto p-4 border border-gray-700 rounded flex flex-col space-y-2">
          {messages.map((msg, index) => (
            <div key={index} className="text-left p-2 rounded bg-gray-700">
              {msg.text}
            </div>
          ))}
        </div>
        <div className="mt-4 flex">
          <input
            type="text"
            className="flex-1 p-3 rounded-l bg-gray-700 border-none focus:ring-2 focus:ring-blue-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage} className="px-4 bg-blue-600 rounded-r text-white">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
