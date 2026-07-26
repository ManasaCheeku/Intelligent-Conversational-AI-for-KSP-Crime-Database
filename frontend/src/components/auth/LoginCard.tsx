import React from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, Mail, Lock } from 'lucide-react';

const InputField = ({ icon: Icon, type, placeholder, id }) => (
  <div className="relative">
    <Icon className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-500" size={20} />
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      className="w-full bg-slate-900/70 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
    />
  </div>
);

export const LoginCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto rounded-2xl p-8 glass-card"
    >
      <div className="flex flex-col items-center">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20"
        >
          <Fingerprint className="text-cyan-400" size={32} />
        </motion.div>
        <h2 className="text-3xl font-bold text-slate-100 mt-6">Secure Access</h2>
        <p className="text-slate-400 text-sm mt-2">Karnataka State Police Intelligence</p>
      </div>

      <form className="mt-8 space-y-6">
        <InputField icon={Mail} type="email" id="email" placeholder="Email Address" />
        <InputField icon={Lock} type="password" id="password" placeholder="Password" />

        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 rounded bg-slate-700 border-slate-600 text-cyan-600 focus:ring-cyan-500"
            />
            <label htmlFor="remember" className="text-slate-400 cursor-pointer">
              Remember me
            </label>
          </div>
          <a href="#" className="font-medium text-cyan-500 hover:text-cyan-400 transition-colors">
            Forgot Password?
          </a>
        </div>

        <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-8 py-3 font-semibold text-white bg-cyan-600 rounded-lg shadow-lg shadow-cyan-600/20 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all"
            >
              Secure Login
            </motion.button>
        </div>
      </form>
    </motion.div>
  );
};
