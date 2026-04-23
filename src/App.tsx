/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Login from "./components/Login";
import ExpenseModal from "./components/ExpenseModal";
import { useApp } from "./context/AppContext";
import { motion, AnimatePresence } from "motion/react";

// Lazy loading components for better performance
const Dashboard = lazy(() => import("./components/Dashboard"));
const Transactions = lazy(() => import("./components/Transactions"));
const Categories = lazy(() => import("./components/Categories"));
const Reports = lazy(() => import("./components/Reports"));
const Receipts = lazy(() => import("./components/Receipts"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
    <span className="text-secondary text-[10px] font-bold uppercase tracking-widest">Carregando Módulo...</span>
  </div>
);

export default function App() {
  const { user, loading, categories, addCategory, updateCategory, deleteCategory } = useApp();
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020408]">
        <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin glow-cyan" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    return (
      <Suspense fallback={<PageLoader />}>
        {(() => {
          switch (activeTab) {
            case "dashboard":
              return <Dashboard />;
            case "reports":
              return <Reports />;
            case "transactions":
              return <Transactions />;
            case "categories":
              return (
                <Categories 
                  categories={categories} 
                  onAdd={addCategory} 
                  onUpdate={updateCategory} 
                  onDelete={deleteCategory} 
                />
              );
            case "receipts":
              return <Receipts />;
            default:
              return (
                <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-secondary mb-6 active-glow">
                    <span className="text-4xl">🚧</span>
                  </div>
                  <h3 className="text-xl font-light text-white tracking-tight">Em desenvolvimento</h3>
                  <p className="text-secondary text-sm font-medium mt-2">Esta funcionalidade estará disponível em breve no seu console.</p>
                </div>
              );
          }
        })()}
      </Suspense>
    );
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case "dashboard": return "Painel Geral";
      case "reports": return "Relatórios";
      case "transactions": return "Transações";
      case "categories": return "Categorias";
      case "receipts": return "Comprovantes";
      default: return "ITALIK";
    }
  };

  return (
    <div className="min-h-screen bg-[#020408]">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className={`min-h-screen transition-all duration-300 ${isSidebarOpen ? 'blur-sm md:blur-none' : ''} md:ml-[220px]`}>
        <TopBar 
          title={getPageTitle()} 
          onAddClick={() => setIsModalOpen(true)} 
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        
        <div className="pt-24 pb-12 px-4 md:px-10 max-w-[1200px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <ExpenseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        categories={categories}
      />
    </div>
  );
}
