export interface ImportBank{
  description:string,
  dateLaunch: Date,
  prospectiveBudgetId?: number,
  prospectiveLoaded: boolean,
  typeLaunch: string,
  valueLaunch: number
  selectedToImport?: boolean
}
