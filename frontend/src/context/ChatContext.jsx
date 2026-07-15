import { createContext } from "react";

export const ChatContext = createContext();

export function ChatProvider({ children }) {
  return (
    <ChatContext.Provider value={{}}>
      {children}
    </ChatContext.Provider>
  );
}