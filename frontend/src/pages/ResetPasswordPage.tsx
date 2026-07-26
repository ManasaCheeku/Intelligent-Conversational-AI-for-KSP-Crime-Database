import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    setError(null);

    // Simulate API call to reset password with the token
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Resetting password with token: ${token}`);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. The link may have expired.');
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
          <h1 className="mt-4 text-3xl font-bold tracking-tight">Set New Password</h1>
        </div>

        {isSuccess ? (
          <div className="text-center p-4 bg-emerald-500/10 text-emerald-300 rounded-lg">
            <CheckCircle className="mx-auto h-10 w-10 mb-3" />
            <h3 className="font-bold">Password Updated</h3>
            <p className="text-sm mt-1">You can now log in with your new password.</p>
            <Link to="/login">
              <Button variant="primary" className="mt-4">
                Proceed to Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="password">New Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                required
              />
            </div>
            {error && <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 p-3 rounded-lg"><AlertCircle size={16} /><span>{error}</span></div>}
            <div>
              <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Set New Password'}
                {!isLoading && <KeyRound className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;