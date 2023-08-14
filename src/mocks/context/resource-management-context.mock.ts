import { ResourcesManagementCreateContext } from "resources-management/core/store/context/ResourcesManagementContext";

export const resourceManagementContextMock: ResourcesManagementCreateContext = {
  clientSession: {
    UserName: "GestorBQ",
    centros: "1",
    secciones: "",
    permisos: "05,03,04,00,01,06,02,10,09,07,08,11,",
    centroActual: "1",
    apitoken: "apitoken",
    exp: 1685699366,
    token: "token",
  },
  setClientSession: jest.fn(),
  interventionData: {
    requestCode: 1,
    hub: "1",
    facultativeId: "1",
    procedureId: "1",
    serviceId: "1",
    dateFrom: "2023-06-19T00:00:00.000Z",
    dateTo: "2023-07-09T00:00:00.000Z",
    duration: 50,
    operatingRoom: "Q1",
    surgicalHub: "1000",
    proposal: true,
    patientExternalCode: "0000000001",
    patientName: "Test Name",
    patientSurname: "Surname",
  },
  setInterventionData: jest.fn(),
  prevUrl: "mock/mock",
  setPrevUrl: jest.fn(),
  userPermissions: [
    "rPrecargaRecursos",
    "wPrecargaRecursos",
    "rCargaRecursos",
    "wCargaRecursos",
    "rIncidencias",
    "wIncidencias",
    "rInformes",
    "wInformes",
    "admin",
  ],
  setUserPermissions: jest.fn(),
};