export type Category = string;

export interface CategoryItem {
  id: string;
  name: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: Category;
  type: "expense" | "income";
  receiptUrl?: string; // Base64 string for this implementation
}

export interface CategorySummary {
  category: Category;
  amount: number;
  percentage: number;
  count: number;
}

export interface MonthlyHistory {
  month: string;
  amount: number;
  days: number;
  changePercent: number;
  label?: string;
}
