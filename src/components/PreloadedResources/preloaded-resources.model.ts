import { ResourceForBookingDTO } from "@ikusi/resources-management-api-typescript-fetch";

import { PreLoadedResourcesTableRow } from "./PreloadedResourcesTable/preloaded-resources-table.model";

export interface SelectedPreloadedResource {
  categoryId: string;
  family: ResourceForBookingDTO | null;
  resource: ResourceForBookingDTO | null;
}

export interface PreloadedResourcesOptions {
  families: ResourceForBookingDTO[];
  resources: ResourceForBookingDTO[];
}

export type SelectedPreloadedResourceValues =
  SelectedPreloadedResource[keyof SelectedPreloadedResource];

export interface PreloadedResourcesFilters {
  id: string;
  filterAction: (
    activeFilter: SelectedPreloadedResourceValues
  ) => (row: PreLoadedResourcesTableRow) => boolean | undefined;
}
