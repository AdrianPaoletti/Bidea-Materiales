import { resourceManagementContextMock } from "resources-management/mocks/context/resource-management-context.mock";
import {
  mockBookingRequestDTO,
  mockInterventionDTO,
  mockResourceForBookingDTO,
} from "resources-management/mocks/services/object-models.mock";
import {
  followedMaterialsApi,
  reservationsApi,
} from "../resources-management-api-typescript-fetch/resources-management-api.service";
import {
  deleteResource,
  getAutomatedProposal,
  getFamilies,
  getPreloadedResources,
  getResources,
  postResources,
} from "./preloaded-resources.service";

const { centroActual: mockCentroActual } =
  resourceManagementContextMock.clientSession;
const mockCategoryId = "64915289b95e10d61913978f";
const mockParentId = "64915289b95e10d6191397b1";
const postBookingRequestSpy = jest.spyOn(reservationsApi, "postBookingRequest");
const getInterventionBookingRequestsSpy = jest.spyOn(
  reservationsApi,
  "getInterventionBookingRequests"
);
const deleteBookingRequestSpy = jest.spyOn(
  reservationsApi,
  "deleteBookingRequest"
);
const newTrackingRequestSpy = jest.spyOn(
  followedMaterialsApi,
  "newTrackingRequest"
);

describe("Given a preloaded resources service", () => {
  describe("When getPreloadedResources function is invoked", () => {
    test("Then it should return the 'mockResourceForBookingDTO' converted into an array", async () => {
      const expectedResult = [mockResourceForBookingDTO];

      const result = await getPreloadedResources(
        mockInterventionDTO,
        mockCentroActual
      );

      expect(result).toEqual(expectedResult);
    });
  });

  describe("When getFamilies function is invoked", () => {
    test("Then it should return mockResourceForBookingDTO", async () => {
      const expectedResult = [mockResourceForBookingDTO];

      const result = await getFamilies(
        mockCategoryId,
        mockCentroActual,
        mockInterventionDTO
      );

      expect(result).toEqual(expectedResult);
    });
  });

  describe("When getResources function is invoked", () => {
    test("Then it should return mockResourceForBookingDTO", async () => {
      const expectedResult = [mockResourceForBookingDTO];

      const result = await getResources(
        mockParentId,
        mockCentroActual,
        mockInterventionDTO
      );

      expect(result).toEqual(expectedResult);
    });
  });

  describe("When postResources function is invoked", () => {
    test("Then it should call postBookingRequest and newTrackingRequest methods", async () => {
      const { isAvailable, isBooked, ...mockResource } =
        mockResourceForBookingDTO;
      const mockPostBookingRequestRequest = {
        interventionDTO: mockInterventionDTO,
        resourceDTO: mockResource,
        bookingOptions: { occupationTime: 0 },
      };
      const mockNewTrackingRequestRequest = {
        hub: mockCentroActual,
        state: "PLANNED",
        barcodeReadingId: null,
        resourceId: mockResourceForBookingDTO.id,
        interventionRequestCode: mockInterventionDTO.requestCode,
      };

      await postResources(
        mockResourceForBookingDTO,
        mockInterventionDTO,
        mockCentroActual
      );

      expect(postBookingRequestSpy).toHaveBeenCalledWith({
        postBookingRequestRequest: mockPostBookingRequestRequest,
      });
      expect(newTrackingRequestSpy).toHaveBeenCalledWith({
        newTrackingRequestRequest: mockNewTrackingRequestRequest,
      });
    });
  });

  describe("When deleteResource function is invoked", () => {
    test("Then it should call getInterventionBookingRequests and deleteBookingRequest methods", async () => {
      const mockBookingRequest = {
        hub: mockCentroActual,
        interventionRequestCode: mockInterventionDTO.requestCode,
      };
      const mockBookingRequestId = mockBookingRequestDTO.id;

      await deleteResource(mockParentId, mockInterventionDTO, mockCentroActual);

      expect(getInterventionBookingRequestsSpy).toHaveBeenCalledWith(
        mockBookingRequest
      );
      expect(deleteBookingRequestSpy).toHaveBeenCalledWith({
        bookingRequestId: mockBookingRequestId,
      });
    });
  });

  describe("When getAutomatedProposal function is invoked", () => {
    test("Then it should return mockResourceForBookingDTO", async () => {
      const expectedResult = [mockResourceForBookingDTO];

      const result = await getAutomatedProposal(mockInterventionDTO);

      expect(result).toEqual(expectedResult);
    });
  });
});
