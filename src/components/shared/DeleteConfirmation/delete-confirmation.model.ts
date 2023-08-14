import {
  LoadedResourcesTableColumn,
  LoadedResourcesTableRow,
} from "resources-management/components/LoadedResourcesList/LoadedResourcesTable/loaded-resources-table.model";
import {
  PreloadedResoucesTableColumn,
  PreLoadedResourcesTableRow,
} from "resources-management/components/PreloadedResources/PreloadedResourcesTable/preloaded-resources-table.model";

export type Row = LoadedResourcesTableRow & PreLoadedResourcesTableRow;
export type Columns = LoadedResourcesTableColumn[] &
  PreloadedResoucesTableColumn[];
