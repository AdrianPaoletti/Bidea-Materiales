import {
  BarcodeReadingDTO,
  BookingTrackingValidStates,
  FullBookingTrackingDTO,
} from "@ikusi/resources-management-api-typescript-fetch";

import { ActiveFiltersValues } from "resources-management/core/models/active-filters.model";
import { LoadedResourcesReturnsFilters } from "resources-management/core/models/filters.model";
import { SelectedResourcesCategories } from "resources-management/core/models/selected-resources-categories.model";
import { ReturnsTableRow } from "../../components/Returns/ReturnsTable/returns-table.model";

export const getReturnsFilters: () => LoadedResourcesReturnsFilters[] = () => [
  {
    id: "categories",
    filterAction:
      (categories: ActiveFiltersValues) =>
      ({ type }: ReturnsTableRow) =>
        (categories as SelectedResourcesCategories[]).some(
          ({ id }) => id === type
        ),
  },
  {
    id: "refference",
    filterAction:
      (refference: ActiveFiltersValues) =>
      ({ refference: refferenceResourceData }: ReturnsTableRow) =>
        refferenceResourceData?.toLowerCase()?.includes(refference as string),
  },
  {
    id: "nameDescription",
    filterAction:
      (nameDescription: ActiveFiltersValues) =>
      ({ nameDescription: nameDescriptionResourceData }: ReturnsTableRow) =>
        nameDescriptionResourceData?.some(({ value }) =>
          value?.toLowerCase()?.includes(nameDescription as string)
        ),
  },
];

export const bookingTrackingsToTableRows = (
  resourcesData: FullBookingTrackingDTO[]
): ReturnsTableRow[] => {
  return resourcesData.map((row) => ({
    id: row.id,
    nameDescription: [
      { id: "name", value: row.resource?.name },
      { id: "description", value: row.resource?.description },
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

export const unReturnableStates: Array<BookingTrackingValidStates> = [
  "PLANNED",
];
export const checkedStates: Array<BookingTrackingValidStates> = [
  "CHARGED_TO_PATIENT",
  "WAREHOUSE_CONSUMPTION",
  "WAREHOUSE_DEVOLUTION",
  "PRE_WAREHOUSE_DEVOLUTION",
];

export const matchReadingWithTracking = (
  rows: FullBookingTrackingDTO[],
  barcodeReadingDTO: BarcodeReadingDTO
) => {
  const unmatchableStates: Array<BookingTrackingValidStates> = [
    "WAREHOUSE_CONSUMPTION",
    "CHARGED_TO_PATIENT",
    "WAREHOUSE_DEVOLUTION",
    "PRE_WAREHOUSE_DEVOLUTION",
  ];
  const matchableRows = rows.filter(
    (row) => !unmatchableStates.includes(row.state.id)
  );
  return matchableRows.find(
    (row) => row.barcodeReading?.id === barcodeReadingDTO.id
  );
};
