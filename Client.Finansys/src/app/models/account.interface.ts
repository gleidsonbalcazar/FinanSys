export interface Account {
  id: number;
  accountName: string;
  preferencialAccount: boolean;
  value?:number;
  lastUpdate?:Date
}
