import { Account } from "./account.interface";
import { budget } from "./budget.interface";

export interface launch {
  id: number;
  description: string;
  budgetId: number;
  budget: budget;
  account: Account;
  accountId: number;
  day: Date;
  valuePrev: number;
  valueExec: number;
  typeLaunch: string;
  active: boolean;
}
