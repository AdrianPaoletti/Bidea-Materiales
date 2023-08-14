import { BookingTrackingState, BookingTrackingValidStates, FullBookingTrackingDTO } from "@ikusi/resources-management-api-typescript-fetch";

import { BOOKING_TRACKING_STATES } from "../../models/booking-tracking-states";
import { followedMaterialsApi } from "../resources-management-api-typescript-fetch/resources-management-api.service";

/**
 * Updates given trackingRequest changing it's state to state
 * @param trackingRequest 
 * @param state 
 */
export const updateTrackingRequestState = async (trackingRequest: FullBookingTrackingDTO, state: BookingTrackingValidStates) => {


    const newState = BOOKING_TRACKING_STATES[state] as BookingTrackingState;
    newState.date = new Date().toISOString();

    await followedMaterialsApi.updateTrackingRequest({
        bookingTrackingDTO: {
            id: trackingRequest.id,
            interventionRequestCode: trackingRequest.interventionRequestCode,
            resourceId: trackingRequest.resource?.id || null,
            barcodeReadingId: trackingRequest.barcodeReading?.id || null,
            states: [...trackingRequest.states, newState],
            incidences: [],
            bookedFrom: trackingRequest.bookedFrom,
            bookedTo: trackingRequest.bookedTo,
            hub: trackingRequest.hub,
            surgicalHub: trackingRequest.surgicalHub,
            categoryId: trackingRequest.categoryId,
        },
    });
}
