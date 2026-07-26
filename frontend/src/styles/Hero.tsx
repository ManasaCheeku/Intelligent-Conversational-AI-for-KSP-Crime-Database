import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, PlayCircle } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden px-4" id="home">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60"></div>
      <div className="absolute inset-0 bg-hero-gradient"></div>
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-ic-signal/10 rounded-full filter blur-3xl"
        animate={{
          x: [-20, 20, -20],
          y: [-20, 20, -20],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
      />

      {/* Content */}
      <div className="relative z-10">
        <motion.div
          className="inline-block px-4 py-2 mb-6 border border-ic-border-strong bg-ic-signal/10 rounded-full text-sm text-ic-signal"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Karnataka State Police Datathon 2026 Finalist
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-ic-text-hi to-ic-text-mid"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          AI-Powered Crime<br />Intelligence Platform
        </motion.h1>

        <motion.p
          className="mt-6 max-w-3xl mx-auto text-lg text-ic-text-mid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Empowering Karnataka State Police with predictive analytics, conversational intelligence, and real-time decision support for a safer tomorrow.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap justify-center items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link to="/dashboard" className="btn btn-primary">
            Launch Platform <ArrowRight className="w-5 h-5" />
          </Link>
          <a href="#demo" className="btn btn-secondary">
            <PlayCircle className="w-5 h-5" /> Watch Live Demo
          </a>
        </motion.div>
      </div>
    </section>
  );
};