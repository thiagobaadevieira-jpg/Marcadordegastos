import React from "react";
import { 
  Image as ImageIcon, 
  Search, 
  Eye, 
  Download, 
  X,
  Calendar,
  ShoppingBag
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../context/AppContext";
import { Transaction } from "../types";

export default function Receipts() {
  const { transactions } = useApp();
  const [search, setSearch] = React.useState("");
  const [viewingReceipt, setViewingReceipt] = React.useState<Transaction | null>(null);

  const receipts = transactions.filter(t => t.receiptUrl);
  
  const filteredReceipts = receipts.filter(t => 
    t.description.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const downloadReceipt = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-light text-white tracking-tight">Comprovantes</h2>
          <p className="text-sm text-secondary font-medium">Galeria de todos os comprovantes anexados às suas entradas.</p>
        </div>

        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por descrição..."
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium placeholder:text-secondary/50 group-focus-within:border-white/10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredReceipts.map((t) => (
          <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            key={t.id}
            className="glass group overflow-hidden border-white/5 hover:border-primary/20 transition-all flex flex-col"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-black/40">
              <img 
                src={t.receiptUrl} 
                alt={t.description} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button 
                  onClick={() => setViewingReceipt(t)}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-primary/20 hover:text-primary transition-all backdrop-blur-md border border-white/10"
                >
                  <Eye size={18} />
                </button>
                <button 
                  onClick={() => downloadReceipt(t.receiptUrl!, `comprovante_${t.description.replace(/\s+/g, '_')}.png`)}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-primary/20 hover:text-primary transition-all backdrop-blur-md border border-white/10"
                >
                  <Download size={18} />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium text-white text-sm truncate">{t.description}</p>
                <span className="text-xs font-light text-primary active-glow whitespace-nowrap">
                  R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-secondary">
                <div className="flex items-center gap-2">
                  <Calendar size={12} />
                  <span>{new Date(t.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingBag size={12} />
                  <span>{t.category}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredReceipts.length === 0 && (
          <div className="col-span-full py-24 text-center glass border-dashed">
            <ImageIcon size={48} className="mx-auto text-white/5 mb-6" />
            <p className="text-secondary font-black uppercase tracking-[0.2em] text-[10px]">
              {receipts.length === 0 ? "Nenhum comprovante anexado" : "Nenhum resultado encontrado"}
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {viewingReceipt && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center px-4 p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl"
              onClick={() => setViewingReceipt(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 max-w-3xl w-full flex flex-col items-center gap-6"
            >
              <div className="w-full flex items-center justify-between">
                <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-md">
                   <p className="text-white text-sm font-medium">{viewingReceipt.description}</p>
                   <p className="text-[10px] text-secondary font-bold uppercase tracking-widest leading-none mt-1">
                     R$ {viewingReceipt.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} • {new Date(viewingReceipt.date).toLocaleDateString('pt-BR')}
                   </p>
                </div>
                <button 
                  onClick={() => setViewingReceipt(null)}
                  className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl text-white hover:bg-white/10 border border-white/10 transition-all backdrop-blur-md shadow-2xl"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="w-full glass p-2 rounded-[32px] overflow-hidden border-white/10 shadow-[0_0_50px_rgba(0,0,0,1)]">
                <img 
                  src={viewingReceipt.receiptUrl} 
                  alt={viewingReceipt.description} 
                  className="w-full h-auto max-h-[80vh] object-contain rounded-[24px]" 
                />
              </div>
              <button 
                 onClick={() => downloadReceipt(viewingReceipt.receiptUrl!, `comprovante_${viewingReceipt.description}.png`)}
                 className="flex items-center gap-2 bg-primary px-8 py-3 rounded-2xl text-on-primary font-black text-[10px] tracking-widest hover:opacity-90 active:scale-95 transition-all uppercase glow-cyan"
              >
                <Download size={16} />
                Baixar Comprovante
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
