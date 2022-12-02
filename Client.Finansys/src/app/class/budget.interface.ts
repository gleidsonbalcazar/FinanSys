import { BudgetConfig } from "./budgetConfig.interface";
import { BudgetWord } from "./budgetWord.interface";

export interface budget {
  id?: number;
  description: string;
  value: number;
  typeBudget: string;
  active: boolean;
  averageValue: number;
  budgetWords:BudgetWord[],
  budgetConfig:BudgetConfig[]
}

