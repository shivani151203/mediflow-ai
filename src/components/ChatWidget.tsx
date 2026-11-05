
"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello! Welcome to MediFlow AI. How can I help you today?",
    },
  ]);

  async function sendMessage() {
    const message = input.trim();

    if (!message || loading) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: message },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to get a response.");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.answer },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            error instanceof Error
              ? `Sorry, ${error.message}`
              : "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">

      {isOpen && (
        <div className="mb-4 flex h-[480px] w-[350px] max-w-[calc(100vw-40px)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">

          {/* Chat Header */}
          <div className="flex items-center justify-between bg-blue-700 p-4 text-white">
            <div>
              <h2 className="font-bold">MediFlow AI</h2>
              <p className="text-xs text-blue-100">
                Your Healthcare Assistant
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
              className="text-2xl hover:text-blue-200"
            >
              ×
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm ${
                    message.role === "user"
                      ? "bg-blue-700 text-white"
                      : "border bg-white text-gray-800"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {loading && (
              <p className="text-sm text-gray-500">
                MediFlow AI is typing...
              </p>
            )}
          </div>

          {/* Message Input */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage();
            }}
            className="flex gap-2 border-t p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask your question..."
              maxLength={1000}
              aria-label="Type your message"
              className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-600"
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
            >
              Send
            </button>
          </form>

          <p className="bg-white px-3 pb-2 text-center text-xs text-gray-400">
            AI assistance only • Not medical advice
          </p>
        </div>
      )}

      {/* Floating Chat Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close chat" : "Open chat"}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-700 text-3xl text-white shadow-xl transition hover:scale-105 hover:bg-blue-800"
        >
          {isOpen ? "×" : "💬"}
        </button>
      </div>
    </div>
  );
}
