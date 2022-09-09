import { SortColumn, SortDirection } from "../core/directives/sort/sortable.directive";

export interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}
