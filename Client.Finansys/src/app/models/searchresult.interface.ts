import { launch } from "./launch.interface";

export interface SearchResult {
  launchs: launch[];
  total: number;
}
