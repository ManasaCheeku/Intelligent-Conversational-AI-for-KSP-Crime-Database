import { useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessage, { ChatMessageData } from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import SuggestedQuestions from "./SuggestedQuestions";

const defaultQuestions = [
  "Show cyber fraud cases in Bengaluru",
  "Predict crime hotspots",
  "Find repeat offenders",
  "Generate FIR summary",
  "Show criminal network",
  "Analyze suspect behavior",
];

const initialMessage: ChatMessageData = {
  id: "welcome",
  role: "assistant",
  content:
    "Welcome Officer.\n\nI am KSP IntelliCrime AI.\n\nI can analyze FIRs, identify crime patterns, predict hotspots, correlate evidence, and assist investigations.\n\nHow can I help today?",
  timestamp: new Date().toLocaleTimeString(),
  confidence: 99,
};

export default function AIChat() {
  const [messages, setMessages] = useState<ChatMessageData[]>([
    initialMessage,
  ]);

  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = (text: string) => {
    const userMessage: ChatMessageData = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    setTimeout(() => {
      const aiMessage: ChatMessageData = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `Investigation Summary

Query:
${text}

Findings

• 127 matching FIRs found

• Highest Crime Zone:
Electronic City

• Repeat Offenders:
12

• Predicted Risk:
High

• Suggested Action:
Increase patrol between 7 PM and 11 PM.

• Related Sections:
BNS 303
IT Act 66C

• AI Confidence:
96%`,
        timestamp: new Date().toLocaleTimeString(),
        confidence: 96,
      };

      setMessages((prev) => [...prev, aiMessage]);

      setLoading(false);
    }, 1800);
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">

      {messages.length === 1 && (
        <div className="p-5 border-b border-slate-800">
          <SuggestedQuestions
            questions={defaultQuestions}
            onSelect={sendMessage}
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6">

        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
          />
        ))}

        {loading && (
          <TypingIndicator />
        )}

        <div ref={bottomRef} />

      </div>

      <ChatInput
        onSend={sendMessage}
        disabled={loading}
      />

    </div>
  );
}