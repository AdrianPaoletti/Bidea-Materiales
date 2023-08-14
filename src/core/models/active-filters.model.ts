import { SelectedResourcesCategories } from "./selected-resources-categories.model";

export interface ActiveFilters {
  categories: SelectedResourcesCategories[];
  nameDescription: string;
  refference: string;
}

export type ActiveFiltersValues = ActiveFilters[keyof ActiveFilters];
