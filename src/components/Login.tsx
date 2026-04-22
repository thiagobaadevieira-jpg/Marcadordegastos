import React, { useState } from "react";
import { LogIn, Loader2, AlertCircle } from "lucide-react";
import { signInWithGoogle } from "../lib/firebase";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Erro detalhado de login:", err);
      
      // Mapeamento de erros comuns do Firebase Auth
      if (err.code === 'auth/unauthorized-domain') {
        const currentDomain = window.location.hostname;
        setError(`O domínio "${currentDomain}" não está autorizado no Firebase Console (Authentication > Settings > Authorized Domains).`);
      } else if (err.code === 'auth/popup-blocked') {
        setError("O navegador bloqueou o pop-up de login. Por favor, permita pop-ups.");
      } else if (err.code === 'auth/operation-not-allowed') {
        setError("O login com Google não foi ativado no Firebase Console.");
      } else {
        setError("Falha ao entrar: " + (err.message || "Erro desconhecido"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020408] px-4 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      
      <div className="glass max-w-sm w-full p-8 md:p-12 text-center space-y-8 relative z-10 border-white/10 group hover:border-white/20 transition-all duration-500">
        <div className="space-y-3">
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 active-glow group-hover:rotate-6 transition-transform duration-500">
            <h1 className="text-3xl font-black text-white tracking-tighter">A<span className="text-primary">.</span></h1>
          </div>
          <h2 className="text-2xl md:text-3xl font-light text-white tracking-tight">Bem-vindo ao AETHER</h2>
          <p className="text-sm text-secondary font-medium px-4">Sua central imersiva de inteligência financeira e controle de gastos.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-[11px] font-bold text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl animate-shake">
            <AlertCircle size={14} className="shrink-0" />
            <span className="text-left">{error}</span>
          </div>
        )}

        <button 
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white text-black h-14 rounded-2xl font-black text-xs tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98] transition-all glow-cyan disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <LogIn size={18} />
          )}
          {loading ? 'Processando...' : 'Entrar com Google'}
        </button>

        <p className="text-[10px] text-secondary font-bold uppercase tracking-widest pt-4 opacity-40">
          Neural Finance Protocol v4.0.1
        </p>
      </div>
    </div>
  );
}
