import { LoadedResourcesTableRow } from "resources-management/components/LoadedResourcesList/LoadedResourcesTable/loaded-resources-table.model";
import { ReturnsTableRow } from "resources-management/components/Returns/ReturnsTable/returns-table.model";
import { ActiveFiltersValues } from "resources-management/core/models/active-filters.model";

export interface LoadedResourcesReturnsFilters {
  id: string;
  filterAction: (
    activeFilter: ActiveFiltersValues
  ) => (row: ReturnsTableRow | LoadedResourcesTableRow) => boolean | undefined;
}
