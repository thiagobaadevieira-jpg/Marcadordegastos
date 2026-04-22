import React from "react";
import { FileText, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Reports() {
  const { transactions } = useApp();
  const [isExporting, setIsExporting] = React.useState(false);
  const [dateDe, setDateDe] = React.useState(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`);
  const [dateAte, setDateAte] = React.useState(new Date().toISOString().split('T')[0]);

  const filteredTransactions = transactions.filter(t => 
    t.date >= dateDe && t.date <= dateAte && t.type === 'expense'
  );

  const totalAmount = filteredTransactions.reduce((acc, curr) => acc + curr.amount, 0);
  const totalCount = filteredTransactions.length;

  // Category summary dynamic
  const categoryMap = new Map<string, number>();
  filteredTransactions.forEach(t => {
    categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
  });

  const categorySummaries = Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  const exportToPDF = async () => {
    if (filteredTransactions.length === 0) return;
    
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(2, 4, 8); // Dark color
      doc.text("Relatorio Financeiro - AETHER", 15, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Periodo: ${new Date(dateDe).toLocaleDateString('pt-BR')} ate ${new Date(dateAte).toLocaleDateString('pt-BR')}`, 15, 30);
      
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`Resumo Total: R$ ${totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 15, 45);
      doc.text(`Total de Registros: ${totalCount}`, 15, 52);

      // Category Summary Table
      autoTable(doc, {
        startY: 65,
        head: [['Categoria', 'Valor (R$)', 'Percentual (%)']],
        body: categorySummaries.map(cat => [
          cat.category, 
          cat.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }), 
          `${cat.percentage.toFixed(1)}%`
        ]),
        theme: 'striped',
        headStyles: { fillColor: [0, 242, 255], textColor: [0, 0, 0] },
      });

      // Transactions Table
      doc.addPage();
      doc.setFontSize(16);
      doc.text("Detalhamento de Transacoes", 15, 20);
      
      autoTable(doc, {
        startY: 30,
        head: [['Data', 'Descricao', 'Categoria', 'Valor (R$)']],
        body: filteredTransactions.map(t => [
          new Date(t.date).toLocaleDateString('pt-BR'),
          t.description,
          t.category,
          t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
        ]),
        theme: 'grid',
        headStyles: { fillColor: [2, 4, 8], textColor: [255, 255, 255] },
      });

      doc.save(`Relatorio_Aether_${dateDe}_${dateAte}.pdf`);
      window.alert("Relatório exportado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao exportar PDF:", error);
      window.alert("Erro ao gerar PDF: " + (error.message || "Tente novamente"));
    } finally {
      setIsExporting(false);
    }
  };

  // Monthly history dynamic
  const monthMap = new Map<string, number>();
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const monthKey = new Date(t.date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + t.amount);
    });

  const monthlyHistory = Array.from(monthMap.entries())
    .map(([month, amount]) => ({ month, amount: amount }));

  const getCategoryColor = (index: number) => {
    const colors = [
      "bg-indigo-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-red-500",
      "bg-emerald-500",
      "bg-blue-500",
      "bg-amber-500",
    ];
    return colors[index % colors.length];
  };

  const getMarkerColor = (index: number) => {
    const colors = [
      "bg-indigo-400",
      "bg-orange-400",
      "bg-pink-400",
      "bg-red-400",
      "bg-emerald-400",
      "bg-blue-400",
      "bg-amber-400",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-8 md:space-y-12 max-w-4xl mx-auto">
      <div className="space-y-1">
        <h2 className="text-3xl font-light text-white tracking-tight">Relatórios</h2>
        <p className="text-sm text-secondary font-medium">Analise seus gastos por período e exporte para PDF</p>
      </div>

      <div className="glass p-6 md:p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">De</label>
            <div className="relative">
              <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
              <input 
                type="date"
                value={dateDe}
                onChange={(e) => setDateDe(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all [color-scheme:dark]"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Até</label>
            <div className="relative">
              <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
              <input 
                type="date"
                value={dateAte}
                onChange={(e) => setDateAte(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all [color-scheme:dark]"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4 border-t border-white/5">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Total no período</p>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-white">R$</span>
              <span className="text-4xl font-light text-white tracking-tight">
                {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <p className="text-xs text-secondary font-medium">{totalCount} registros</p>
          </div>
          <button 
            onClick={exportToPDF}
            disabled={isExporting || totalCount === 0}
            className="flex items-center justify-center gap-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-6 py-3 rounded-xl text-[10px] font-black tracking-widest hover:bg-emerald-600/30 transition-all uppercase glow-emerald disabled:opacity-50 disabled:glow-none"
          >
            {isExporting ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
            {isExporting ? "Gerando..." : "Exportar PDF"}
          </button>
        </div>

        <div className="space-y-6 pt-6">
          <h3 className="text-[10px] font-black text-secondary uppercase tracking-widest">Por categoria</h3>
          <div className="space-y-6">
            {categorySummaries.map((item, index) => (
              <div key={item.category} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${getMarkerColor(index)}`} />
                    <span className="text-sm font-light text-white tracking-tight">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-white">R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    <span className="text-xs text-secondary ml-2">({item.percentage.toFixed(1)}%)</span>
                  </div>
                </div>
                <div className="h-1 text-xs flex rounded-full bg-white/5 overflow-hidden">
                  <div 
                    style={{ width: `${item.percentage}%` }} 
                    className={`flex flex-col text-center whitespace-nowrap text-white justify-center ${getCategoryColor(index)} transition-all duration-500`} 
                  />
                </div>
              </div>
            ))}
            {categorySummaries.length === 0 && (
              <div className="py-12 text-center text-secondary text-xs uppercase tracking-widest opacity-40">
                Nenhum dado para o período selecionado
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="glass p-6 md:p-8 space-y-6">
        <h3 className="text-[10px] font-black text-secondary uppercase tracking-widest">Histórico mensal</h3>
        <div className="space-y-4">
          {monthlyHistory.map((item) => (
            <div key={item.month} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 group hover:bg-white/3 transition-all px-2 -mx-2 rounded-lg">
              <span className="text-sm font-light text-white uppercase tracking-tight">{item.month}</span>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-white tracking-tight">R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                <ArrowRight size={14} className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
          {monthlyHistory.length === 0 && (
             <div className="py-8 text-center text-secondary text-xs uppercase tracking-widest opacity-40">
              Nenhum dado histórico disponível
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
