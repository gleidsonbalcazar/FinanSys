import { Account } from "./account.interface";
import { Budget } from "./budget.class";

export interface launch {
  id: number;
  description: string;
  budgetId: number;
  budget: Budget;
  account: Account;
  accountId: number;
  day: Date;
  valuePrev: number;
  valueExec: number;
  typeLaunch: string;
  active: boolean;
}
