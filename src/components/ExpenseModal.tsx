import React from "react";
import { 
  X, 
  Calendar as CalendarIcon, 
  Tag, 
  ShoppingBag,
  Camera,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Category, CategoryItem, Transaction } from "../types";

import { useApp } from "../context/AppContext";

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryItem[];
  initialData?: Transaction;
}

export default function ExpenseModal({ isOpen, onClose, categories, initialData }: ExpenseModalProps) {
  const { addTransaction, updateTransaction } = useApp();
  const [value, setValue] = React.useState("0,00");
  const [description, setDescription] = React.useState("");
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = React.useState<Category>("");
  const [receipt, setReceipt] = React.useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setValue(initialData.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
        setDescription(initialData.description);
        setDate(initialData.date);
        setCategory(initialData.category);
        setReceipt(initialData.receiptUrl);
      } else {
        setValue("0,00");
        setDescription("");
        setDate(new Date().toISOString().split('T')[0]);
        setReceipt(undefined);
        if (categories.length > 0) {
          setCategory(categories[0].name);
        }
      }
    }
  }, [isOpen, initialData, categories]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceipt(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (!rawValue || rawValue === "000") {
      setValue("0,00");
      return;
    }
    
    // Remove leading zeros
    const cleanValue = rawValue.replace(/^0+/, "");
    const paddedValue = cleanValue.padStart(3, "0");
    const formatted = paddedValue.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "," + paddedValue.slice(-2);
    setValue(formatted);
  };

  const handleConfirm = async () => {
    if (!description || value === "0,00" || !category) return;
    
    setIsSubmitting(true);
    try {
      const numericValue = parseFloat(value.replace(/\./g, "").replace(",", "."));
      const data = {
        description,
        amount: numericValue,
        date,
        category,
        type: "expense" as const,
        receiptUrl: receipt
      };

      if (initialData) {
        await updateTransaction(initialData.id, data);
      } else {
        await addTransaction(data);
      }
      
      onClose();
    } catch (error) {
      console.error("Error saving transaction:", error);
      // Optional: Add user-facing error message here if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-[#020408] ios-blur rounded-t-[40px] border-t border-white/10 shadow-2xl overflow-hidden flex flex-col max-w-2xl mx-auto h-[92dvh] md:h-auto md:max-h-[85vh]"
          >
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-4 shrink-0" />
            
            <header className="px-6 md:px-10 py-6 md:py-8 flex justify-between items-center shrink-0">
              <h2 className="text-2xl md:text-3xl font-extralight text-white tracking-tighter">
                {initialData ? "Editar" : "Nova"} Entrada<span className="text-primary active-glow">.</span>
              </h2>
              <button 
                onClick={onClose}
                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group"
              >
                <X size={20} md:size={24} className="text-secondary group-hover:text-white transition-colors" />
              </button>
            </header>

            <div className="px-6 md:px-10 pb-8 md:pb-12 overflow-y-auto hide-scrollbar flex-1">
              <div className="flex flex-col items-center mb-10 md:mb-16">
                <span className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-4 md:mb-6">Valor da Transação</span>
                <div className="relative w-full max-w-xs flex items-center justify-center">
                  <span className="text-xl md:text-2xl font-light text-primary active-glow absolute left-0">R$</span>
                  <input 
                    type="text"
                    inputMode="numeric"
                    value={value}
                    onChange={handleInputChange}
                    autoFocus
                    className="w-full bg-transparent text-4xl md:text-6xl font-extralight tracking-tighter text-center text-primary active-glow border-none focus:ring-0 outline-none pr-0 pl-10"
                  />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-px bg-white/20" />
                </div>
              </div>

              <div className="space-y-6 md:space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-2 md:mb-3 ml-1">Descrição do Objeto</label>
                  <div className="relative">
                    <ShoppingBag size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary" />
                    <input 
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Título da transação..."
                      className="w-full h-12 md:h-14 bg-white/3 border border-white/5 rounded-2xl pl-14 pr-4 text-white font-light focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-secondary/30 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-2 md:mb-3 ml-1">Data do Ciclo</label>
                    <div className="relative">
                      <CalendarIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
                      <input 
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full h-12 md:h-14 bg-white/3 border border-white/5 rounded-2xl pl-14 pr-4 text-white font-light focus:ring-2 focus:ring-primary/20 transition-all [color-scheme:dark] text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-2 md:mb-3 ml-1">Categoria</label>
                    <div className="relative">
                      <Tag size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full h-12 md:h-14 bg-white/3 border border-white/5 rounded-2xl pl-14 pr-10 text-white font-light focus:ring-2 focus:ring-primary/20 appearance-none transition-all text-sm"
                      >
                        {categories.map(c => <option key={c.id} value={c.name} className="bg-[#020408] text-white">{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-2 md:mb-3 ml-1">Anexar Comprovante</label>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                  />
                  {!receipt ? (
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-24 md:h-32 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 text-secondary hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all"
                    >
                      <Camera size={24} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Tirar Foto ou Galeria</span>
                    </button>
                  ) : (
                    <div className="relative group rounded-2xl overflow-hidden border border-white/10 aspect-video">
                      <img src={receipt} alt="Comprovante" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-primary/20 hover:text-primary transition-all"
                        >
                          <Camera size={18} />
                        </button>
                        <button 
                          type="button"
                          onClick={() => setReceipt(undefined)}
                          className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-error/20 hover:text-error transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
            </div>
          </div>

          <footer className="p-6 md:p-10 bg-white/1 backdrop-blur-md border-t border-white/5 flex gap-4 md:gap-6 shrink-0">
              <button 
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 h-14 rounded-2xl text-secondary font-bold text-[9px] md:text-[10px] tracking-[0.2em] hover:text-white hover:bg-white/5 transition-all active:scale-95 uppercase border border-transparent hover:border-white/5 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirm}
                disabled={isSubmitting || !description || value === "0,00"}
                className="flex-[2] h-14 rounded-2xl bg-primary text-on-primary font-black text-[9px] md:text-[10px] tracking-[0.2em] shadow-[0_0_20px_rgba(0,242,255,0.2)] hover:opacity-90 transition-all active:scale-95 glow-cyan uppercase disabled:opacity-50"
              >
                {isSubmitting ? "Gravando..." : "Confirmar"}
              </button>
            </footer>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
