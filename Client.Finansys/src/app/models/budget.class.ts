import { BudgetConfig } from "./budgetConfig.interface";
import { BudgetWord } from "./budgetWord.interface";

export class Budget {
  public id?: number;
  public description: string;
  public typeBudget: string;
  public active: boolean;
  public averageValue: number;
  public budgetWords:BudgetWord[];
  public budgetConfig:BudgetConfig[]

  constructor(data: Partial<Budget>) {
    Object.assign(this, data);
  }
}

