import { memo } from "react";
import { Copy, Bot, User, ShieldCheck } from "lucide-react";

export interface ChatMessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  confidence?: number;
}

interface Props {
  message: ChatMessageData;
}

function ChatMessage({ message }: Props) {
  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
    } catch {
      console.error("Copy failed");
    }
  };

  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-4 mb-5 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center">
          <Bot size={20} className="text-white" />
        </div>
      )}

      <div
        className={`max-w-3xl rounded-2xl shadow-lg border p-5 ${
          isUser
            ? "bg-blue-600 border-blue-500 text-white"
            : "bg-slate-900 border-slate-700 text-slate-100"
        }`}
      >
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            {isUser ? (
              <>
                <User size={16} />
                Officer
              </>
            ) : (
              <>
                <ShieldCheck size={16} />
                IntelliCrime AI
              </>
            )}
          </div>

          <button
            onClick={copyMessage}
            className="hover:text-cyan-400 transition"
            title="Copy"
          >
            <Copy size={16} />
          </button>
        </div>

        <div className="whitespace-pre-wrap leading-7 text-sm">
          {message.content}
        </div>

        <div className="flex justify-between mt-4 text-xs text-slate-400">
          <span>{message.timestamp}</span>

          {!isUser && message.confidence !== undefined && (
            <span className="px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-300">
              Confidence {message.confidence}%
            </span>
          )}
        </div>
      </div>

      {isUser && (
        <div className="w-11 h-11 rounded-full bg-emerald-600 flex items-center justify-center">
          <User size={20} className="text-white" />
        </div>
      )}
    </div>
  );
}

export default memo(ChatMessage);