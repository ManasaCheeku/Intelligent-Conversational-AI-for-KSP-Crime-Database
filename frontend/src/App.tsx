import { AnimatePresence, motion } from "framer-motion";
import { AICrimeInvestigationAssistant } from "./components/chatbot/AICrimeInvestigationAssistant";
import FloatingChatWidget from "./components/chatbot/FloatingChatWidget";
import { ChatProvider, useChat } from "./context/ChatContext";
import { AppRoutes } from "./routes/AppRoutes";

export default function App() {
  const { isOpen } = useChat();

  return (
    <>
      <AppRoutes />
      <FloatingChatWidget />
      <AnimatePresence>
        {isOpen && <motion.div className="fixed bottom-28 right-8 z-40 w-[90vw] max-w-4xl h-[70vh]" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}><AICrimeInvestigationAssistant /></motion.div>}
      </AnimatePresence>
    </>
  );
}
