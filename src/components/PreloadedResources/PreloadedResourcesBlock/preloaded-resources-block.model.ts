import {
  InterventionDTO,
  ResourceForBookingDTO,
} from "@ikusi/resources-management-api-typescript-fetch";

import { SelectedPreloadedResource } from "../preloaded-resources.model";

export interface InterventionDataInformation {
  id: keyof InterventionDTO;
  label: string;
  format?: (value: string | number | boolean) => string;
}

export interface AutoCompleteInputs {
  id: keyof SelectedPreloadedResource;
  label: string;
  options: ResourceForBookingDTO[];
}
