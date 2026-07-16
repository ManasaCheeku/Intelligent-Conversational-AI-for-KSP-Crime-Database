import { useState, KeyboardEvent } from "react";
import { Send, Mic, Paperclip } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({
  onSend,
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    const text = message.trim();

    if (!text) return;

    onSend(text);
    setMessage("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="w-full border-t border-slate-800 bg-slate-950 p-4">
      <div className="flex items-center gap-3">

        {/* Attachment */}
        <button
          className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
          title="Attach Evidence"
        >
          <Paperclip className="w-5 h-5 text-slate-300" />
        </button>

        {/* Input */}
        <input
          type="text"
          placeholder="Ask about crimes, FIRs, suspects, hotspots..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500"
        />

        {/* Voice */}
        <button
          className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
          title="Voice Search"
        >
          <Mic className="w-5 h-5 text-cyan-400" />
        </button>

        {/* Send */}
        <button
          onClick={sendMessage}
          disabled={disabled}
          className="flex items-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 px-5 py-3 font-semibold text-white transition disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
          Send
        </button>

      </div>
    </div>
  );
}