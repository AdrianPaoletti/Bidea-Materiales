import {
  BookingTrackingValidStates,
  FullBookingTrackingDTO,
} from "@ikusi/resources-management-api-typescript-fetch";

import { ActiveFiltersValues } from "resources-management/core/models/active-filters.model";
import { LoadedResourcesReturnsFilters } from "resources-management/core/models/filters.model";
import { SelectedResourcesCategories } from "resources-management/core/models/selected-resources-categories.model";
import { LoadedResourcesTableRow } from "../../components/LoadedResourcesList/LoadedResourcesTable/loaded-resources-table.model";

export const checkedStates: Array<BookingTrackingValidStates> = [
  "READY",
  "CHARGED_TO_PATIENT",
  "WAREHOUSE_CONSUMPTION",
  "WAREHOUSE_DEVOLUTION",
  "PRE_WAREHOUSE_DEVOLUTION",
];

export const chargedState = (resourcesData: FullBookingTrackingDTO[]) => {
  return {
    charged: resourcesData.filter((r) => checkedStates.includes(r.state.id))
      .length,
    total: resourcesData.length,
  };
};

export const loadedResourcesListFilters: () => LoadedResourcesReturnsFilters[] =
  () => [
    {
      id: "categories",
      filterAction:
        (categories: ActiveFiltersValues) =>
        ({ type }: LoadedResourcesTableRow) =>
          (categories as SelectedResourcesCategories[]).some(
            ({ id }) => id === type
          ),
    },
    {
      id: "refference",
      filterAction:
        (refference: ActiveFiltersValues) =>
        ({ refference: refferenceResourceData }: LoadedResourcesTableRow) =>
          refferenceResourceData?.toLowerCase()?.includes(refference as string),
    },
    {
      id: "nameDescription",
      filterAction:
        (nameDescription: ActiveFiltersValues) =>
        ({
          nameDescription: nameDescriptionResourceData,
        }: LoadedResourcesTableRow) =>
          nameDescriptionResourceData?.some(({ value }) =>
            value?.toLowerCase()?.includes(nameDescription as string)
          ),
    },
  ];

export const formatResourcesData = (
  resourcesData: FullBookingTrackingDTO[]
): LoadedResourcesTableRow[] => {
  return resourcesData.map((row) => ({
    id: row.id,
    nameDescription: [
      { id: "name", value: row.resource?.name || undefined },
      { id: "description", value: row.resource?.description || undefined },
    ],
    quantity: 1,
    refference: row.barcodeReading?.refference,
    serialNumber:
      row.barcodeReading?.serialNumber || row.barcodeReading?.batchNumber,
    expireDate: row.barcodeReading?.expiryDate,
    manufacturer: row.barcodeReading?.manufacturerName,
    type: row.categoryId || row.resource?.categoryId,
    state: row.state,
    incidence: row.incidences,
    actionIconButtons: "",
  }));
};
