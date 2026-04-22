import React from "react";
import { 
  Search, 
  ChevronDown, 
  Edit2, 
  Trash2,
  Eye,
  Utensils,
  Car,
  Home,
  UtensilsCrossed,
  ShoppingBag,
  Dumbbell,
  Tag as TagIcon,
  AlertTriangle,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Category, Transaction } from "../types";
import { useApp } from "../context/AppContext";
import ExpenseModal from "./ExpenseModal";

export default function Transactions() {
  const { transactions, categories, deleteTransaction } = useApp();
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("Todas");
  const [editingTransaction, setEditingTransaction] = React.useState<Transaction | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);
  const [viewingReceipt, setViewingReceipt] = React.useState<string | null>(null);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Alimentação": return <Utensils size={20} />;
      case "Transporte": return <Car size={20} />;
      case "Moradia": return <Home size={20} />;
      case "Lazer": return <UtensilsCrossed size={20} />;
      case "Saúde": return <Dumbbell size={20} />;
      default: return <ShoppingBag size={20} />;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      setConfirmDeleteId(null);
    } catch (error: any) {
      alert("Erro ao excluir transação: " + (error.message || "Tente novamente mais tarde"));
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "Todas" || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group by date
  const grouped = filteredTransactions.reduce((acc, t) => {
    if (!acc[t.date]) acc[t.date] = [];
    acc[t.date].push(t);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6 md:space-y-10 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors" size={18} md:size={20} />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome..."
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 md:py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium placeholder:text-secondary/50 group-focus-within:border-white/10"
          />
        </div>

        <div className="relative">
          <TagIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" size={18} />
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 md:py-4 pl-12 pr-10 text-white focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium appearance-none"
          >
            <option value="Todas" className="bg-[#020408]">Todas Categorias</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name} className="bg-[#020408]">{cat.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" size={16} />
        </div>
      </div>

      <div className="space-y-8 md:space-y-12">
        {sortedDates.map((date) => (
          <div key={date}>
            <h3 className="text-[9px] md:text-[10px] font-black text-secondary uppercase tracking-[0.2em] md:tracking-[0.3em] mb-4 md:mb-6 px-2 md:px-4 flex items-center gap-2 md:gap-3">
              <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-primary glow-cyan" />
              {new Date(date).toLocaleDateString("pt-BR", { day: '2-digit', month: 'long', year: 'numeric' })}
            </h3>
            <div className="space-y-3 md:space-y-4">
              {grouped[date].map((t) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={t.id} 
                  className="glass p-4 md:p-5 flex items-center justify-between group relative border-white/5 hover:border-white/10 hover:bg-white/5 transition-all"
                >
                  <div className="flex items-center gap-3 md:gap-5">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/3 rounded-full flex items-center justify-center text-secondary border border-white/5 group-hover:text-primary transition-colors group-hover:border-primary/20 shrink-0">
                      {getCategoryIcon(t.category)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-white tracking-tight text-sm truncate uppercase">{t.description}</p>
                      <div className="flex items-center gap-1.5 md:gap-2 mt-1">
                        <span className="text-[8px] md:text-[9px] font-black text-secondary uppercase tracking-[0.1em] md:tracking-[0.15em]">
                          {t.category}
                        </span>
                        <span className="w-0.5 h-0.5 md:w-1 md:h-1 rounded-full bg-white/20" />
                        <span className="hidden sm:inline-block text-[8px] md:text-[9px] font-black text-secondary uppercase tracking-[0.1em] md:tracking-[0.15em]">
                          Confirmado
                        </span>
                      </div>
                    </div>
                  </div>
                    <div className="flex items-center gap-4 md:gap-8">
                      <span className="font-light text-white text-base md:text-lg tracking-tighter whitespace-nowrap">
                        {t.type === "expense" ? "- " : "+ "}R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <div className="flex gap-2 transition-all">
                        {t.receiptUrl && (
                          <button 
                            onClick={() => setViewingReceipt(t.receiptUrl!)}
                            className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-primary/10 rounded-lg text-primary hover:bg-primary/20 border border-primary/20 transition-all active:scale-95 translate-x-1"
                          >
                            <Eye size={14} />
                          </button>
                        )}
                        <button 
                          onClick={() => setEditingTransaction(t)}
                          className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-white/5 rounded-lg text-secondary hover:text-primary hover:bg-white/10 border border-white/5 transition-all active:scale-95 translate-x-1"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => setConfirmDeleteId(t.id)}
                          className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-white/5 rounded-lg text-secondary hover:text-error hover:bg-white/10 border border-white/5 transition-all active:scale-95 translate-x-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {sortedDates.length === 0 && (
          <div className="text-center py-16 md:py-24 glass border-dashed">
            <ShoppingBag size={40} md:size={48} className="mx-auto text-white/5 mb-4 md:mb-6" />
            <p className="text-secondary font-black uppercase tracking-[0.2em] text-[9px] md:text-[10px]">Nenhum registro encontrado</p>
          </div>
        )}
      </div>

      <ExpenseModal 
        isOpen={!!editingTransaction} 
        onClose={() => setEditingTransaction(null)} 
        categories={categories}
        initialData={editingTransaction || undefined}
      />

      {/* Receipt Viewer Overlay */}
      <AnimatePresence>
        {viewingReceipt && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center px-4 p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              onClick={() => setViewingReceipt(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 max-w-2xl w-full flex flex-col items-center gap-6"
            >
              <div className="w-full flex justify-end">
                <button 
                  onClick={() => setViewingReceipt(null)}
                  className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl text-white hover:bg-white/10 border border-white/10 transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="w-full glass p-2 rounded-[32px] overflow-hidden border-white/10">
                <img 
                  src={viewingReceipt} 
                  alt="Comprovante" 
                  className="w-full h-auto max-h-[70vh] object-contain rounded-[24px]" 
                />
              </div>
              <p className="text-secondary font-black uppercase tracking-[0.3em] text-[10px]">Visualização do Comprovante</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Overlay */}
      <AnimatePresence>
        {confirmDeleteId && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setConfirmDeleteId(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass p-8 max-w-sm w-full relative z-10 border-error/20 bg-error/5 text-center space-y-6"
            >
              <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(248,113,113,0.2)]">
                <AlertTriangle size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-light text-primary">Atenção!</h3>
                <p className="text-sm text-secondary leading-relaxed">
                  Tem certeza que deseja excluir esta transação? Esta ação é irreversível e removerá o registro permanentemente.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => handleDelete(confirmDeleteId)}
                  className="w-full py-3 bg-error text-white font-black text-[10px] tracking-widest rounded-xl hover:opacity-90 active:scale-95 transition-all uppercase"
                >
                  Excluir Transação
                </button>
                <button 
                  onClick={() => setConfirmDeleteId(null)}
                  className="w-full py-3 bg-white/5 text-white font-bold text-[10px] tracking-widest rounded-xl hover:bg-white/10 transition-all uppercase border border-white/5"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
