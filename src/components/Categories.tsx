import React from "react";
import { Plus, Trash2, Edit2, Check, X, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CategoryItem } from "../types";

interface CategoriesProps {
  categories: CategoryItem[];
  onAdd: (name: string) => void;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export default function Categories({ categories, onAdd, onUpdate, onDelete }: CategoriesProps) {
  const [isAdding, setIsAdding] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editName, setEditName] = React.useState("");
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);

  const handleAdd = () => {
    if (newName.trim()) {
      onAdd(newName.trim());
      setNewName("");
      setIsAdding(false);
    }
  };

  const handleUpdate = (id: string) => {
    if (editName.trim()) {
      onUpdate(id, editName.trim());
      setEditingId(null);
    }
  };

  const startEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  return (
    <div className="space-y-6 md:space-y-10 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-white tracking-tight">Gerenciar Categorias</h2>
          <p className="text-xs text-secondary font-medium mt-1">Adicione, edite ou remova categorias do seu console.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest hover:bg-primary/20 transition-all glow-cyan uppercase"
        >
          <Plus size={14} />
          Nova Categoria
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass p-4 border-primary/30 flex items-center gap-4 glow-cyan"
            >
              <input 
                autoFocus
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nome da categoria..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:ring-1 focus:ring-primary/50 outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
              <div className="flex items-center gap-2">
                <button onClick={handleAdd} className="w-10 h-10 flex items-center justify-center bg-primary text-on-primary rounded-xl hover:opacity-90 transition-all shadow-lg active:scale-95">
                  <Check size={18} />
                </button>
                <button onClick={() => setIsAdding(false)} className="w-10 h-10 flex items-center justify-center bg-white/5 text-secondary rounded-xl hover:text-white transition-all">
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {categories.map((cat) => (
            <motion.div
              layout
              key={cat.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass p-4 flex items-center justify-between group hover:bg-white/5 transition-all border-white/5 cursor-default select-none outline-none"
            >
              {editingId === cat.id ? (
                <div className="flex-1 flex items-center gap-4">
                  <input 
                    autoFocus
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:ring-1 focus:ring-primary/50 outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdate(cat.id)}
                  />
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleUpdate(cat.id)} className="w-9 h-9 flex items-center justify-center bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-all">
                      <Check size={16} />
                    </button>
                    <button onClick={() => setEditingId(null)} className="w-9 h-9 flex items-center justify-center bg-white/5 text-secondary rounded-lg hover:text-white transition-all">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                    <span className="text-white font-light text-sm tracking-tight">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={() => startEdit(cat)}
                      className="w-9 h-9 flex items-center justify-center bg-white/5 text-secondary hover:text-primary hover:bg-white/10 rounded-lg transition-all"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => setConfirmDeleteId(cat.id)}
                      className="w-9 h-9 flex items-center justify-center bg-white/5 text-secondary hover:text-error hover:bg-white/10 rounded-lg transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

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
                  Tem certeza que deseja excluir esta categoria? As transações vinculadas a ela não serão excluídas, mas perderão a classificação.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    onDelete(confirmDeleteId);
                    setConfirmDeleteId(null);
                  }}
                  className="w-full py-3 bg-error text-white font-black text-[10px] tracking-widest rounded-xl hover:opacity-90 active:scale-95 transition-all uppercase"
                >
                  Excluir Categoria
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
