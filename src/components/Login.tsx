import React, { useState } from "react";
import { LogIn, Loader2, AlertCircle, Mail, Lock, UserPlus } from "lucide-react";
import { loginWithEmail, registerWithEmail } from "../lib/firebase";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (isRegistering) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      console.error("Erro de autenticação:", err);
      
      if (err.code === 'auth/invalid-credential') {
        setError("E-mail ou senha incorretos.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("Este e-mail já está em uso.");
      } else if (err.code === 'auth/weak-password') {
        setError("A senha deve ter pelo menos 6 caracteres.");
      } else if (err.code === 'auth/invalid-email') {
        setError("E-mail inválido.");
      } else {
        setError("Falha na operação: " + (err.message || "Erro desconhecido"));
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
            <h1 className="text-3xl font-black italic text-white tracking-tighter">I<span className="text-primary not-italic">.</span></h1>
          </div>
          <h2 className="text-2xl md:text-3xl font-light text-white tracking-tight text-center uppercase">
            {isRegistering ? "Nova Conta" : "BEM-VINDO ITALIK"}
          </h2>
          <p className="text-sm text-secondary font-medium px-4">
            {isRegistering ? "Crie seu acesso exclusivo." : "Sua central de gastos."}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-[11px] font-bold text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl animate-shake">
            <AlertCircle size={14} className="shrink-0" />
            <span className="text-left">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 text-left">
            <div className="relative group/input">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within/input:text-primary transition-colors" size={16} />
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-secondary text-sm focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
            <div className="relative group/input">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within/input:text-primary transition-colors" size={16} />
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-secondary text-sm focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-black h-14 rounded-2xl font-black text-xs tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98] transition-all glow-cyan disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : isRegistering ? (
              <UserPlus size={18} />
            ) : (
              <LogIn size={18} />
            )}
            {loading ? 'Processando...' : isRegistering ? 'Criar Conta' : 'Entrar'}
          </button>
        </form>

        <div className="pt-2">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-[10px] text-secondary font-bold uppercase tracking-widest hover:text-white transition-colors"
          >
            {isRegistering ? "Já tenho uma conta" : "Não tem conta? Cadastre-se"}
          </button>
        </div>
      </div>
    </div>
  );
}
