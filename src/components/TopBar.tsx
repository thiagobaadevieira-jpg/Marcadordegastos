import React from "react";
import { Bell, Search, Plus, Menu } from "lucide-react";

interface TopBarProps {
  title: string;
  onAddClick: () => void;
  onMenuClick: () => void;
}

export default function TopBar({ title, onAddClick, onMenuClick }: TopBarProps) {
  return (
    <header className="fixed top-0 right-0 w-full md:w-[calc(100%-220px)] h-20 z-40 bg-black/5 backdrop-blur-xl border-b border-white/5 flex justify-between items-center px-6 md:px-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden w-10 h-10 flex items-center justify-center text-secondary hover:text-white bg-white/5 rounded-xl border border-white/5"
        >
          <Menu size={20} />
        </button>
        <div>
          <h2 className="text-xl md:text-3xl font-extralight text-white tracking-tight">{title}</h2>
          <p className="hidden md:block text-[10px] text-secondary font-bold uppercase tracking-[0.2em] mt-1">Sistema operando em Alta Performance</p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <button 
          onClick={onAddClick}
          className="flex items-center gap-2 bg-primary text-on-primary px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs font-black shadow-[0_0_20px_rgba(0,242,255,0.2)] hover:opacity-90 active:scale-95 transition-all glow-cyan"
        >
          <Plus size={16} strokeWidth={3} />
          <span className="hidden sm:inline tracking-widest">ADICIONAR</span>
        </button>
        
        <div className="hidden sm:block h-8 w-px bg-white/10 mx-1" />
        
        <div className="hidden sm:block text-right">
          <div className="text-xl font-light text-white tracking-tighter">
            {new Date().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit', hour12: false })}
          </div>
          <div className="text-[9px] text-secondary font-bold uppercase tracking-widest leading-none">
            {new Date().toLocaleDateString("pt-BR", { month: 'short', day: '2-digit', year: 'numeric' })}
          </div>
        </div>

        <button className="w-10 h-10 flex items-center justify-center text-secondary hover:text-white hover:bg-white/5 rounded-xl transition-all relative group">
          <Bell size={20} className="group-active:scale-90 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full glow-cyan" />
        </button>
      </div>
    </header>
  );
}
