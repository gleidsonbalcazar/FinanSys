export interface BudgetIndicator{
  label:string;
  data: MonthValue[];
  averageValue:number;
}

export class MonthValue {
  month:number;
  monthDesc:string;
  value: number;
}

