import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
export function AuthShell({ children }: { children: ReactNode }) {
  return <main className="auth-shell"><section className="auth-brand"><ShieldCheck size={42} /><p className="eyebrow">Karnataka State Police</p><h1>IntelliCrime AI</h1><p>Secure crime intelligence for safer communities.</p></section><section className="auth-card">{children}</section></main>;
}
