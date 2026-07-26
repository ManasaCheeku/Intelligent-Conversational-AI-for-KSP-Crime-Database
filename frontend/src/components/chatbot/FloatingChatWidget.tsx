import { motion } from 'framer-motion';
import { Bot, MessageSquare } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

const FloatingChatWidget = () => {
  const { toggleChat } = useChat();

  return (
    <motion.button
      onClick={toggleChat}
      className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      aria-label="Open AI Assistant"
    >
      <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping"></span>
      <Bot size={32} />
      {/* Unread notification badge */}
      <span className="absolute -top-1 -right-1 flex h-5 w-5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-5 w-5 bg-rose-500 items-center justify-center text-xs font-bold">
          3
        </span>
      </span>
    </motion.button>
  );
};

export default FloatingChatWidget;