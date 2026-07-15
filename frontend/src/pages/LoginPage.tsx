import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../services/api";
import { AuthShell } from "../components/auth/AuthShell";
export function LoginPage() {
  const { login } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [showPassword, setShowPassword] = useState(false); const [error, setError] = useState(""); const [submitting, setSubmitting] = useState(false);
  const submit = async (event: FormEvent) => { event.preventDefault(); setError(""); setSubmitting(true); try { await login({ email, password }); navigate((location.state as { from?: string } | null)?.from || "/dashboard", { replace: true }); } catch (err) { setError(getApiErrorMessage(err)); } finally { setSubmitting(false); } };
  return <AuthShell><h2>Sign in</h2><p className="muted">Use your registered KSP IntelliCrime account.</p>{error && <p className="form-error" role="alert">{error}</p>}<form onSubmit={submit} noValidate><label>Email<input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label><label>Password<span className="password-input"><input required minLength={8} type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" /><button type="button" aria-label="Toggle password visibility" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label><button className="primary-button" disabled={submitting}>{submitting ? "Signing in…" : <><LogIn size={18} /> Sign in securely</>}</button></form><p className="switch-link">New to the platform? <Link to="/register">Create an account</Link></p></AuthShell>;
}
