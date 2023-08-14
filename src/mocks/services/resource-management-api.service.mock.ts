import {
  mockBarcodeReadingDTO,
  mockBookingRequestDTO,
  mockFullBookingTrackingDTO,
  mockInterventionDTO,
  mockPurchaseReportRow,
  mockResourceDTO,
  mockResourceForBookingDTO,
  mockResourcesCategoriesDTO,
} from "./object-models.mock";

jest.mock(
  "../../core/services/resources-management-api-typescript-fetch/resources-management-api.service",
  () => ({
    barCodeReadingApi: {
      addOrUpdateBarCodeReading: jest
        .fn()
        .mockReturnValue(mockBarcodeReadingDTO),
    },
    resourcesApi: {
      getAllCategories: jest.fn().mockReturnValue([mockResourcesCategoriesDTO]),
      getBookedResource: jest.fn().mockReturnValue(mockResourceForBookingDTO),
      getRootResources: jest.fn().mockReturnValue([mockResourceForBookingDTO]),
      getInstanceResources: jest
        .fn()
        .mockReturnValue([mockResourceForBookingDTO]),
    },
    reservationsApi: {
      getInterventionBookingRequests: jest
        .fn()
        .mockReturnValue([mockBookingRequestDTO]),
      postBookingRequest: jest.fn(),
      deleteBookingRequest: jest.fn(),
    },
    interventionsManagementApi: {
      getIntervention: jest.fn().mockReturnValue(mockInterventionDTO),
    },
    followedMaterialsApi: {
      updateTrackingRequest: jest.fn(),
      queryBookingTrackings: jest.fn().mockReturnValue([
        mockFullBookingTrackingDTO,
        {
          ...mockFullBookingTrackingDTO,
          id: "4",
        },
        { ...mockFullBookingTrackingDTO, hub: "2", id: "5" },
      ]),
      newTrackingRequest: jest.fn(),
      deleteTrackingRequest: jest.fn(),
      mergeBookingTracking: jest.fn(),
      getPurchaseReport: jest.fn().mockReturnValue([mockPurchaseReportRow]),
    },
    predictorApi: {
      getResourcesPrediction: jest
        .fn()
        .mockReturnValue([mockResourceForBookingDTO]),
    },
    catalogApi: {
      getAllResourceInstances: jest.fn().mockReturnValue([mockResourceDTO]),
    },
    coreAPi: {
      getLogo: jest.fn().mockReturnValue({ base: "", width: 200, heigth: 200 }),
    },
  })
);
