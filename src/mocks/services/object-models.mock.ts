import {
  ElementoProgramado,
  QuirofanoData,
} from "@ikusi/forward-api-typescript-fetch";
import {
  BarcodeReadingDTO,
  BookingRequestDTO,
  FullBookingTrackingDTO,
  InterventionDTO,
  PurchaseReportRow,
  ResourceCategoryDTO,
  ResourceDTO,
  ResourceForBookingDTO,
} from "@ikusi/resources-management-api-typescript-fetch";

export const mockFullBookingTrackingDTO: FullBookingTrackingDTO = {
  barcodeReading: {
    id: "64903432f1860bae2a8e967b",
    name: "lectura 1",
    refference: "999999999999999995",
    serialNumber: null,
    resourceId: "64903432f1860bae2a8e9654",
    batchNumber: "123456",
    price: 55.6,
    expiryDate: "2023-06-19T10:55:46.712Z",
    gfh: null,
    materialType: null,
    manufacturerCode: null,
    manufacturerName: null,
    manufacturerProductReference: null,
    providerCode: null,
    providerName: null,
    extFamilyCode: null,
    description: "",
  },
  bookedFrom: "2023-06-19T00:00:00.000Z",
  bookedTo: "2023-07-09T00:00:00.000Z",
  categoryId: "64903432f1860bae2a8e9630",
  hub: "1",
  id: "64903432f1860bae2a8e9684",
  interventionRequestCode: 1,
  incidences: [
    {
      id: "EXPIRED",
      i18n: {
        es: "Caducado",
        en: "Expired",
      },
    },
    {
      id: "MISSING_RESOURCE",
      i18n: {
        es: "Sin recurso asociado",
        en: "Missing resource",
      },
    },
    {
      id: "MISSING_BARCODE_READING",
      i18n: {
        es: "Sin recurso asociado",
        en: "Missing resource",
      },
    },
  ],
  resource: {
    id: "64903432f1860bae2a8e9654",
    name: "Material Medtronic 1",
    categoryId: "64903432f1860bae2a8e9630",
    hub: "1",
    surgicalHub: null,
    description: "Material de prueba",
  },
  state: {
    id: "READY",
    i18n: {
      en: "Ready",
      es: "Preparado",
    },
    date: "2023-06-19T10:55:46.723Z",
  },
  states: [
    {
      id: "READY",
      i18n: {
        en: "Ready",
        es: "Preparado",
      },
      date: "2023-06-19T10:55:46.723Z",
    },
  ],

  surgicalHub: "1000",
};

export const mockBookingRequestDTO: BookingRequestDTO = {
  id: "64915304b95e10d61913980a",
  resourceId: "64915289b95e10d6191397b1",
  interventionRequestCode: 1,
  hub: "1",
  bookedFrom: "2023-06-20T00:00:00.000Z",
  bookedTo: "2023-07-10T00:00:00.000Z",
  bookingOptions: { occupationTime: 0 },
};

export const mockResourceForBookingDTO: ResourceForBookingDTO = {
  id: "649010efdd4b7501f7cf9955",
  name: "Máquina Rayos X - 1",
  categoryId: "649010efdd4b7501f7cf9927",
  parentId: "649010efdd4b7501f7cf9949",
  quantity: 1,
  notAvailableFrom: "2023-06-19T00:00:00.000Z",
  notAvailableTo: "2023-07-09T00:00:00.000Z",
  hub: "1",
  occupationType: "surgical",
  isInstance: true,
  isLeaf: true,
  isAvailable: false,
  isBooked: true,
  defaultOccupationTime: null,
  defaultDelayTime: 0,
  generatesConflict: true,
  surgicalHub: "1000",
  hasInstances: true,
  trackable: true,
  description: null,
};

export const mockResourcesCategoriesDTO: ResourceCategoryDTO[] = [
  {
    id: "649010efdd4b7501f7cf9927",
    internalId: "equipments",
    name: "Equipments",
    parentId: null,
    children: [],
    generatesConflict: true,
    trackable: false,
  },
  {
    id: "649010efdd4b7501f7cf9929",
    internalId: "staff",
    name: "Staff",
    parentId: null,
    children: [],
    generatesConflict: true,
    trackable: false,
  },
];

