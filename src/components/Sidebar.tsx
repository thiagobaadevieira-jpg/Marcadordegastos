import React from "react";
import { 
  LayoutDashboard, 
  BarChart3, 
  ReceiptText, 
  Tag, 
  Image,
  ChevronRight
} from "lucide-react";
import { motion } from "motion/react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ activeTab, onTabChange, isOpen, onClose }: SidebarProps) {
  const navItems = [
    { id: "dashboard", label: "Painel Geral", icon: LayoutDashboard },
    { id: "reports", label: "Relatórios", icon: BarChart3 },
    { id: "transactions", label: "Transações", icon: ReceiptText },
    { id: "categories", label: "Categorias", icon: Tag },
    { id: "receipts", label: "Comprovantes", icon: Image },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden" 
          onClick={onClose}
        />
      )}

      <aside className={`w-[220px] h-full fixed left-0 bg-black/40 backdrop-blur-2xl border-r border-white/5 flex flex-col py-8 z-[60] transition-transform duration-300 transform md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-8 mb-12">
          <h1 className="text-2xl font-black italic tracking-tighter text-white">ITALIK<span className="text-primary not-italic">.</span></h1>
        </div>

        <nav className="flex-1 space-y-2 px-4 shadow-[inset_0_-20px_20px_-20px_rgba(0,0,0,0.5)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group ${
                  isActive 
                    ? "text-white bg-white/5 active-glow" 
                    : "text-secondary hover:text-white hover:bg-white/5"
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full transition-all ${isActive ? "bg-primary glow-cyan" : "bg-white/20 group-hover:bg-white/40"}`} />
                <span className="font-medium text-sm tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="px-8 mt-auto" />
      </aside>
    </>
  );
}
