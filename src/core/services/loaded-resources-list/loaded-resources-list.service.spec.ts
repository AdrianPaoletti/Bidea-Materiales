import {
  BookingTrackingState,
  FullBookingTrackingDTOResource,
} from "@ikusi/resources-management-api-typescript-fetch";

import { BOOKING_TRACKING_STATES } from "resources-management/core/models/booking-tracking-states";
import {
  mockBarcodeReadingDTO,
  mockFullBookingTrackingDTO,
  mockInterventionDTO,
} from "resources-management/mocks/services/object-models.mock";
import { followedMaterialsApi } from "../resources-management-api-typescript-fetch/resources-management-api.service";
import { newOrUpdateTrackingRequest } from "./loaded-resources-list.service";

const newTrackingRequestSpy = jest.spyOn(
  followedMaterialsApi,
  "newTrackingRequest"
);
const updateTrackingRequestSpy = jest.spyOn(
  followedMaterialsApi,
  "updateTrackingRequest"
);

describe("Given a loaded resources list service", () => {
  describe("When newOrUpdateTrackingRequest function is invoked and does not find resourceData", () => {
    test("Then it should call newTrackingRequest method", async () => {
      const mockFullBookingTrackingDTOArray = [
        mockFullBookingTrackingDTO,
        {
          ...mockFullBookingTrackingDTO,
          resource: {
            ...mockFullBookingTrackingDTO.resource,
          } as FullBookingTrackingDTOResource,
        },
        { ...mockFullBookingTrackingDTO, resource: null },
      ];
      const mockNewTrackingRequestRequest = {
        hub: mockInterventionDTO.hub,
        state: "READY",
        barcodeReadingId: mockBarcodeReadingDTO.id,
        resourceId: null,
        interventionRequestCode: mockInterventionDTO.requestCode,
      };

      await newOrUpdateTrackingRequest(
        mockFullBookingTrackingDTOArray,
        mockBarcodeReadingDTO,
        mockInterventionDTO
      );

      expect(newTrackingRequestSpy).toHaveBeenCalledWith({
        newTrackingRequestRequest: mockNewTrackingRequestRequest,
      });
    });
  });

  describe("When newOrUpdateTrackingRequest function is invoked and does find resourceData on the first condition", () => {
    test("Then it should call updateTrackingRequestSpy", async () => {
      const mockResourceId = mockFullBookingTrackingDTO.barcodeReading
        ?.resourceId as string;
      const mockState = BOOKING_TRACKING_STATES.READY as BookingTrackingState;
      mockState.date = new Date().toISOString();
      const mockBookingTrackingDTO = {
        id: mockFullBookingTrackingDTO.id,
        interventionRequestCode: mockInterventionDTO.requestCode,
        resourceId: mockResourceId,
        barcodeReadingId: mockBarcodeReadingDTO.id,
        states: [...mockFullBookingTrackingDTO.states, mockState],
        incidences: [],
        bookedFrom: mockInterventionDTO.dateFrom,
        bookedTo: mockInterventionDTO.dateTo,
        hub: mockFullBookingTrackingDTO.hub,
        surgicalHub: "",
        categoryId: mockFullBookingTrackingDTO.categoryId,
      };

      await newOrUpdateTrackingRequest(
        [mockFullBookingTrackingDTO],
        { ...mockBarcodeReadingDTO, resourceId: mockResourceId },
        mockInterventionDTO
      );

      expect(updateTrackingRequestSpy).toHaveBeenCalledWith({
        bookingTrackingDTO: mockBookingTrackingDTO,
      });
    });
  });

  describe("When newOrUpdateTrackingRequest function is invoked and does find resourceData on the second condition", () => {
    test("Then it should call updateTrackingRequestSpy", async () => {
      const mockResourceId = mockFullBookingTrackingDTO.barcodeReading
        ?.resourceId as string;
      const mockState = BOOKING_TRACKING_STATES.READY as BookingTrackingState;
      mockState.date = new Date().toISOString();
      const mockBookingTrackingDTO = {
        id: mockFullBookingTrackingDTO.id,
        interventionRequestCode: mockInterventionDTO.requestCode,
        resourceId: mockResourceId,
        barcodeReadingId: mockBarcodeReadingDTO.id,
        states: [...mockFullBookingTrackingDTO.states, mockState],
        incidences: [],
        bookedFrom: mockInterventionDTO.dateFrom,
        bookedTo: mockInterventionDTO.dateTo,
        hub: mockFullBookingTrackingDTO.hub,
        surgicalHub: "",
        categoryId: mockFullBookingTrackingDTO.categoryId,
      };
      const mockFullBookingTrackingDTOArray = [
        mockFullBookingTrackingDTO,
        {
          ...mockFullBookingTrackingDTO,
          resource: {
            ...mockFullBookingTrackingDTO.resource,
          } as FullBookingTrackingDTOResource,
        },
        { ...mockFullBookingTrackingDTO, resource: null },
      ];

      await newOrUpdateTrackingRequest(
        mockFullBookingTrackingDTOArray,
        { ...mockBarcodeReadingDTO, resourceId: "2" },
        mockInterventionDTO
      );

      expect(updateTrackingRequestSpy).toHaveBeenCalledWith({
        bookingTrackingDTO: mockBookingTrackingDTO,
      });
    });
  });
});
