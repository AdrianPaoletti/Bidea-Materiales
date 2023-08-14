import { BookingTrackingState } from "@ikusi/resources-management-api-typescript-fetch";

import { BOOKING_TRACKING_STATES } from "resources-management/core/models/booking-tracking-states";
import { mockFullBookingTrackingDTO } from "resources-management/mocks/services/object-models.mock";
import { followedMaterialsApi } from "../resources-management-api-typescript-fetch/resources-management-api.service";
import { updateTrackingRequestState } from "./tracking-requests.service";

describe("Given a updateTrackingRequestState function", () => {
  describe("When is invoked", () => {
    test("Then it should call updateTrackingRequest method with the bookingTrackingDTO request body", () => {
      const newState = BOOKING_TRACKING_STATES[
        "CHARGED_TO_PATIENT"
      ] as BookingTrackingState;
      newState.date = new Date().toISOString();
      const bookingTrackingDTO = {
        id: mockFullBookingTrackingDTO.id,
        interventionRequestCode:
          mockFullBookingTrackingDTO.interventionRequestCode,
        resourceId: mockFullBookingTrackingDTO.resource?.id || null,
        barcodeReadingId: mockFullBookingTrackingDTO.barcodeReading?.id || null,
        states: [...mockFullBookingTrackingDTO.states, newState],
        incidences: [],
        bookedFrom: mockFullBookingTrackingDTO.bookedFrom,
        bookedTo: mockFullBookingTrackingDTO.bookedTo,
        hub: mockFullBookingTrackingDTO.hub,
        surgicalHub: mockFullBookingTrackingDTO.surgicalHub,
        categoryId: mockFullBookingTrackingDTO.categoryId,
      };

      updateTrackingRequestState(
        mockFullBookingTrackingDTO,
        "CHARGED_TO_PATIENT"
      );

      expect(followedMaterialsApi.updateTrackingRequest).toHaveBeenCalledWith({
        bookingTrackingDTO,
      });
    });
  });
});