export const mockElementoProgramado: ElementoProgramado = {
  necesitaPreoperatorio: true,
  estadoPreoperatorio: "APTO",
  fechaCitaPreoperatorio: "2023-06-19T13:19:25.477Z",
  fechaExpiracionPreoperatorio: "2023-06-19T13:19:25.477Z",
  id: 0,
  cic: "",
  quirofano: "",
  codSeccion: 0,
  codServicio: 0,
  codSolicitud: 0,
  customerId: 0,
  centro: 0,
  paciente: "",
  servicio: {
    identificador: "",
    descripcion: "",
  },
  prestacion: "",
  codPrestacion: "",
  duracion: 0,
  duracionHIS: 0,
  duracionInteligente: 0,
  datetimeinicio: "2023-06-19T13:19:25.477Z",
  datetimefin: "2023-06-19T13:19:25.477Z",
  datetimefindestino: "2023-06-19T13:19:25.477Z",
  inicio: "2023-06-19T13:19:25.477Z",
  hora: "",
  minDesdeInicio: 0,
  idDestino: 0,
  tiempoendestino: 0,
  equipamiento: [""],
  personal: [
    {
      id: "",
      nombre: "",
    },
  ],
  restricciones: [
    {
      nombre: "",
      icono: "",
    },
  ],
  cirujano: 0,
  nombreCirujano: "",
  anestesia: "",
  clasesExtra: "",
  pospuesto: true,
  leq: {
    horaInclusion: "",
    dateInclusion: "",
  },
  tipoAdmision: "",
  tienePreOperatorio: true,
  programado: true,
  eliminado: true,
  isHueco: true,
  creado: true,
  predictorCirujano: true,
  etiquetas: [
    {
      idEtiqueta: 0,
      idCentro: 0,
      codSolicitud: 0,
      fechaCreacion: "2023-06-19T13:19:25.477Z",
      inicioVigencia: "2023-06-19T13:19:25.477Z",
      finVigencia: "2023-06-19T13:19:25.477Z",
      usuarioInicioVigencia: "",
      usuarioFinVigencia: "",
    },
  ],
  tiempoIntercambio: 0,
  observaciones: "",
  destinoAlta: "",
  contieneErrores: true,
  error: "",
};

export const mockPurchaseReportRow: PurchaseReportRow = {
  batchNumber: { value: "123456", i18n: { es: "Lote", en: "Batch Number" } },
  expiryDate: {
    value: "2023-06-19T12:24:34.956Z",
    i18n: { es: "Fecha de Caducidad", en: "Expiry Date" },
  },
  hub: { value: "1", i18n: { es: "Centro", en: "Hub" } },
  interventionDate: {
    value: "2023-06-19T00:00:00.000Z",
    i18n: { es: "Fecha Intervención", en: "Intevention Date" },
  },
  interventionRequestCode: {
    value: 1,
    i18n: { es: "Código de solicitud", en: "Request Code" },
  },
  nHC: { value: "", i18n: { es: "NHC", en: "NHC" } },
  patientCompleteName: { value: "", i18n: { es: "Paciente", en: "Pacient" } },
  reportDate: {
    value: "2023-06-19T14:07:02.025Z",
    i18n: { es: "Fecha informe", en: "Report Date" },
  },
  manufacturerName: {
    value: "",
    i18n: { es: "Fabricante", en: "Manufacturer" },
  },
  manufacturerCode: {
    value: "",
    i18n: { es: "Código Fabricante", en: "Manufacturer Code" },
  },
  resourceName: {
    value: "lectura 1",
    i18n: { es: "Nombre Recurso", en: "Resource Name" },
  },
  resourceProductReference: {
    value: "",
    i18n: { es: "Ref.Producto", en: "Product Ref." },
  },
  materialType: {
    value: "",
    i18n: { es: "Tipo material", en: "Material Type" },
  },
  providerName: { value: "", i18n: { es: "Proveedor", en: "Provider" } },
  providerCode: {
    value: "",
    i18n: { es: "Códico Proveedor", en: "Provider Code" },
  },
  resourceReference: {
    value: "999999999999999995",
    i18n: { es: "Referencia", en: "Reference" },
  },
  serialNumber: {
    value: null,
    i18n: { es: "Num.Serie", en: "Serial Number" },
  },
  price: { value: 55.6, i18n: { es: "Precio", en: "Price" } },
};

export const mockInterventionDTO: InterventionDTO = {
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
};

export const mockResourceDTO: ResourceDTO = {
  id: "2",
  name: "",
  description: "",
  categoryId: "",
  parentId: "",
  hub: "",
  occupationType: "surgical",
  defaultOccupationTime: 0,
  defaultDelayTime: 0,
  generatesConflict: true,
  surgicalHub: "",
  hasInstances: true,
  trackable: true,
  quantity: 0,
  notAvailableFrom: "2023-06-20T10:07:35.388Z",
  notAvailableTo: "2023-06-20T10:07:35.388Z",
  isInstance: true,
  isLeaf: true,
};

export const mockBarcodeReadingDTO: BarcodeReadingDTO = {
  id: "64903432f1860bae2a8e967b",
  genericBarcodeReadingId: "",
  name: "",
  refference: "123456",
  serialNumber: "",
  expiryDate: "2023-06-20T10:15:04.227Z",
  batchNumber: "",
  price: 0,
  resourceId: "",
  manufacturer: "",
};

export const mockQuirofanoData: QuirofanoData = {
  Bloque: "Bloque 1",
  BloqueId: 4,
  CodQuirofano: "B1Q1",
  Id: 1,
  ref: "B1Q1",
  visualizacion: true,
};
