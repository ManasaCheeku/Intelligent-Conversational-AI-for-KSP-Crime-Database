import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/api';
import {
  Shield,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();

  // Form Field States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('investigator');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI Flow States
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [showToast, setShowToast] = useState(false);

  // Frontend Validator Check
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!name.trim()) errors.name = 'Full name is required';
    
    if (!email) {
      errors.email = 'Badge email is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Invalid system email format';
    }
    
    if (!phone.trim()) errors.phone = 'Contact number is required';
    if (!address.trim()) errors.address = 'Primary department assignment is required';
    
    if (!password) {
      errors.password = 'Security password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Security passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Connects directly to FastAPI backend structure
      await apiClient.post('/auth/register', {
        name,
        email,
        phone,
        address,
        role,
        password
      });

      // Display dynamic Toast notifications upon success
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/login');
      }, 3000);
    } catch (err) {
      setErrorMessage(err.message || 'Registration rejected. Please verify credential parameters.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans relative overflow-hidden selection:bg-purple-500/30">
      
      {/* Structural ambient backdrop decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px] pointer-events-none" />

      {/* Success Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 max-w-sm bg-slate-900 border border-emerald-500/30 rounded-xl p-4 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white">Investigator Enrolled</h4>
              <p className="text-xs text-slate-400 mt-1">Credentials stored safely. Redirecting to terminal terminal authorization portal...</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative z-10 my-8">
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="p-8">
          
          {/* Back/Header Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => navigate('/login')}
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Back to Login</span>
            </button>
            <span className="text-[10px] font-mono text-slate-500 uppercase">System enrollment v2.6</span>
          </div>

          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-11 h-11 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-3">
              <Shield className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Enroll Investigator Credentials</h1>
            <p className="text-xs text-slate-400 mt-1">KSP IntelliCrime Identity Registry</p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Split row Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <User className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full bg-slate-950 border text-xs text-slate-200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all ${
                      validationErrors.name ? 'border-red-500/50' : 'border-slate-850'
                    }`}
                    placeholder="Det. Marcus Vance"
                  />
                </div>
                {validationErrors.name && (
                  <p className="text-[9px] text-red-400 mt-1">{validationErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Badge Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full bg-slate-950 border text-xs text-slate-200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all font-mono ${
                      validationErrors.email ? 'border-red-500/50' : 'border-slate-850'
                    }`}
                    placeholder="m.vance@ksp-intel.gov"
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-[9px] text-red-400 mt-1">{validationErrors.email}</p>
                )}
              </div>
            </div>

            {/* Split row Phone & Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Direct Line (Phone)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <Phone className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full bg-slate-950 border text-xs text-slate-200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all font-mono ${
                      validationErrors.phone ? 'border-red-500/50' : 'border-slate-850'
                    }`}
                    placeholder="+1 (555) 019-2834"
                  />
                </div>
                {validationErrors.phone && (
                  <p className="text-[9px] text-red-400 mt-1">{validationErrors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Bureau Office Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <MapPin className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`w-full bg-slate-950 border text-xs text-slate-200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all ${
                      validationErrors.address ? 'border-red-500/50' : 'border-slate-850'
                    }`}
                    placeholder="Precinct 4, West Sector"
                  />
                </div>
                {validationErrors.address && (
                  <p className="text-[9px] text-red-400 mt-1">{validationErrors.address}</p>
                )}
              </div>
            </div>

            {/* Clearance Level */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target Clearance Role</label>
              <div className="grid grid-cols-3 gap-2">
                {['investigator', 'analyst', 'admin'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-1.5 px-3 text-xs font-semibold rounded-lg border capitalize transition-all ${
                      role === r
                        ? 'bg-purple-500/10 border-purple-500 text-purple-400'
                        : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-800'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Split row Password fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Security Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full bg-slate-950 border text-xs text-slate-200 rounded-lg pl-9 pr-8 py-2 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all font-mono ${
                      validationErrors.password ? 'border-red-500/50' : 'border-slate-850'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-[9px] text-red-400 mt-1">{validationErrors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Confirm Security Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full bg-slate-950 border text-xs text-slate-200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all font-mono ${
                      validationErrors.confirmPassword ? 'border-red-500/50' : 'border-slate-850'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {validationErrors.confirmPassword && (
                  <p className="text-[9px] text-red-400 mt-1">{validationErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg hover:shadow-purple-500/10 flex items-center justify-center gap-2 text-xs uppercase tracking-wider select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-4"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Enrolling Credentials...</span>
                </>
              ) : (
                <>
                  <span>Submit Application Request</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

        </div>
        
        {/* Registration Info Banner */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-850 text-[10px] text-slate-500">
          Enrolled metrics are strictly audited under State Security Acts. Please make sure phone parameters are valid for two-factor authentication requirements.
        </div>

      </div>
    </div>
  );
}