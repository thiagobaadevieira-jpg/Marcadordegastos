import React from "react";
import { 
  Calendar,
  ChevronRight,
  Clock,
  CalendarRange,
  History,
  ShoppingBag
} from "lucide-react";
import { motion } from "motion/react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart as RePieChart,
  Pie
} from "recharts";
import { useApp } from "../context/AppContext";

export default function Dashboard() {
  const { transactions } = useApp();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Calculate summaries
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);
  
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const spentToday = transactions
    .filter(t => t.date === todayStr && t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const spentLast7Days = transactions
    .filter(t => new Date(t.date) >= sevenDaysAgo && t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const spentThisMonth = transactions
    .filter(t => new Date(t.date) >= firstOfMonth && t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  // Category Distribution
  const categoryMap = new Map<string, number>();
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
    });

  const totalExpenses = Array.from(categoryMap.values()).reduce((a, b) => a + b, 0);
  
  const categorySummaries = Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  const formatCurrency = (val: number) => {
    const parts = val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split(',');
    return { integer: parts[0], decimal: parts[1] };
  };

  const todayParsed = formatCurrency(spentToday);
  const sevenDaysParsed = formatCurrency(spentLast7Days);
  const monthParsed = formatCurrency(spentThisMonth);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 md:space-y-8"
    >
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <motion.div variants={itemVariants} className="glass p-5 md:p-6 flex flex-col glow-cyan min-h-[120px] md:min-h-[140px] justify-center text-center items-center">
          <div>
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-[9px] md:text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Gastos Hoje</span>
              <div className="p-1 bg-white/5 text-white rounded-lg border border-white/5">
                <Clock size={12} />
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-extralight text-white tracking-tighter italic">
              R$ {todayParsed.integer}<span className="text-lg md:text-xl text-secondary ml-1">.{todayParsed.decimal}</span>
            </h3>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass p-5 md:p-6 flex flex-col min-h-[120px] md:min-h-[140px] justify-center text-center items-center">
          <div>
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-[9px] md:text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Gastos Últimos 7 Dias</span>
              <div className="p-1 bg-white/5 text-white rounded-lg border border-white/5">
                <History size={12} />
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-extralight text-white tracking-tighter italic">
              R$ {sevenDaysParsed.integer}<span className="text-lg md:text-xl text-secondary ml-1">.{sevenDaysParsed.decimal}</span>
            </h3>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass p-5 md:p-6 flex flex-col min-h-[120px] md:min-h-[140px] sm:col-span-2 lg:col-span-1 justify-center text-center items-center">
          <div>
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-[9px] md:text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Gastos Este Mês</span>
              <div className="p-1 bg-white/5 text-white rounded-lg border border-white/5">
                <CalendarRange size={12} />
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-extralight text-white tracking-tighter italic">
              R$ {monthParsed.integer}<span className="text-lg md:text-xl text-secondary ml-1">.{monthParsed.decimal}</span>
            </h3>
          </div>
        </motion.div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <motion.div variants={itemVariants} className="glass p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg md:text-xl font-light text-white tracking-tight">Distribuição por Categoria</h4>
            <div className="px-3 py-1 bg-white/5 rounded-full text-[8px] md:text-[9px] font-bold text-secondary uppercase tracking-widest border border-white/5">
              Fim do Ciclo: {new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()} {now.toLocaleDateString('pt-BR', { month: 'short' })}
            </div>
          </div>
          
          <div className="h-[200px] md:h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={categorySummaries}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="amount"
                  nameKey="category"
                  stroke="none"
                >
                  {categorySummaries.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={[ "#00f2ff", "rgba(0, 242, 255, 0.4)", "rgba(255, 255, 255, 0.1)", "rgba(0, 242, 255, 0.15)", "rgba(255, 255, 255, 0.05)" ][index % 5]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(2, 4, 8, 0.9)', 
                    borderRadius: '16px', 
                    border: '1px solid rgba(255, 255, 255, 0.1)', 
                    boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#00f2ff' }}
                  formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pt-2 md:pt-4">
             {categorySummaries.map((cat, i) => (
               <div key={cat.category} className="space-y-1.5">
                 <div className="flex items-center justify-between">
                    <span className="text-[9px] md:text-[10px] font-bold text-secondary uppercase tracking-[0.1em]">{cat.category}</span>
                    <span className="text-[10px] md:text-[11px] font-light text-white">{cat.percentage}%</span>
                 </div>
                 <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.percentage}%` }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 + i * 0.1 }}
                      className="h-full rounded-full bg-primary glow-cyan"
                    />
                 </div>
               </div>
             ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg md:text-xl font-light text-white tracking-tight">Últimos Gastos</h4>
            <button className="text-[9px] md:text-[10px] font-bold text-primary uppercase tracking-widest hover:active-glow transition-all">Ver Todos</button>
          </div>
          
          <div className="space-y-2">
            {transactions.slice(0, 5).map((item, idx) => (
              <div key={item.id} className="p-3 md:p-4 rounded-xl flex items-center justify-between group cursor-default hover:bg-white/5 border border-transparent hover:border-white/5 transition-all">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors ${idx === 0 ? "bg-primary/20 text-primary glow-cyan border border-primary/20" : "bg-white/5 text-secondary border border-white/5 group-hover:text-white"}`}>
                    <ShoppingBag size={16} md:size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-white text-xs md:text-sm tracking-tight">{item.description}</p>
                    <p className="text-[8px] md:text-[10px] text-secondary font-bold uppercase tracking-widest leading-none mt-1">{item.category} • {new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-light text-white text-base md:text-lg tracking-tighter">R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="py-8 text-center text-secondary text-xs uppercase tracking-widest opacity-40">
                Nenhuma transação registrada
              </div>
            )}
          </div>
        </motion.div>
      </section>

    </motion.div>
  );
}
