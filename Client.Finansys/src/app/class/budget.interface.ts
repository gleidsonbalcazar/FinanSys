import { BudgetWord } from "./budgetWord.interface";

export interface budget {
  id?: number;
  description: string;
  value: number;
  month: number;
  typeBudget: string;
  active: boolean;
  default:boolean;
  averageValue: number;
  budgetWords:BudgetWord[]
}

