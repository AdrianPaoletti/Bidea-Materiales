import { BookingTrackingValidStates } from "@ikusi/resources-management-api-typescript-fetch";

export interface BookingTrackingState {
    id: BookingTrackingValidStates;
    i18n: {
        en: string;
        es: string;
    }
}

export const BOOKING_TRACKING_STATES
    : { [key in BookingTrackingValidStates]: BookingTrackingState } =
{
    PLANNED: {
        id: "PLANNED",
        i18n: {
            en: "Planned",
            es: "Planificado"
        }
    },
    READY: {
        id: "READY",
        i18n: {
            en: "Ready",
            es: "Preparado"
        }
    },
    WAREHOUSE_CONSUMPTION: {
        id: "WAREHOUSE_CONSUMPTION",
        i18n: {
            es: "Consumo almacén",
            en: "Warehouse consumption"
        }
    },
    CHARGED_TO_PATIENT: {
        id: "CHARGED_TO_PATIENT",
        i18n: {
            es: "Imputado a paciente",
            en: "Charged to patient"
        }
    },
    WAREHOUSE_DEVOLUTION: {
        id: "WAREHOUSE_DEVOLUTION",
        i18n: {
            es: "Devuelto a almacén",
            en: "Warehouse devolution"
        }
    },

    PRE_WAREHOUSE_DEVOLUTION: {
        id: "PRE_WAREHOUSE_DEVOLUTION",
        i18n: {
            es: "Marcado como devuelto a almacén",
            en: "Tagged as warehouse devolution"
        }
    }
};
