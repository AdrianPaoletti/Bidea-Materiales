import {
  BookingTrackingIncidence,
  BookingTrackingState,
  BookingTrackingValidStates,
  ValidBookingTrackingIncidences,
} from "@ikusi/resources-management-api-typescript-fetch";

import { colorPalette } from "resources-management/styles/themes/color-palette";

export const getIncidencesRowColor = (
  incidences: Array<BookingTrackingIncidence>
): {
  backgroundColor: string;
  disabled?: boolean;
  id?: ValidBookingTrackingIncidences;
} => {
  if (incidences.find(({ id }) => id === "EXPIRED")) {
    return { backgroundColor: colorPalette.rows.expired, id: "EXPIRED" };
  }
  return { backgroundColor: colorPalette.rows.missing, id: "MISSING_RESOURCE" };
};

export const getStateRowColor = ({
  id: stateId,
}: BookingTrackingState): {
  backgroundColor: string;
  disabled?: boolean;
  id?: BookingTrackingValidStates;
} => {
  switch (stateId) {
    case "PLANNED":
    case "READY":
      return { backgroundColor: colorPalette.rows.plannedReady };
    case "WAREHOUSE_DEVOLUTION":
    case "CHARGED_TO_PATIENT":
    case "PRE_WAREHOUSE_DEVOLUTION":
      return {
        backgroundColor: colorPalette.rows.devolution,
        disabled: true,
      };
    case "WAREHOUSE_CONSUMPTION":
      return { backgroundColor: colorPalette.rows.consumption };
  }
};
