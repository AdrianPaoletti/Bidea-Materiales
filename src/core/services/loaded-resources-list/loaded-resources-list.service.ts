import {
  BarcodeReadingDTO,
  BookingTrackingState,
  FullBookingTrackingDTO,
  InterventionDTO,
} from "@ikusi/resources-management-api-typescript-fetch";

import { BOOKING_TRACKING_STATES } from "../../models/booking-tracking-states";
import {
  catalogApi,
  followedMaterialsApi,
} from "../resources-management-api-typescript-fetch/resources-management-api.service";

const newOrUpdateTrackingRequest = async (
  resourcesData: FullBookingTrackingDTO[],
  barcodeReadingMaterial: BarcodeReadingDTO,
  interventionData: InterventionDTO
) => {
  const foundResourceData = await findResource(
    resourcesData,
    barcodeReadingMaterial
  );
  if (foundResourceData) {
    return updateBookingTracking(
      interventionData,
      foundResourceData,
      barcodeReadingMaterial
    );
  }
  return createBookingTracking(interventionData, barcodeReadingMaterial);
};

const findResource = async (
  bookingTrackings: FullBookingTrackingDTO[],
  barcodeReadingMaterial: BarcodeReadingDTO
) => {
  //Buscamos la reserva cuya id de recurso coincida con el recurso asociado a la lectura
  let foundResourceData = bookingTrackings.find(
    (bookingTracking) =>
      barcodeReadingMaterial.resourceId &&
      bookingTracking.resource?.id === barcodeReadingMaterial.resourceId
  );
  if (foundResourceData) {
    return foundResourceData;
  }
  //Si no hay match, hay que comprobar que no se haya leído un recurso más concreto que el que tiene asociado la reserva (un hijo del recurso asociado)
  const resourceSet: Set<string> = new Set();

  //Todos los recursos de las reservas
  let resources = bookingTrackings.map(
    (bookinTrackng) => bookinTrackng.resource
  );

  //Buscamos entre los hijos
  for (let resource of resources) {
    if (!resource) {
      continue;
    }
    if (resourceSet.has(resource.id)) {
      continue;
    }
    const potentialMatches = await catalogApi.getAllResourceInstances({
      categoryId: resource.categoryId,
      parentId: resource.id,
    });
    for (const potentialMatch of potentialMatches) {
      foundResourceData = bookingTrackings.find(
        (bookingTracking) =>
          barcodeReadingMaterial.resourceId &&
          bookingTracking.resource?.id === resource?.id &&
          potentialMatch.id === barcodeReadingMaterial.resourceId
      );

      if (foundResourceData) {
        return foundResourceData;
      }
    }
    resourceSet.add(resource.id);
  }
};

const updateBookingTracking = async (
  interventionData: InterventionDTO,
  foundResourceData: FullBookingTrackingDTO,
  barcodeReading: BarcodeReadingDTO
) => {
  const state = BOOKING_TRACKING_STATES.READY as BookingTrackingState;
  state.date = new Date().toISOString();

  return followedMaterialsApi.updateTrackingRequest({
    bookingTrackingDTO: {
      id: foundResourceData.id,
      interventionRequestCode: interventionData.requestCode,
      resourceId: barcodeReading?.resourceId
        ? (barcodeReading?.resourceId as string)
        : null,
      barcodeReadingId: barcodeReading.id,
      states: [...foundResourceData.states, state],
      incidences: [],
      bookedFrom: interventionData.dateFrom,
      bookedTo: interventionData.dateTo,
      hub: foundResourceData.hub,
      surgicalHub: "",
      categoryId: foundResourceData.categoryId,
    },
  });
};

const createBookingTracking = async (
  interventionData: InterventionDTO,
  barcodeReading: BarcodeReadingDTO
) => {
  const resourceId = barcodeReading.resourceId;
  await followedMaterialsApi.newTrackingRequest({
    newTrackingRequestRequest: {
      hub: interventionData.hub,
      state: "READY",
      barcodeReadingId: barcodeReading.id,
      resourceId: resourceId ? (resourceId as string) : null,
      interventionRequestCode: interventionData.requestCode,
    },
  });
};

export { newOrUpdateTrackingRequest };
