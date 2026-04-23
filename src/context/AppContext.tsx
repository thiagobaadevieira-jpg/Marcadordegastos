import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy,
  serverTimestamp,
  setDoc
} from "firebase/firestore";
import { auth, db, handleFirestoreError } from "../lib/firebase";
import { CategoryItem, Transaction } from "../types";

interface AppContextType {
  user: User | null;
  loading: boolean;
  categories: CategoryItem[];
  transactions: Transaction[];
  addCategory: (name: string) => Promise<void>;
  updateCategory: (id: string, name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      setCategories([]);
      setTransactions([]);
      return;
    }

    const qCategories = query(
      collection(db, "categories"),
      where("userId", "==", user.uid)
    );
    const unsubCategories = onSnapshot(qCategories, (snapshot) => {
      const cats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CategoryItem[];
      setCategories(cats);
    }, (error) => {
      console.error("Categories Subscription Error:", error);
      if (error.message.includes("index")) {
        window.alert("O banco de dados precisa de um índice. Verifique o console do desenvolvedor.");
      }
    });

    const qTransactions = query(
      collection(db, "transactions"),
      where("userId", "==", user.uid),
      orderBy("date", "desc"),
      orderBy("createdAt", "desc")
    );
    const unsubTransactions = onSnapshot(qTransactions, (snapshot) => {
      const trans = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      setTransactions(trans);
    }, (error) => {
      console.error("Transactions Subscription Error:", error);
      if (error.message.includes("index")) {
        window.alert("IMPORTANTE: Clique no link gerado no console para habilitar a listagem de gastos.");
      }
    });

    return () => {
      unsubCategories();
      unsubTransactions();
    };
  }, [user]);

  const addCategory = async (name: string) => {
    if (!user) return;
    try {
      const id = doc(collection(db, "categories")).id;
      await setDoc(doc(db, "categories", id), {
        userId: user.uid,
        name
      });
    } catch (error) {
      handleFirestoreError(error, 'create', '/categories');
    }
  };

  const updateCategory = async (id: string, name: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "categories", id), { name });
    } catch (error) {
      handleFirestoreError(error, 'update', `/categories/${id}`);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "categories", id));
    } catch (error) {
      handleFirestoreError(error, 'delete', `/categories/${id}`);
    }
  };

  const addTransaction = async (t: Omit<Transaction, 'id'>) => {
    if (!user) return;
    try {
      const id = doc(collection(db, "transactions")).id;
      await setDoc(doc(db, "transactions", id), {
        ...t,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, 'create', '/transactions');
    }
  };

  const updateTransaction = async (id: string, t: Partial<Transaction>) => {
    if (!user) {
      window.alert("Usuário não autenticado");
      return;
    }
    try {
      console.log("Updating transaction:", id, t);
      await updateDoc(doc(db, "transactions", id), {
        ...t,
        updatedAt: serverTimestamp()
      });
      console.log("Transaction updated successfully");
    } catch (error: any) {
      console.error("Update Transaction Error:", error);
      window.alert("ERRO NA EDIÇÃO: " + (error.code || error.message || "Erro desconhecido"));
      handleFirestoreError(error, 'update', `/transactions/${id}`);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) {
      window.alert("Usuário não autenticado");
      return;
    }
    try {
      console.log("Deleting transaction:", id);
      const docRef = doc(db, "transactions", id);
      await deleteDoc(docRef);
      console.log("Transaction deleted successfully");
    } catch (error: any) {
      console.error("Delete Transaction Error:", error);
      window.alert("ERRO NA EXCLUSÃO: " + (error.code || error.message || "Erro desconhecido"));
      handleFirestoreError(error, 'delete', `/transactions/${id}`);
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      loading, 
      categories, 
      transactions,
      addCategory,
      updateCategory,
      deleteCategory,
      addTransaction,
      updateTransaction,
      deleteTransaction
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
