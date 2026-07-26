import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, LogIn, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

/**
 * A secure login page for officers.
 * Features a form for Officer ID and Password, submission handling,
 * and feedback for loading and error states.
 */
const LoginPage: React.FC = () => {
  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Use the login function from AuthContext
      await login(officerId, password);
      // On success, redirect to the dashboard
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="mt-4 text-3xl font-bold tracking-tight">Officer Login</h1>
          <p className="mt-2 text-sm text-slate-400">Access the IntelliCrime AI Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="officerId" className="text-sm font-medium text-slate-300">Officer ID</label>
            <input
              id="officerId"
              type="text"
              value={officerId}
              onChange={(e) => setOfficerId(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 p-3 rounded-lg">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Login'}
              {!isLoading && <LogIn className="ml-2 h-4 w-4" />}
            </Button>
          </div>

          <div className="text-center text-sm">
            <Link to="/forgot-password" className="font-medium text-slate-400 hover:text-cyan-400 transition-colors">
              Forgot Password?
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;