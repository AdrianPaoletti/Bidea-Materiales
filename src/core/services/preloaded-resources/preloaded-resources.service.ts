import {
  GetResourcesPredictionRequest,
  InterventionDTO,
  ResourceForBookingDTO,
} from "@ikusi/resources-management-api-typescript-fetch";

import {
  followedMaterialsApi,
  predictorApi,
  reservationsApi,
  resourcesApi,
} from "../resources-management-api-typescript-fetch/resources-management-api.service";

const getPreloadedResources = async (
  interventionData: InterventionDTO,
  centroActual: string
) => {
  const interventionsBooking =
    await reservationsApi.getInterventionBookingRequests({
      hub: centroActual,
      interventionRequestCode: interventionData.requestCode,
    });
  const resourcesForBooking = await Promise.all(
    interventionsBooking.map(({ resourceId }) =>
      resourcesApi.getBookedResource({
        resourceId,
        requestBookingFrom: interventionData.dateFrom,
        requestBookingTo: interventionData.dateTo,
      })
    )
  );
  return resourcesForBooking;
};

const getFamilies = (
  categoryId: string,
  centroActual: string,
  interventionData: InterventionDTO
) =>
  resourcesApi.getRootResources({
    categoryId,
    hub: centroActual,
    requestBookingFrom: interventionData.dateFrom,
    requestBookingTo: interventionData.dateTo,
  });

const getResources = (
  parentId: string,
  centroActual: string,
  interventionData: InterventionDTO
) =>
  resourcesApi.getInstanceResources({
    parentId,
    hub: centroActual,
    requestBookingFrom: interventionData.dateFrom,
    requestBookingTo: interventionData.dateTo,
  });

const postResources = async (
  resourceForBooking: ResourceForBookingDTO,
  interventionData: InterventionDTO,
  centroActual: string
) => {
  const { trackable } = resourceForBooking;
  const { isAvailable, isBooked, ...resource } = resourceForBooking;
  await reservationsApi.postBookingRequest({
    postBookingRequestRequest: {
      interventionDTO: interventionData,
      resourceDTO: resource,
      bookingOptions: { occupationTime: 0 },
    },
  });
  if (trackable) {
    await followedMaterialsApi.newTrackingRequest({
      newTrackingRequestRequest: {
        hub: centroActual,
        state: "PLANNED",
        barcodeReadingId: null,
        resourceId: resourceForBooking.id,
        interventionRequestCode: interventionData.requestCode,
      },
    });
  }
};

const deleteResource = async (
  resourceId: string,
  interventionData: InterventionDTO,
  centroActual: string
) => {
  const bookingrequests = await reservationsApi.getInterventionBookingRequests({
    hub: centroActual,
    interventionRequestCode: interventionData.requestCode,
  });

  const bookingRequestToDelete = bookingrequests.find(
    (bookingRequest) => bookingRequest.resourceId === resourceId
  );
  if (bookingRequestToDelete && bookingRequestToDelete.id) {
    await reservationsApi.deleteBookingRequest({
      bookingRequestId: bookingRequestToDelete.id,
    });
  }
};

const getAutomatedProposal = async (interventionData: InterventionDTO) => {
  const resourcesPredictionRequest: GetResourcesPredictionRequest = {
    interventionDTO: interventionData,
    dateFrom: interventionData.dateFrom,
    dateTo: interventionData.dateTo,
  };
  const resourcesPrediction = await predictorApi.getResourcesPrediction({
    getResourcesPredictionRequest: resourcesPredictionRequest,
  });
  return resourcesPrediction;
};

export {
  getPreloadedResources,
  getFamilies,
  getResources,
  getAutomatedProposal,
  postResources,
  deleteResource,
};
