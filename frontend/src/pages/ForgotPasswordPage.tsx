import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Shield, Send, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call to request password reset
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md p-8 space-y-6 bg-slate-900 rounded-2xl shadow-2xl shadow-cyan-500/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-cyan-400" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight">Reset Password</h1>
          <p className="mt-2 text-sm text-slate-400">Enter your email to receive a reset link.</p>
        </div>

        {isSubmitted ? (
          <div className="text-center p-4 bg-emerald-500/10 text-emerald-300 rounded-lg">
            <CheckCircle className="mx-auto h-10 w-10 mb-3" />
            <h3 className="font-bold">Check Your Inbox</h3>
            <p className="text-sm mt-1">If an account with that email exists, we've sent a password reset link.</p>
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold text-sm mt-4 inline-block">
              &larr; Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-300">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                required
                placeholder="you@ksp.gov.in"
              />
            </div>

            <div>
              <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
                {!isLoading && <Send className="ml-2 h-4 w-4" />}
              </Button>
            </div>
            <div className="text-center">
              <Link to="/login" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">
                Remembered your password? Login
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;